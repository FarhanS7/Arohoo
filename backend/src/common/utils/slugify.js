/**
 * Converts a string to a URL-friendly slug.
 * Example: "Nike Store" -> "nike-store"
 * 
 * @param {string} text - The string to slugify
 * @returns {string} The URL-friendly slug
 */
export const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') // Replace spaces, non-word characters and dashes with a single dash
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
};

/**
 * Generates a unique slug for a merchant.
 * @param {string} storeName - The name to slugify
 * @param {Object} prisma - The prisma instance to check uniqueness
 * @returns {Promise<string>} The unique slug
 */
export const generateUniqueMerchantSlug = async (storeName, prisma) => {
  let slug = slugify(storeName);
  let existing = await prisma.merchant.findUnique({ where: { slug } });
  let counter = 1;
  while (existing) {
    slug = `${slugify(storeName)}-${counter}`;
    existing = await prisma.merchant.findUnique({ where: { slug } });
    counter++;
  }
  return slug;
};
