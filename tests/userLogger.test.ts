// @vitest-environment jsdom

/**
 * Tests for User Logger Utility
 * 
 * This file tests user management functions including:
 * - getCurrentUser: Retrieve user from localStorage
 * - saveUser: Save or update user data
 * - updateLastVisit: Update user's last visit timestamp
 * - clearUser: Remove user data
 * - isUserLoggedIn: Check if user exists
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { 
    getCurrentUser, 
    saveUser, 
    updateLastVisit, 
    clearUser, 
    isUserLoggedIn,
    User 
} from '../utils/userLogger';

describe('User Logger Utility', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.useFakeTimers();
    });

    afterEach(() => {
        localStorage.clear();
        vi.useRealTimers();
    });

    describe('getCurrentUser', () => {
        it('should return null when no user exists', () => {
            expect(getCurrentUser()).toBeNull();
        });

        it('should return user when exists in localStorage', () => {
            const mockUser: User = {
                username: 'testuser',
                firstVisit: '2024-01-01T00:00:00.000Z',
                lastVisit: '2024-01-02T00:00:00.000Z',
            };
            localStorage.setItem('ppc-planner-user', JSON.stringify(mockUser));

            const user = getCurrentUser();
            expect(user).toEqual(mockUser);
        });

        it('should handle corrupted data gracefully', () => {
            localStorage.setItem('ppc-planner-user', 'invalid json');
            expect(getCurrentUser()).toBeNull();
        });
    });

    describe('saveUser', () => {
        it('should save a new user with current timestamps', () => {
            const fixedDate = new Date('2024-10-22T12:00:00.000Z');
            vi.setSystemTime(fixedDate);

            const user = saveUser('John Doe');

            expect(user.username).toBe('John Doe');
            expect(user.firstVisit).toBe(fixedDate.toISOString());
            expect(user.lastVisit).toBe(fixedDate.toISOString());

            const storedUser = getCurrentUser();
            expect(storedUser).toEqual(user);
        });

        it('should trim whitespace from username', () => {
            const user = saveUser('  Jane Smith  ');
            expect(user.username).toBe('Jane Smith');
        });

        it('should preserve firstVisit when updating existing user', () => {
            const firstDate = new Date('2024-10-20T12:00:00.000Z');
            vi.setSystemTime(firstDate);
            const firstUser = saveUser('Bob');

            const secondDate = new Date('2024-10-22T12:00:00.000Z');
            vi.setSystemTime(secondDate);
            const updatedUser = saveUser('Bob Updated');

            expect(updatedUser.firstVisit).toBe(firstDate.toISOString());
            expect(updatedUser.lastVisit).toBe(secondDate.toISOString());
        });

        it('should update lastVisit on subsequent saves', () => {
            const firstDate = new Date('2024-10-20T12:00:00.000Z');
            vi.setSystemTime(firstDate);
            saveUser('Alice');

            const secondDate = new Date('2024-10-22T15:00:00.000Z');
            vi.setSystemTime(secondDate);
            const updatedUser = saveUser('Alice');

            expect(updatedUser.lastVisit).toBe(secondDate.toISOString());
        });
    });

    describe('updateLastVisit', () => {
        it('should update lastVisit timestamp for existing user', () => {
            const firstDate = new Date('2024-10-20T12:00:00.000Z');
            vi.setSystemTime(firstDate);
            saveUser('Charlie');

            const secondDate = new Date('2024-10-22T12:00:00.000Z');
            vi.setSystemTime(secondDate);
            updateLastVisit();

            const user = getCurrentUser();
            expect(user?.lastVisit).toBe(secondDate.toISOString());
            expect(user?.firstVisit).toBe(firstDate.toISOString());
        });

        it('should do nothing when no user exists', () => {
            updateLastVisit();
            expect(getCurrentUser()).toBeNull();
        });
    });

    describe('clearUser', () => {
        it('should remove user from localStorage', () => {
            saveUser('TestUser');
            expect(getCurrentUser()).not.toBeNull();

            clearUser();
            expect(getCurrentUser()).toBeNull();
        });

        it('should not throw when no user exists', () => {
            expect(() => clearUser()).not.toThrow();
        });
    });

    describe('isUserLoggedIn', () => {
        it('should return false when no user exists', () => {
            expect(isUserLoggedIn()).toBe(false);
        });

        it('should return true when user exists', () => {
            saveUser('LoggedInUser');
            expect(isUserLoggedIn()).toBe(true);
        });

        it('should return false after user is cleared', () => {
            saveUser('TempUser');
            expect(isUserLoggedIn()).toBe(true);
            
            clearUser();
            expect(isUserLoggedIn()).toBe(false);
        });
    });

    describe('User workflow scenarios', () => {
        it('should handle complete user lifecycle', () => {
            // User logs in
            expect(isUserLoggedIn()).toBe(false);
            
            const user = saveUser('WorkflowUser');
            expect(isUserLoggedIn()).toBe(true);
            expect(user.username).toBe('WorkflowUser');

            // User returns later
            const laterDate = new Date('2024-10-23T12:00:00.000Z');
            vi.setSystemTime(laterDate);
            updateLastVisit();

            const updatedUser = getCurrentUser();
            expect(updatedUser?.lastVisit).toBe(laterDate.toISOString());
            expect(updatedUser?.firstVisit).not.toBe(laterDate.toISOString());

            // User logs out
            clearUser();
            expect(isUserLoggedIn()).toBe(false);
        });

        it('should handle multiple user changes', () => {
            saveUser('User1');
            expect(getCurrentUser()?.username).toBe('User1');

            saveUser('User2');
            expect(getCurrentUser()?.username).toBe('User2');

            saveUser('User3');
            expect(getCurrentUser()?.username).toBe('User3');
        });
    });
});
