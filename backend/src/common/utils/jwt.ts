import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development-only';
const JWT_EXPIRES_IN = '7d';

interface TokenPayload {
  userId: string;
  role: string;
}

/**
 * Generates a JWT token for a user.
 * @param payload - The data to include in the token (userId and role).
 * @returns A signed JWT token string.
 */
export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verifies a JWT token and returns the decoded payload.
 * @param token - The JWT token string to verify.
 * @returns The decoded payload if valid.
 * @throws Error if the token is invalid or expired.
 */
export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    }
    throw new Error('Invalid token');
  }
};
