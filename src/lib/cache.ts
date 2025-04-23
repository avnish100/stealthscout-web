type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

class QueryCache {
  private TTL: number = 5 * 60 * 1000; // 5 minutes default TTL

  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now() + (ttl || this.TTL)
    };
    try {
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to store in cache:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);
      
      if (Date.now() > entry.timestamp) {
        localStorage.removeItem(key);
        return null;
      }
      
      return entry.data;
    } catch (error) {
      console.warn('Failed to retrieve from cache:', error);
      return null;
    }
  }

  invalidate(key: string): void {
    localStorage.removeItem(key);
  }
}

export const queryCache = new QueryCache();
