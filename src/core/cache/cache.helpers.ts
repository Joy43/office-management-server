import { CacheService } from './cache.service';

/**
 * Utility functions for common caching patterns
 * Use these to standardize cache operations across your application
 */

export class CacheKeyBuilder {
  /**
   * Generate cache key for list endpoints
   * @param resource - Resource type (e.g., 'users', 'branches')
   * @param userId - User ID for user-specific caches
   * @param pagination - Pagination info
   * @param filters - Additional filters
   */
  static buildListKey(
    resource: string,
    userId: string,
    pagination?: { skip?: number; take?: number },
    filters?: Record<string, any>,
  ): string {
    const params: Record<string, any> = { userId };

    if (pagination) {
      params.skip = pagination.skip || 0;
      params.take = pagination.take || 10;
    }

    if (filters) {
      params.filters = filters;
    }

    return `${resource}:list:${JSON.stringify(params)}`;
  }

  /**
   * Generate cache key for detail endpoints
   * @param resource - Resource type
   * @param id - Resource ID
   */
  static buildDetailKey(resource: string, id: string): string {
    return `${resource}:detail:${id}`;
  }

  /**
   * Generate cache key for user-specific data
   * @param resource - Resource type
   * @param userId - User ID
   * @param action - Action/sub-resource (e.g., 'dashboard', 'profile')
   */
  static buildUserKey(
    resource: string,
    userId: string,
    action?: string,
  ): string {
    if (action) {
      return `${resource}:${action}:${userId}`;
    }
    return `${resource}:${userId}`;
  }

  /**
   * Generate cache key for metrics/analytics
   * @param resource - Resource type
   * @param period - Time period (e.g., 'weekly', 'monthly', 'yearly')
   * @param userId - User ID
   */
  static buildMetricsKey(
    resource: string,
    period: string,
    userId: string,
  ): string {
    return `${resource}:metrics:${period}:${userId}`;
  }
}

/**
 * Standard cache TTL values
 */
export class CacheTTL {
  // Real-time data (very short)
  static REAL_TIME = 30 * 1000; // 30 seconds

  // Live-ish data (short)
  static SHORT = 1 * 60 * 1000; // 1 minute

  // Dashboard/metrics (medium)
  static MEDIUM = 5 * 60 * 1000; // 5 minutes

  // User data (long)
  static LONG = 15 * 60 * 1000; // 15 minutes

  // Static/reference data (very long)
  static VERY_LONG = 1 * 60 * 60 * 1000; // 1 hour

  // Master data (extremely long)
  static MASTER_DATA = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Get recommended TTL for a resource type
   */
  static getRecommended(resource: string): number {
    const recommendations: Record<string, number> = {
      // Real-time
      'notifications:unread': this.REAL_TIME,
      'dashboard:alerts': this.REAL_TIME,
      'status:live': this.REAL_TIME,

      // Short cache
      'dashboard:overview': this.SHORT,
      'activity:recent': this.SHORT,
      'stats:live': this.SHORT,

      // Medium cache
      'sessions:list': this.MEDIUM,
      'habits:logs': this.MEDIUM,
      'notifications:recent': this.MEDIUM,

      // Long cache
      'users:profile': this.LONG,
      'users:settings': this.LONG,
      'branches:detail': this.LONG,
      'branches:list': this.LONG,

      // Very long cache
      'system:settings': this.VERY_LONG,
      'references:categories': this.VERY_LONG,
      'templates:all': this.VERY_LONG,

      // Master data
      'config:app': this.MASTER_DATA,
    };

    return recommendations[resource] || this.MEDIUM;
  }
}

/**
 * Cache patterns for common operations
 */
export class CachePatterns {
  /**
   * List pagination pattern
   * Caches each pagination separately
   */
  static listPatternByPage(resource: string): string {
    return `${resource}:list:*`;
  }

  /**
   * User-specific data pattern
   * All data belonging to a user
   */
  static userPattern(userId: string): string {
    return `*:${userId}*`;
  }

  /**
   * All instances of a resource
   */
  static resourcePattern(resource: string): string {
    return `${resource}:*`;
  }

  /**
   * Dashboard-related data pattern
   */
  static dashboardPattern(userId: string): string {
    return `dashboard:*:${userId}`;
  }

  /**
   * Metrics and analytics pattern
   */
  static metricsPattern(resource: string): string {
    return `${resource}:metrics:*`;
  }
}

/**
 * Helper class for implementing common caching scenarios
 */
