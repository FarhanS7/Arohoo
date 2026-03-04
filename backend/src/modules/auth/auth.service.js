import { JwtService } from '../../infrastructure/services/jwt.service.js';

/**
 * Orchestrator service for authentication logic.
 */
export class AuthService {
  /**
   * Generates a stateless JWT token for the user.
   * @param {Object} user - User object containing id and role.
   * @returns {string} - Signed JWT token.
   */
  generateToken(user) {
    const payload = {
      sub: user.id,
      role: user.role
    };
    return JwtService.sign(payload);
  }

  // Placeholder for future multi-provider login logic
  async authenticate(method, credentials) {
    // method: 'password' | 'otp'
    throw new Error('Method not implemented');
  }
}
