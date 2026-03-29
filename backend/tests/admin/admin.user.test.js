import { jest } from '@jest/globals';
import { AdminService } from '../../src/modules/admin/admin.service.js';

describe('AdminService User Management', () => {
  let adminService;
  let mockPrisma;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };
    adminService = new AdminService(mockPrisma);
  });

  describe('listUsers', () => {
    it('should return a list of users', async () => {
      const mockUsers = [
        { id: '1', email: 'a@a.com', role: 'ADMIN', status: 'ACTIVE', createdAt: new Date() },
        { id: '2', email: 'b@b.com', role: 'CUSTOMER', status: 'ACTIVE', createdAt: new Date() }
      ];
      mockPrisma.user.findMany.mockResolvedValue(mockUsers);

      const result = await adminService.listUsers();

      expect(mockPrisma.user.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('updateUserRole', () => {
    it('should update user role successfully', async () => {
      const userId = '123';
      const newRole = 'MERCHANT';
      mockPrisma.user.findUnique.mockResolvedValue({ id: userId });
      mockPrisma.user.update.mockResolvedValue({ id: userId, role: newRole });

      const result = await adminService.updateUserRole(userId, newRole);

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { role: newRole },
        select: expect.any(Object)
      });
      expect(result.role).toBe(newRole);
    });

    it('should throw 404 if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(adminService.updateUserRole('999', 'MERCHANT'))
        .rejects.toThrow('User not found');
    });
  });

  describe('updateUserStatus', () => {
    it('should update user status successfully', async () => {
      const userId = '123';
      const newStatus = 'SUSPENDED';
      mockPrisma.user.findUnique.mockResolvedValue({ id: userId });
      mockPrisma.user.update.mockResolvedValue({ id: userId, status: newStatus });

      const result = await adminService.updateUserStatus(userId, newStatus);

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { status: newStatus },
        select: expect.any(Object)
      });
      expect(result.status).toBe(newStatus);
    });

    it('should throw 404 if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(adminService.updateUserStatus('999', 'SUSPENDED'))
        .rejects.toThrow('User not found');
    });
  });
});
