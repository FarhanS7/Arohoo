import { AppError } from '../../common/errors/AppError.js';
import { generateToken } from '../../common/utils/jwt.js';
import { hashPassword, verifyPassword } from '../../common/utils/password.js';
import prisma from '../../infrastructure/database/prisma.js';
import { cacheUtil } from '../../common/utils/cache.js';

export class AuthService {
  /**
   * Registers a new customer.
   * @param {Object} userData - Contains email and password.
   * @returns {Promise<string>} - The generated JWT token.
   */
  async register(userData) {
    const { email, password } = userData;

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    // 2. Hash password
    const hashedPassword = await hashPassword(password);

    // 3. Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'CUSTOMER',
      },
    });

    // 4. Generate token
    const token = generateToken({
      userId: newUser.id,
      role: newUser.role,
    });

    return token;
  }

  /**
   * Registers a new merchant.
   * Creates both a User and a Merchant profile in a transaction.
   * @param {Object} merchantData - Contains email, password, and storeName.
   * @returns {Promise<string>} - The generated JWT token.
   */
  async registerMerchant(merchantData) {
    const { email, password, name, storeName, address, phone, categoryIds } = merchantData;

    // 1. Check if user already exists (by email or phone)
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      throw new AppError('Email already in use', 400);
    }

    if (phone) {
      const existingUserByPhone = await prisma.user.findUnique({
        where: { phone },
      });

      if (existingUserByPhone) {
        throw new AppError('Phone number already in use', 400);
      }
    }

    // 2. Hash password
    const hashedPassword = await hashPassword(password);

    // 3. Create User and Merchant in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          name,
          phone,
          password: hashedPassword,
          role: 'MERCHANT',
        },
      });

      const newMerchant = await tx.merchant.create({
        data: {
          storeName,
          address,
          userId: newUser.id,
          isApproved: false,
          status: 'PENDING',
          categories: {
            connect: categoryIds?.map(id => ({ id })) || []
          }
        },
      });

      return { user: newUser, merchant: newMerchant };
    });

    // 4. Generate token
    const token = generateToken({
      userId: result.user.id,
      role: result.user.role,
      merchantId: result.merchant.id,
    });

    return token;
  }

  /**
   * Authenticates a user and issues a JWT token.
   * @param {Object} credentials - Contains email and password.
   * @returns {Promise<string>} - The generated JWT token.
   */
  async login(credentials) {
    const { email, password } = credentials;

    // 1. Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // 2. Verify password
    const isPasswordValid = await verifyPassword(user.password, password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // 3. Get merchant info if merchant and check approval
    let merchantId = null;
    if (user.role === 'MERCHANT') {
      const merchant = await prisma.merchant.findUnique({
        where: { userId: user.id },
      });
      
      if (!merchant?.isApproved) {
        throw new AppError('Your account is pending approval. Please wait for admin verification.', 403);
      }
      
      merchantId = merchant?.id;
    }

    // 4. Generate token
    const token = generateToken({
      userId: user.id,
      role: user.role,
      merchantId,
    });

    return token;
  }

  /**
   * Retrieves a user by their ID.
   * @param {string} userId - The unique ID of the user.
   * @returns {Promise<Object>} - The user object.
   */
  async getUserById(userId) {
    const cacheKey = `user:profile:${userId}`;
    const cachedUser = cacheUtil.get(cacheKey);
    if (cachedUser) return cachedUser;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        merchant: {
          select: {
            id: true,
            storeName: true,
            isApproved: true,
          }
        }
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Flatten merchant info if it exists
    const merchantId = user.merchant?.id || null;
    
    const result = {
      id: user.id,
      email: user.email,
      role: user.role,
      merchantId,
      merchant: user.merchant
    };

    cacheUtil.set(cacheKey, result, 300); // Cache for 5 mins
    return result;
  }
}
