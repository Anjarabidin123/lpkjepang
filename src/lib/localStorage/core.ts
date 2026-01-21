// Core localStorage utilities for data persistence

export interface StorageItem<T> {
  data: T;
  timestamp: number;
}

const STORAGE_VERSION = '1.0.0';

export function generateId(): string {
  return crypto.randomUUID();
}

export function getStorageKey(table: string): string {
  return `lpk_app_${STORAGE_VERSION}_${table}`;
}

export function getFromStorage<T>(key: string): T[] {
  try {
    const stored = localStorage.getItem(getStorageKey(key));
    if (!stored) return [];
    const parsed: StorageItem<T[]> = JSON.parse(stored);
    return parsed.data || [];
  } catch (error) {
    console.error(`Error reading from localStorage [${key}]:`, error);
    return [];
  }
}

export function setToStorage<T>(key: string, data: T[]): void {
  try {
    const item: StorageItem<T[]> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(getStorageKey(key), JSON.stringify(item));
  } catch (error) {
    console.error(`Error writing to localStorage [${key}]:`, error);
  }
}

export function addToStorage<T extends { id: string }>(key: string, item: T): T {
  const items = getFromStorage<T>(key);
  const newItem = {
    ...item,
    id: item.id || generateId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  items.unshift(newItem);
  setToStorage(key, items);
  return newItem;
}

export function updateInStorage<T extends { id: string }>(
  key: string, 
  id: string, 
  updates: Partial<T>
): T | null {
  const items = getFromStorage<T>(key);
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  const updatedItem = {
    ...items[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  items[index] = updatedItem;
  setToStorage(key, items);
  return updatedItem;
}

export function deleteFromStorage<T extends { id: string }>(key: string, id: string): boolean {
  const items = getFromStorage<T>(key);
  const filteredItems = items.filter(item => item.id !== id);
  if (filteredItems.length === items.length) return false;
  setToStorage(key, filteredItems);
  return true;
}

export function findInStorage<T extends { id: string }>(key: string, id: string): T | null {
  const items = getFromStorage<T>(key);
  return items.find(item => item.id === id) || null;
}

export function clearStorage(key: string): void {
  localStorage.removeItem(getStorageKey(key));
}

export function clearAllAppStorage(): void {
  const prefix = `lpk_app_${STORAGE_VERSION}_`;
  const keys = Object.keys(localStorage).filter(key => key.startsWith(prefix));
  keys.forEach(key => localStorage.removeItem(key));
}

// Event emitter for storage changes
type StorageListener = (key: string, data: any) => void;
const listeners: Map<string, Set<StorageListener>> = new Map();

export function subscribeToStorage(key: string, callback: StorageListener): () => void {
  if (!listeners.has(key)) {
    listeners.set(key, new Set());
  }
  listeners.get(key)!.add(callback);
  
  return () => {
    listeners.get(key)?.delete(callback);
  };
}

export function notifyStorageChange(key: string, data: any): void {
  listeners.get(key)?.forEach(callback => callback(key, data));
}
