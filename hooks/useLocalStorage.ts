import { useState } from 'react';

export const useLocalStorage = (key: string, initialValue: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
      // Handle QuotaExceededError specifically
      if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        console.error('localStorage quota exceeded. Unable to save data.');
        // Attempt to recover by clearing old data and retrying
        try {
          // Try to make space by removing the oldest data
          const oldKeys = Object.keys(window.localStorage).filter(k => k.startsWith('ppc-'));
          if (oldKeys.length > 0) {
            // Remove the oldest workspace data or history
            console.warn('Attempting to clear old data to make space...');
            // Don't remove active workspace, try to trim report history instead
            if (key === 'ppc-workspaces') {
              // The value is already computed, try trimming report history from it
              const trimmedValue = value instanceof Function ? value(storedValue) : value;
              if (trimmedValue && typeof trimmedValue === 'object') {
                // Trim report history from all workspaces
                Object.keys(trimmedValue).forEach(workspaceId => {
                  if (trimmedValue[workspaceId]?.reportHistory) {
                    trimmedValue[workspaceId].reportHistory = trimmedValue[workspaceId].reportHistory.slice(-5);
                  }
                });
                setStoredValue(trimmedValue);
                window.localStorage.setItem(key, JSON.stringify(trimmedValue));
                console.info('Successfully saved data after trimming report history.');
              }
            }
          }
        } catch (retryError) {
          console.error('Failed to recover from quota exceeded error:', retryError);
          // Still update React state even if localStorage fails
          // This allows the app to continue functioning in the current session
        }
      }
    }
  };
  return [storedValue, setValue];
};
