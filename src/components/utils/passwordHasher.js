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

