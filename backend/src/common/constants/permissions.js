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
    'products:create',
    'products:edit_own',
    'products:delete_own',
    'products:upload_images',
    'orders:view_own',
    'dashboard:view_analytics',
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
