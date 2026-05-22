import { SetMetadata } from '@nestjs/common';

export const CACHE_STRATEGY_METADATA = 'cache:strategy';
export const CACHE_BYPASS_METADATA = 'cache:bypass';

/**
 * Decorator to enable caching for a GET endpoint
 * @param prefix - Cache key prefix
 * @param ttl - Time to live in milliseconds (default: 5 minutes)
 *
 * @example
 * @CacheStrategy('users:list', 10 * 60 * 1000) // 10 minutes TTL
 * @Get()
 * async getUsers() { ... }
 */
export function CacheStrategy(prefix: string, ttl: number = 5 * 60 * 1000) {
  return SetMetadata(CACHE_STRATEGY_METADATA, { prefix, ttl });
}

/**
 * Decorator to bypass caching for a specific endpoint
 *
 * @example
 * @BypassCache()
 * @Get(':id')
 * async getUser(@Param('id') id: string) { ... }
 */
export function BypassCache() {
  return SetMetadata(CACHE_BYPASS_METADATA, true);
}
