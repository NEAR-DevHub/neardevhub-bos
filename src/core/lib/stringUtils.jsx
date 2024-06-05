/**
 * Transform input into a consistent and standardized format
 *
 * @param {string} text - The input to normalize.
 * @returns {string} - normalized input
 */

const normalize = (text) =>
  text
    .replaceAll(/[- \.]/g, "_")
    .replaceAll(/[^\w]+/g, "")
    .replaceAll(/_+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .toLowerCase()
    .trim("-");

/**
 * Generates a random 6-character UUID.
 */
function generateRandom6CharUUID() {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  let result = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }

  return result;
}
return { normalize, generateRandom6CharUUID };
