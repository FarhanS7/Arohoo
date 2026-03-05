import argon2 from 'argon2';
/**
 * Hashes a plain text password using argon2.
 * @param {string} password - The plain text password to hash.
 * @returns {Promise<string>} - A promise that resolves to the hashed password string.
 * @throws Error if password is empty.
 */
export const hashPassword = async (password) => {
    if (!password) {
        throw new Error('Password cannot be empty');
    }
    return await argon2.hash(password);
};
/**
 * Verifies a plain text password against an argon2 hash.
 * @param {string} hash - The hashed password stored in the database.
 * @param {string} password - The plain text password to verify.
 * @returns {Promise<boolean>} - A promise that resolves to true if the password matches, false otherwise.
 */
export const verifyPassword = async (hash, password) => {
    try {
        if (!hash || !password) {
            return false;
        }
        return await argon2.verify(hash, password);
    }
    catch (error) {
        return false;
    }
};
