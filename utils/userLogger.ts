/**
 * User Logger Utility
 * Manages user tracking without authentication for the PPC Planner tool
 */

export interface User {
    username: string;
    firstVisit: string;
    lastVisit: string;
}

const USER_STORAGE_KEY = 'ppc-planner-user';

/**
 * Get the current user from localStorage
 */
export const getCurrentUser = (): User | null => {
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    if (!userJson) return null;
    
    try {
        return JSON.parse(userJson) as User;
    } catch (error) {
        console.error('Failed to parse user data:', error);
        return null;
    }
};

/**
 * Save or update user in localStorage
 */
export const saveUser = (username: string): User => {
    const existingUser = getCurrentUser();
    const now = new Date().toISOString();
    
    const user: User = {
        username: username.trim(),
        firstVisit: existingUser?.firstVisit || now,
        lastVisit: now,
    };
    
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return user;
};

/**
 * Update the last visit timestamp for the current user
 */
export const updateLastVisit = (): void => {
    const user = getCurrentUser();
    if (user) {
        user.lastVisit = new Date().toISOString();
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
};

/**
 * Clear the current user (for logout or reset purposes)
 */
export const clearUser = (): void => {
    localStorage.removeItem(USER_STORAGE_KEY);
};

/**
 * Check if a user is logged in
 */
export const isUserLoggedIn = (): boolean => {
    return getCurrentUser() !== null;
};
