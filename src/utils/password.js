// Random temporary password (no look-alike characters such as 0/O or 1/l/I)
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

export const generatePassword = (length = 12) => {
  const numbers = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(numbers, (n) => CHARS[n % CHARS.length]).join("");
};