import { Roles, UserRole } from '../../common/constants/roles.js';

/**
 * User Model structure (Database-compatible)
 * 
 * Fields:
 * - id: String (UUID) - Primary Key
 * - email: String - Unique, required
 * - role: Enum (CUSTOMER, MERCHANT, ADMIN) - Defaults to CUSTOMER
 * - otpHash: String? - Optional, for future OTP authentication
 * - createdAt: Date
 * - updatedAt: Date
 */

export const validateUserRole = (role) => {
  if (!Roles.includes(role)) {
    throw new Error(`Invalid role: ${role}. Must be one of: ${Roles.join(', ')}`);
  }
  return true;
};

// This represents the conceptual model for the user table
export const UserModel = {
  tableName: 'users',
  fields: {
    id: { type: 'String', primaryKey: true },
    email: { type: 'String', unique: true, required: true },
    role: { 
      type: 'Enum', 
      values: Roles, 
      default: UserRole.CUSTOMER,
      required: true 
    },
    isApproved: { 
      type: 'Boolean', 
      default: false,
      description: 'Required for merchants to start selling'
    },
    password: { 
      type: 'String', 
      required: false,
      description: 'Hashed password for email login'
    },
    phone: { 
      type: 'String', 
      unique: true, 
      required: false,
      description: 'Required for future OTP login'
    },
    otpExpiresAt: { 
      type: 'Date', 
      required: false,
      description: 'Expiration timestamp for OTP'
    },
    otpHash: { type: 'String', required: false },
    createdAt: { type: 'Date' },
    updatedAt: { type: 'Date' }
  }
};
