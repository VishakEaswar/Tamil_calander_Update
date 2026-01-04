// src/utils/passwordHasher.js
import CryptoJS from 'crypto-js';

/**
 * Hash a password using SHA-256
 * @param {string} password - Plain text password
 * @returns {string} - Hashed password
 */
export const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString();
};

// Example usage:
// console.log(hashPassword('242546')); // For admin@example.com
// console.log(hashPassword('password')); // For user@example.com
