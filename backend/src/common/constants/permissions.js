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
    'merchants:view_all',
    'merchants:approve',
    'merchants:suspend',
    'products:view_all',
    'products:edit_any',
    'products:delete_any',
    'orders:view_all',
    'orders:manage_any',
    'orders:update_status', // Explicit authority for state transitions
    'dashboard:view_global_analytics',
    'users:view_all',
    'users:manage_any',
    'system:config',
  ],
};
