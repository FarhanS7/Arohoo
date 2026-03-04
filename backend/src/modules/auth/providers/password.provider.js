import bcrypt from 'bcryptjs';

/**
 * Provider for handling password-based authentication.
 */
export class PasswordProvider {
  /**
   * Hashes a plain text password.
   * @param {string} password - Plain text password.
   * @returns {Promise<string>} - Hashed password.
   */
  static async hash(password) {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compares a plain text password with a hash.
   * @param {string} password - Plain text password.
   * @param {string} hash - Hashed password.
   * @returns {Promise<boolean>} - Result of comparison.
   */
  static async verify(password, hash) {
    return bcrypt.compare(password, hash);
  }
}
