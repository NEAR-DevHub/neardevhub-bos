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

return { normalize };
