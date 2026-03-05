import argon2 from 'argon2';

/**
 * Hashes a plain text password using argon2.
 * @param password - The plain text password to hash.
 * @returns A promise that resolves to the hashed password string.
 * @throws Error if password is empty.
 */
export const hashPassword = async (password: string): Promise<string> => {
  if (!password) {
    throw new Error('Password cannot be empty');
  }
  return await argon2.hash(password);
};

/**
 * Verifies a plain text password against an argon2 hash.
 * @param hash - The hashed password stored in the database.
 * @param password - The plain text password to verify.
 * @returns A promise that resolves to true if the password matches, false otherwise.
 */
export const verifyPassword = async (hash: string, password: string): Promise<boolean> => {
  try {
    if (!hash || !password) {
      return false;
    }
    return await argon2.verify(hash, password);
  } catch (error) {
    return false;
  }
};
