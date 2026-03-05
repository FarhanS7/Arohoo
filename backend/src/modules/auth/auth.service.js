import { AppError } from '../../common/errors/AppError.js';
import { generateToken } from '../../common/utils/jwt.js';
import { hashPassword } from '../../common/utils/password.js';
import prisma from '../../infrastructure/database/prisma.js';

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
    const { email, password, storeName } = merchantData;

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    // 2. Hash password
    const hashedPassword = await hashPassword(password);

    // 3. Create User and Merchant in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'MERCHANT',
        },
      });

      await tx.merchant.create({
        data: {
          storeName,
          userId: newUser.id,
          isApproved: false, // Explicitly false for new merchants
        },
      });

      return newUser;
    });

    // 4. Generate token
    const token = generateToken({
      userId: result.id,
      role: result.role,
    });

    return token;
  }
}