export class CacheHelper {
  constructor(private cacheService: CacheService) {}

  /**
   * Cache a list with pagination
   */
  async cacheList<T>(
    resource: string,
    userId: string,
    fetchFn: () => Promise<T>,
    pagination?: { skip?: number; take?: number },
    filters?: Record<string, any>,
    ttl?: number,
  ): Promise<T> {
    const key = CacheKeyBuilder.buildListKey(
      resource,
      userId,
      pagination,
      filters,
    );
    const finalTtl = ttl || CacheTTL.getRecommended(`${resource}:list`);

    return this.cacheService.getOrSet(key, fetchFn, finalTtl);
  }

  /**
   * Cache a detail view
   */
  async cacheDetail<T>(
    resource: string,
    id: string,
    fetchFn: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const key = CacheKeyBuilder.buildDetailKey(resource, id);
    const finalTtl = ttl || CacheTTL.getRecommended(`${resource}:detail`);

    return this.cacheService.getOrSet(key, fetchFn, finalTtl);
  }

  /**
   * Cache user-specific data
   */
  async cacheUserData<T>(
    resource: string,
    userId: string,
    fetchFn: () => Promise<T>,
    action?: string,
    ttl?: number,
  ): Promise<T> {
    const key = CacheKeyBuilder.buildUserKey(resource, userId, action);
    const finalTtl =
      ttl || CacheTTL.getRecommended(`${resource}:${action || 'user'}`);

    return this.cacheService.getOrSet(key, fetchFn, finalTtl);
  }

  /**
   * Cache metrics/analytics with period
   */
  async cacheMetrics<T>(
    resource: string,
    period: string,
    userId: string,
    fetchFn: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const key = CacheKeyBuilder.buildMetricsKey(resource, period, userId);
    const finalTtl = ttl || CacheTTL.getRecommended(`${resource}:metrics`);

    return this.cacheService.getOrSet(key, fetchFn, finalTtl);
  }

  /**
   * Invalidate all caches for a resource
   */
  async invalidateResource(resource: string): Promise<void> {
    const pattern = CachePatterns.resourcePattern(resource);
    await this.cacheService.delByPattern(pattern);
  }

  /**
   * Invalidate user-specific caches
   */
  async invalidateUserCaches(userId: string): Promise<void> {
    const pattern = CachePatterns.userPattern(userId);
    await this.cacheService.delByPattern(pattern);
  }

  /**
   * Invalidate user's dashboard caches
   */
  async invalidateUserDashboard(userId: string): Promise<void> {
    const pattern = CachePatterns.dashboardPattern(userId);
    await this.cacheService.delByPattern(pattern);
  }

  /**
   * Invalidate specific item and related lists
   */
  async invalidateItemAndLists(
    resource: string,
    id: string,
    userId?: string,
  ): Promise<void> {
    // Invalidate detail
    const detailKey = CacheKeyBuilder.buildDetailKey(resource, id);
    await this.cacheService.del(detailKey);

    // Invalidate lists
    if (userId) {
      const listPattern = CachePatterns.listPatternByPage(
        `${resource}:list:*${userId}*`,
      );
      await this.cacheService.delByPattern(listPattern);
    } else {
      const listPattern = CachePatterns.listPatternByPage(resource);
      await this.cacheService.delByPattern(listPattern);
    }
  }
}

/**
 * Example usage in a service:
 *
 * @Injectable()
 * export class UserService {
 *   private cacheHelper: CacheHelper;
 *
 *   constructor(private cacheService: CacheService) {
 *     this.cacheHelper = new CacheHelper(cacheService);
 *   }
 *
 *   async getUsers(userId: string, pagination: { skip: number; take: number }) {
 *     return this.cacheHelper.cacheList(
 *       'users',
 *       userId,
 *       () => this.prisma.user.findMany({ skip: pagination.skip, take: pagination.take }),
 *       pagination,
 *     );
 *   }
 *
 *   async getUser(id: string) {
 *     return this.cacheHelper.cacheDetail(
 *       'users',
 *       id,
 *       () => this.prisma.user.findUnique({ where: { id } }),
 *     );
 *   }
 *
 *   async updateUser(id: string, data: any) {
 *     const user = await this.prisma.user.update({
 *       where: { id },
 *       data,
 *     });
 *
 *     await this.cacheHelper.invalidateItemAndLists('users', id);
 *
 *     return user;
 *   }
 * }
 */
