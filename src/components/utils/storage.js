/**
 * Store authentication data
 */
export const storeAuth = async (user) => {
  const authData = {
    user,
    timestamp: Date.now()
  };
  
  localStorage.setItem('tamilCalendarAuth', JSON.stringify(authData));
  return true;
};

/**
 * Get stored authentication data
 */
export const getStoredAuth = async () => {
  try {
    const authJson = localStorage.getItem('tamilCalendarAuth');
    
    if (!authJson) return null;
    
    const auth = JSON.parse(authJson);
    const currentTime = Date.now();
    const oneMonth = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    
    // Check if auth is expired (more than a month old)
    if (currentTime - auth.timestamp > oneMonth) {
      localStorage.removeItem('tamilCalendarAuth');
      return null;
    }
    
    return auth;
  } catch (err) {
    console.error('Error retrieving auth:', err);
    return null;
  }
};

/**
 * Clear stored authentication
 */
export const clearStoredAuth = () => {
  localStorage.removeItem('tamilCalendarAuth');
};

/**
 * Get stored users
 */
export const getStoredUsers = async () => {
  try {
    const usersJson = localStorage.getItem('tamilCalendarUsers');
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (err) {
    console.error('Error retrieving users:', err);
    return [];
  }
};

/**
 * Store users
 */
export const storeUsers = async (users) => {
  localStorage.setItem('tamilCalendarUsers', JSON.stringify(users));
  return true;
};
