import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: any) {}

  /**
   * Generate a cache key from parameters
   * @param prefix - Cache key prefix
   * @param params - Parameters to include in the key
   * @returns Generated cache key
   */
  generateCacheKey(prefix: string, params: Record<string, any> = {}): string {
    const paramString = Object.keys(params)
      .sort()
      .map((key) => `${key}:${JSON.stringify(params[key])}`)
      .join('|');

    return paramString ? `${prefix}:${paramString}` : prefix;
  }

  /**
   * Get value from cache
   * @param key - Cache key
   * @returns Cached value or null
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = (await this.cacheManager.get(key)) as T | undefined;
      if (value) {
        this.logger.debug(`Cache HIT: ${key}`);
      }
      return value || null;
    } catch (error) {
      this.logger.warn(`Failed to get cache for key ${key}: ${error.message}`);
      return null;
    }
  }

  /**
   * Set value in cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Time to live in milliseconds (default: 5 minutes)
   */
  async set<T>(
    key: string,
    value: T,
    ttl: number = 5 * 60 * 1000,
  ): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
      this.logger.debug(`Cache SET: ${key} (TTL: ${ttl}ms)`);
    } catch (error) {
      this.logger.warn(`Failed to set cache for key ${key}: ${error.message}`);
    }
  }

  /**
   * Delete cache entry
   * @param key - Cache key
   */
  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
      this.logger.debug(`Cache DELETE: ${key}`);
    } catch (error) {
      this.logger.warn(
        `Failed to delete cache for key ${key}: ${error.message}`,
      );
    }
  }

  /**
   * Delete multiple cache entries by pattern
   * @param pattern - Key pattern to match (e.g., 'branch:*')
   */
  async delByPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.cacheManager.store.keys();
      const matchedKeys = keys.filter((key: string) => {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(key);
      });

      for (const key of matchedKeys) {
        await this.cacheManager.del(key);
      }

      this.logger.debug(
        `Cache DELETE by pattern: ${pattern} (${matchedKeys.length} keys)`,
      );
    } catch (error) {
      this.logger.warn(
        `Failed to delete cache by pattern ${pattern}: ${error.message}`,
      );
    }
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    try {
      await this.cacheManager.reset();
      this.logger.debug('Cache CLEAR: All caches cleared');
    } catch (error) {
      this.logger.warn(`Failed to clear cache: ${error.message}`);
    }
  }

  /**
   * Get or set cache - useful for the first-time data fetch
   * @param key - Cache key
   * @param fn - Function to execute if cache miss
   * @param ttl - Time to live in milliseconds
   */
  async getOrSet<T>(
    key: string,
    fn: () => Promise<T>,
    ttl: number = 5 * 60 * 1000,
  ): Promise<T> {
    try {
      const cached = await this.get<T>(key);
      if (cached) {
        return cached;
      }

      const data = await fn();
      await this.set(key, data, ttl);
      return data;
    } catch (error) {
      this.logger.error(`Failed in getOrSet for key ${key}: ${error.message}`);
      throw error;
    }
  }
}
