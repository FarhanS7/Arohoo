import { UserRole } from './roles.js';

export const Permissions = {
  [UserRole.CUSTOMER]: [
    'products:browse',
    'orders:create',
    'orders:view_own',
    'orders:cancel_own',
    'orders:update_address_own',
    'reviews:create',
    'wishlist:manage',
    'profile:view_own',
    'profile:update_own',
  ],
  [UserRole.MERCHANT]: [
    'products:manage',
    'orders:view_merchant',
    'orders:update_status',
    'profile:view_own',
    'profile:update_own',
  ],
  [UserRole.ADMIN]: [
    'users:manage',
    'merchants:manage',
    'products:manage',
    'orders:manage',
    'system:config',
  ],
};
