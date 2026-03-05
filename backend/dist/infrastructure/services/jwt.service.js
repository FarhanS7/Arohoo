import jwt from 'jsonwebtoken';
/**
 * Service for working with JSON Web Tokens.
 * Requires JWT_SECRET to be set in environment variables.
 */
export class JwtService {
    static sign(payload, options = { expiresIn: '7d' }) {
        const secret = process.env.JWT_SECRET || 'secret';
        return jwt.sign(payload, secret, options);
    }
    static verify(token) {
        const secret = process.env.JWT_SECRET || 'secret';
        return jwt.verify(token, secret);
    }
}
