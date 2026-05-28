import { CacheService } from '@/core/cache/cache.service';
import { Injectable } from '@nestjs/common';

/**
 * Example: How to use CacheService in a Service
 *
 * This demonstrates best practices for using Redis caching
 * with existing GET logic without any behavior changes.
 */
@Injectable()
export class ExampleCachingService {
  constructor(private readonly cacheService: CacheService) {}

  /**
   * Pattern 1: Using getOrSet for simple data fetching
   * This is the most elegant approach for read-heavy operations
   */
  async getUsersCached(userId: string) {
    const cacheKey = this.cacheService.generateCacheKey('users:list', {
      userId,
    });
    const ttl = 10 * 60 * 1000; // 10 minutes

    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        // Your existing GET logic here - no changes needed
        return this.getUsersFromDatabase(userId);
      },
      ttl,
    );
  }

  /**
   * Pattern 2: Manual cache management for complex scenarios
   */
  async getBranchesWithManualCache(branchId: string) {
    const cacheKey = this.cacheService.generateCacheKey('branches:details', {
      branchId,
    });

    // Try to get from cache first
    let branches = await this.cacheService.get(cacheKey);

    if (!branches) {
      // Cache miss - execute your existing logic
      branches = await this.getBranchesFromDatabase(branchId);

      // Store in cache for future requests
      await this.cacheService.set(cacheKey, branches, 15 * 60 * 1000); // 15 minutes
    }

    return branches;
  }

  /**
   * Pattern 3: Invalidating cache after mutations
   * Call this after CREATE, UPDATE, DELETE operations
   */
  async invalidateBranchCache(branchId: string) {
    // Delete specific branch cache
    const cacheKey = this.cacheService.generateCacheKey('branches:details', {
      branchId,
    });
    await this.cacheService.del(cacheKey);

    // Or delete by pattern to clear all related caches
    await this.cacheService.delByPattern('branches:*');
  }

  /**
   * Pattern 4: Using @CacheStrategy decorator in controllers
   * See examples below for controller implementation
   */

  // Your existing methods remain unchanged
  private async getUsersFromDatabase(userId: string) {
    // Your existing database logic here
    return [];
  }

  private async getBranchesFromDatabase(branchId: string) {
    // Your existing database logic here
    return [];
  }
}

/**
 * CONTROLLER EXAMPLES showing how to use @CacheStrategy decorator
 *
 * The @CacheStrategy decorator automatically handles caching
 * for GET endpoints without any additional code changes.
 *
 * @example
 *
 * import { CacheStrategy, BypassCache } from '@/core/cache';
 *
 * @Controller('branch')
 * @ApiTags('Branch Management')
 * export class BranchManagementController {
 *   constructor(private readonly branchService: BranchManagementService) {}
 *
 *   // Cache this endpoint for 10 minutes
 *   @CacheStrategy('branches:list', 10 * 60 * 1000)
 *   @Get('get-all-branches')
 *   @ValidateClientAdmin()
 *   @ApiBearerAuth()
 *   findAll(@Query() query: GetBranchesDto) {
 *     return this.branchService.findAll(query);
 *   }
 *
 *   // Get single branch - cache for 15 minutes
 *   @CacheStrategy('branches:detail', 15 * 60 * 1000)
 *   @Get(':id')
 *   @ValidateClientAdmin()
 *   @ApiBearerAuth()
 *   findOne(@Param('id') id: string) {
 *     return this.branchService.findOne(id);
 *   }
 *
 *   // Bypass cache for this endpoint - always fresh data
 *   @BypassCache()
 *   @Get('latest-updates')
 *   @ValidateClientAdmin()
 *   @ApiBearerAuth()
 *   getLatestUpdates() {
 *     return this.branchService.getLatestUpdates();
 *   }
 *
 *   // POST, PATCH, DELETE - No caching needed
 *   @Post('create')
 *   async createBranch(@Body() dto: CreateBranchDto) {
 *     return this.branchService.createBranch(dto);
 *   }
 *
 *   @Patch(':id')
 *   async updateBranch(@Param('id') id: string, @Body() dto: UpdateBranchDto) {
 *     // After update, optionally invalidate related caches
 *     await this.cacheService.delByPattern('branches:*');
 *     return this.branchService.updateBranch(id, dto);
 *   }
 *
 *   @Delete(':id')
 *   async deleteBranch(@Param('id') id: string) {
 *     // After delete, invalidate caches
 *     await this.cacheService.delByPattern('branches:*');
 *     return this.branchService.deleteBranch(id);
 *   }
 * }
 */
