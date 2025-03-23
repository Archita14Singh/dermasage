
import { toast } from 'sonner';

/**
 * Utility functions for handling localStorage operations
 */
export class StorageUtils {
  /**
   * Retrieve data from localStorage
   * @param key The storage key
   * @returns Parsed data or null if not found
   */
  static getData<T>(key: string): T[] {
    try {
      const dataJson = localStorage.getItem(key);
      if (!dataJson) return [];
      
      return JSON.parse(dataJson, (key, value) => {
        // Convert date strings back to Date objects
        if (key === 'createdAt' || key === 'updatedAt' || key === 'dateAdded') {
          return new Date(value);
        }
        return value;
      });
    } catch (error) {
      console.error(`Error loading data from ${key}:`, error);
      toast.error(`Failed to load data from storage`);
      return [];
    }
  }

  /**
   * Save data to localStorage
   * @param key The storage key
   * @param data The data to save
   * @returns Success status
   */
  static saveData<T>(key: string, data: T[]): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error saving data to ${key}:`, error);
      toast.error(`Failed to save data to storage`);
      return false;
    }
  }
}
