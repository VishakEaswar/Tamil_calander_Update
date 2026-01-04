import CryptoJS from 'crypto-js';

// Import users from JSON file
// This assumes you have a file at this path with your user data
import usersData from './data/users.json';

// Encryption key for auth token
const AUTH_KEY = 'tamil_calendar_auth_key_2023';

/**
 * Authenticate a user using the preloaded user data
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {boolean} rememberMe - Whether to save auth in localStorage
 * @returns {Object|null} - User info if authenticated, null otherwise
 */
export const authenticateUser = async (email, password, rememberMe = false) => {
  // Find user by email (case insensitive)
  const user = usersData.find(
    u => u.email.toLowerCase() === email.toLowerCase()
  );
  
  if (!user) {
    return null;
  }
  
  // Hash the provided password for comparison
  const hashedPassword = CryptoJS.SHA256(password).toString();
  
  if (user.password !== hashedPassword) {
    return null;
  }
  
  // Create user object without password
  const userInfo = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || 'user'
  };
  
  // Store auth in localStorage if remember me is checked
  if (rememberMe) {
    await storeAuth(userInfo);
  }
  
  return userInfo;
};

/**
 * Store authentication data
 * @param {Object} user - User information to store
 */
export const storeAuth = async (user) => {
  const authData = {
    user,
    timestamp: Date.now()
  };
  
  try {
    // Encrypt auth data for security
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(authData),
      AUTH_KEY
    ).toString();
    
    localStorage.setItem('tamilCalendarAuth', encryptedData);
    return true;
  } catch (err) {
    console.error('Error storing auth:', err);
    return false;
  }
};

/**
 * Get stored authentication data
 */
export const getStoredAuth = async () => {
  try {
    const encryptedAuth = localStorage.getItem('tamilCalendarAuth');
    
    if (!encryptedAuth) return null;
    
    // Decrypt the auth data
    const bytes = CryptoJS.AES.decrypt(encryptedAuth, AUTH_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    
    const currentTime = Date.now();
    const oneMonth = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    
    // Check if auth is expired
    if (currentTime - decryptedData.timestamp > oneMonth) {
      clearStoredAuth();
      return null;
    }
    
    return decryptedData;
  } catch (err) {
    console.error('Error retrieving auth:', err);
    clearStoredAuth();
    return null;
  }
};

/**
 * Clear stored authentication
 */
export const clearStoredAuth = () => {
  localStorage.removeItem('tamilCalendarAuth');
};


// import { storeAuth, getStoredUsers, storeUsers } from "./storage";
// import CryptoJS from "crypto-js";

// // Secret key for password encryption/decryption - in a real app, use environment variables
// const SECRET_KEY = "tamil_calendar_secret_key_2023";

// /**
//  * Encrypt password for storage
//  */
// const encryptPassword = (password) => {
//   return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
// };

// /**
//  * Decrypt password for verification
//  */
// const decryptPassword = (encryptedPassword) => {
//   const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
//   return bytes.toString(CryptoJS.enc.Utf8);
// };

// /**
//  * Register a new user
//  */
// export const registerUser = async (name, email, password) => {
//   // Get existing users
//   const users = await getStoredUsers();
  
//   // Check if email already exists
//   if (users.find(user => user.email === email)) {
//     throw new Error("Email already registered");
//   }
  
//   // Create new user with encrypted password
//   const newUser = {
//     id: Date.now().toString(),
//     name,
//     email,
//     password: encryptPassword(password),
//     createdAt: new Date().toISOString()
//   };
  
//   // Add to users list and save
//   users.push(newUser);
//   await storeUsers(users);
  
//   return { success: true };
// };

// /**
//  * Authenticate a user
//  */
// export const authenticateUser = async (email, password, rememberMe = false) => {
//   // Get stored users
//   const users = await getStoredUsers();
  
//   // Find user by email
//   const user = users.find(user => user.email === email);
  
//   if (!user) {
//     return null;
//   }
  
//   // Decrypt and check password
//   const decryptedPassword = decryptPassword(user.password);
  
//   if (decryptedPassword !== password) {
//     return null;
//   }
  
//   // Create user object without password
//   const userInfo = {
//     id: user.id,
//     name: user.name,
//     email: user.email
//   };
  
//   // Store auth if remember me is checked
//   if (rememberMe) {
//     await storeAuth(userInfo);
//   }
  
//   return userInfo;
// };
