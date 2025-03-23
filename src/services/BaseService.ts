
import { StorageUtils } from './storage/StorageUtils';

/**
 * Base service providing common storage operations
 */
export class BaseService<T> {
  protected storageKey: string;
  
  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }
  
  /**
   * Get all items from storage
   */
  getAllItems(): T[] {
    return StorageUtils.getData<T>(this.storageKey);
  }
  
  /**
   * Save all items to storage
   */
  protected saveAllItems(items: T[]): boolean {
    return StorageUtils.saveData<T>(this.storageKey, items);
  }
}
