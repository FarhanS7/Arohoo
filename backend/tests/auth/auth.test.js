import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { AuthService } from '../../src/modules/auth/auth.service.js';
import { PasswordProvider } from '../../src/modules/auth/providers/password.provider.js';

describe('AuthService', () => {
  let authService;
  let mockPrisma;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
      },
    };
    authService = new AuthService(mockPrisma);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        role: 'CUSTOMER',
      };

      mockPrisma.user.findFirst.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-uuid',
        ...userData,
      });

      const result = await authService.register(userData);

      expect(result.user.email).toBe(userData.email);
      expect(result.token).toBeDefined();
      expect(mockPrisma.user.create).toHaveBeenCalled();
    });

    it('should throw 409 if user already exists', async () => {
      mockPrisma.user.findFirst.mockResolvedValue({ id: 'existing-id' });

      await expect(authService.register({ email: 'duplicate@example.com', password: 'p' }))
        .rejects.toThrow('User with this email or phone already exists');
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const password = 'correct-password';
      const hashedPassword = await PasswordProvider.hash(password);
      const user = { id: 'u1', email: 'u1@ex.com', password: hashedPassword, role: 'CUSTOMER' };

      mockPrisma.user.findUnique.mockResolvedValue(user);

      const result = await authService.login(user.email, password);

      expect(result.user.id).toBe(user.id);
      expect(result.token).toBeDefined();
    });

    it('should throw 401 with invalid credentials', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(authService.login('nonexistent@ex.com', 'pass'))
        .rejects.toThrow('Invalid email or password');
    });
  });
});
