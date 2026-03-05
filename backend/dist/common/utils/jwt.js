import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development-only';
const JWT_EXPIRES_IN = '7d';
/**
 * Generates a JWT token for a user.
 * @param {Object} payload - The data to include in the token (userId and role).
 * @returns {string} - A signed JWT token string.
 */
export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};
/**
 * Verifies a JWT token and returns the decoded payload.
 * @param {string} token - The JWT token string to verify.
 * @returns {Object} - The decoded payload if valid.
 * @throws Error if the token is invalid or expired.
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Token has expired');
        }
        throw new Error('Invalid token');
    }
};
