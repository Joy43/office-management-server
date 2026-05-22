/**
 * PRACTICAL IMPLEMENTATION EXAMPLES
 *
 * This file shows real examples of how to integrate caching
 * into existing controllers and services following your current patterns.
 *
 * NO BUSINESS LOGIC CHANGES - just performance optimization
 */

// ============================================================================
// EXAMPLE 1: Branch Management - Adding Cache to GET endpoints
// ============================================================================

/**
 * BEFORE: Original controller from branch-management.controller.ts
 *
 * @Controller('branch')
 * @ApiTags('Client Admin --- Branch Management')
 * export class BranchManagementController {
 *   constructor(private readonly branchManagementService: BranchManagementService) {}
 *
 *   @ValidateClientAdmin()
 *   @ApiBearerAuth()
 *   @Get('get-all-branches')
 *   findAll(@Query() query: GetBranchesDto) {
 *     return this.branchManagementService.findAll(query);
 *   }
 * }
 */

/**
 * AFTER: With caching - minimal changes
 */
// @Controller('branch')
// @ApiTags('Client Admin --- Branch Management')
// export class BranchManagementControllerWithCache {
//   constructor(
//     private readonly branchManagementService: BranchManagementService,
//     private readonly cacheService: CacheService,
//   ) {}

//   // Add @CacheStrategy decorator - that's it!
//   @CacheStrategy('branches:list', 10 * 60 * 1000) // 10 minutes
//   @ValidateClientAdmin()
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Get all Branches' })
//   @Get('get-all-branches')
//   findAll(@Query() query: GetBranchesDto) {
//     // Your existing logic remains EXACTLY the same
//     return this.branchManagementService.findAll(query);
//   }

//   // Cache single branch - 15 minutes TTL
//   @CacheStrategy('branches:detail', 15 * 60 * 1000)
//   @ValidateClientAdmin()
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Get a single Branch by ID' })
//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.branchManagementService.findOne(id);
//   }

//   // Create endpoint - no cache needed
//   @Post('create-branch')
//   @ValidateClientAdmin()
//   @ApiBearerAuth()
//   async createBranch(
//     @GetUser('sub') userId: string,
//     @Body() createBranchDto: CreateBranchDto,
//   ) {
//     const result = await this.branchManagementService.createBranch(
//       createBranchDto,
//       userId,
//     );

//     // Invalidate branch caches after creation
//     await this.cacheService.delByPattern('branches:*');

//     return result;
//   }

//   // Update endpoint - invalidate cache after update
//   @Patch(':id')
//   @ValidateClientAdmin()
//   @ApiBearerAuth()
//   async update(
//     @Param('id') id: string,
//     @Body() updateBranchManagementDto: UpdateBranchManagementDto,
//   ) {
//     const result = await this.branchManagementService.update(
//       id,
//       updateBranchManagementDto,
//     );

//     // Clear cache after update
//     await this.cacheService.delByPattern('branches:*');

//     return result;
//   }

//   @Delete(':id')
//   @ValidateClientAdmin()
//   @ApiBearerAuth()
//   async remove(@Param('id') id: string) {
//     const result = await this.branchManagementService.remove(id);

//     // Clear cache after deletion
//     await this.cacheService.delByPattern('branches:*');

//     return result;
//   }
// }

// ============================================================================
// EXAMPLE 2: User Management - Dashboard-like endpoints
// ============================================================================

/**
 * Usage with dashboard metrics and statistics
 */
// @Controller('staff/dashboard')
// @ApiTags('Staff --- Dashboard')
// export class StaffDashboardControllerWithCache {
//   constructor(
//     private readonly staffDashboardService: StaffDashboardService,
//     private readonly cacheService: CacheService,
//   ) {}

//   // Dashboard data - cache for 5 minutes (refresh frequently for real-time feel)
//   @CacheStrategy('dashboard:staff:overview', 5 * 60 * 1000)
//   @ValidateStaff()
//   @ApiBearerAuth()
//   @Get()
//   async getStaffDashboardData(@GetUser('sub') staffId: string) {
//     return this.staffDashboardService.getStaffDashboardData(staffId);
//   }

//   // Habit analysis - cache for 30 minutes (less frequently changing)
//   @CacheStrategy('dashboard:habit:analysis', 30 * 60 * 1000)
//   @ValidateStaff()
//   @ApiBearerAuth()
//   @Get('habit-analysis')
//   async getHabitAnalysisGraphData(
//     @GetUser('sub') staffId: string,
//     @Query() filterDto: HabitAnalysisFilterDto,
//   ) {
//     return this.staffDashboardService.getHabitAnalysisGraphData(
//       staffId,
//       filterDto,
//     );
//   }

//   // Real-time alerts - bypass cache for always-fresh data
//   @BypassCache()
//   @ValidateStaff()
//   @ApiBearerAuth()
//   @Get('alerts')
//   async getAlerts(@GetUser('sub') staffId: string) {
//     return this.staffDashboardService.getAlerts(staffId);
//   }
// }

// ============================================================================
// EXAMPLE 3: Service-level caching for complex operations
// ============================================================================

/**
 * Using CacheService in services for manual control
 *
 * This is useful when you need more granular control over caching
 * or when caching logic is shared across multiple endpoints.
 */

// @Injectable()
// export class SessionManagementService {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly cacheService: CacheService,
//   ) {}

//   /**
//    * Get all sessions with caching
//    * Uses the getOrSet pattern for elegant cache management
//    */
//   async getAllSessions(userId: string, filter?: GetAllSessionsDto) {
//     const cacheKey = this.cacheService.generateCacheKey('sessions:list', {
//       userId,
//       status: filter?.status,
//       skip: filter?.skip,
//       take: filter?.take,
//     });

//     // getOrSet: if cached return cache, otherwise execute function and cache result
//     return this.cacheService.getOrSet(cacheKey, () => {
//       return this.prisma.session.findMany({
//         where: {
//           createdBy: userId,
//           status: filter?.status,
//         },
//         skip: filter?.skip,
//         take: filter?.take,
//         include: {
//           participants: true,
//           recordings: true,
//         },
//       });
//     }, 10 * 60 * 1000); // 10 minutes TTL
//   }

//   /**
//    * Get session details with caching
//    */
//   async getSessionDetail(sessionId: string) {
//     const cacheKey = this.cacheService.generateCacheKey('sessions:detail', {
//       sessionId,
//     });

//     return this.cacheService.getOrSet(cacheKey, () => {
//       return this.prisma.session.findUnique({
//         where: { id: sessionId },
//         include: {
//           participants: {
//             include: { user: true },
//           },
//           recordings: true,
//           metrics: true,
//         },
//       });
//     }, 15 * 60 * 1000); // 15 minutes TTL
//   }

//   /**
//    * Create session - invalidate related caches
//    */
//   async createSession(dto: CreateSessionDto, userId: string) {
//     const session = await this.prisma.session.create({
//       data: {
//         ...dto,
//         createdBy: userId,
//       },
//     });

//     // Invalidate sessions list cache for this user
//     await this.cacheService.delByPattern(`sessions:list:*userId:${userId}*`);

//     return session;
//   }

//   /**
//    * Update session - invalidate specific session cache
//    */
//   async updateSession(sessionId: string, dto: UpdateSessionDto) {
//     const session = await this.prisma.session.update({
//       where: { id: sessionId },
//       data: dto,
//     });

//     // Invalidate this session's cache
//     const cacheKey = this.cacheService.generateCacheKey('sessions:detail', {
//       sessionId,
//     });
//     await this.cacheService.del(cacheKey);

//     // Invalidate related lists
//     await this.cacheService.delByPattern('sessions:list:*');

//     return session;
//   }
// }

// ============================================================================
// EXAMPLE 4: Query-specific caching
// ============================================================================

/**
 * Advanced: Caching different queries separately
 */

// @Controller('invoices')
// @ApiTags('Invoice Management')
// export class InvoiceControllerWithAdvancedCache {
//   constructor(
//     private readonly invoiceService: InvoiceService,
//     private readonly cacheService: CacheService,
//   ) {}

//   // Different cache entries for different status filters
//   @CacheStrategy('invoices:list', 20 * 60 * 1000)
//   @Get()
//   async getInvoices(@Query() filter: GetInvoicesDto) {
//     // Cache is automatically separated by query parameters
//     // GET /invoices?status=paid   → different cache
//     // GET /invoices?status=pending → different cache
//     return this.invoiceService.getInvoices(filter);
//   }

//   // Payment history with user-specific caching
//   @CacheStrategy('invoices:payment:history', 60 * 60 * 1000) // 1 hour
//   @Get('payment-history')
//   async getPaymentHistory(
//     @GetUser('sub') userId: string,
//     @Query() query: GetPaymentHistoryDto,
//   ) {
//     // Each user gets their own cache
//     return this.invoiceService.getPaymentHistory(userId, query);
//   }

//   // Real-time invoice status - bypass cache
//   @BypassCache()
//   @Get(':id/status')
//   async getInvoiceStatus(@Param('id') id: string) {
//     return this.invoiceService.getInvoiceStatus(id);
//   }
// }

// ============================================================================
// EXAMPLE 5: Notification & Alert system
// ============================================================================

/**
 * Real-time vs cached data patterns
 */

// @Controller('notifications')
// export class NotificationControllerWithCache {
//   constructor(
//     private readonly notificationService: NotificationService,
//     private readonly cacheService: CacheService,
//   ) {}

//   // Recent notifications - short cache (1 minute)
//   @CacheStrategy('notifications:recent', 1 * 60 * 1000)
//   @Get('recent')
//   async getRecentNotifications(@GetUser('sub') userId: string) {
//     return this.notificationService.getRecentNotifications(userId);
//   }

//   // All notifications - longer cache (5 minutes)
//   @CacheStrategy('notifications:all', 5 * 60 * 1000)
//   @Get()
//   async getAllNotifications(@GetUser('sub') userId: string) {
//     return this.notificationService.getAllNotifications(userId);
//   }

//   // Unread count - very short cache (30 seconds) or bypass
//   @BypassCache()
//   @Get('unread-count')
//   async getUnreadCount(@GetUser('sub') userId: string) {
//     return this.notificationService.getUnreadCount(userId);
//   }

//   // Mark as read - invalidate relevant caches
//   @Patch(':id/read')
//   async markAsRead(@Param('id') id: string, @GetUser('sub') userId: string) {
//     await this.notificationService.markAsRead(id);

//     // Clear user's notification caches
//     await this.cacheService.delByPattern(`notifications:*:*userId:${userId}*`);

//     return { success: true };
//   }
// }

// ============================================================================
// CACHE TTL RECOMMENDATIONS BY USE CASE
// ============================================================================

/**
 * Recommended TTL values by data type:
 *
 * Real-time Alerts:
 *   - 30 seconds to 1 minute
 *   - Examples: Unread counts, active sessions, live stats
 *   - Decision: Use @BypassCache() or very short TTL
 *
 * Dashboard Metrics:
 *   - 2-5 minutes
 *   - Examples: Dashboard overview, activity summaries
 *   - Decision: Frequent refreshes feel responsive
 *
 * User Data:
 *   - 5-15 minutes
 *   - Examples: User profiles, user settings, preferences
 *   - Decision: Balance freshness with performance
 *
 * List/Search Results:
 *   - 10-30 minutes
 *   - Examples: User lists, invoice lists, search results
 *   - Decision: Users often paginate through same data
 *
 * Static/Reference Data:
 *   - 30 minutes to 1 hour
 *   - Examples: System settings, categories, branches
 *   - Decision: Rarely changes, safe to cache longer
 *
 * Master Data:
 *   - 1-24 hours
 *   - Examples: Product lists, configurations, templates
 *   - Decision: Very stable, can cache for extended period
 */

// ============================================================================
// MIGRATION CHECKLIST
// ============================================================================

/**
 * Step-by-step guide to add caching to existing controllers:
 *
 * [ ] 1. Import CacheStrategy and BypassCache decorators
 *        import { CacheStrategy, BypassCache } from '@/core/cache';
 *
 * [ ] 2. Add CacheService to constructor (for mutation invalidation)
 *        constructor(private readonly cacheService: CacheService) {}
 *
 * [ ] 3. Add @CacheStrategy to GET endpoints
 *        @CacheStrategy('resource:action', TTL_IN_MS)
 *        @Get()
 *        async getResource() { ... }
 *
 * [ ] 4. Add cache invalidation after POST/PATCH/DELETE
 *        await this.cacheService.delByPattern('resource:*');
 *
 * [ ] 5. Use @BypassCache() for real-time endpoints
 *        @BypassCache()
 *        @Get('real-time-data')
 *        async getRealTimeData() { ... }
 *
 * [ ] 6. Test caching with Redis CLI
 *        redis-cli KEYS '*'  // See all cache keys
 *        redis-cli MONITOR  // Watch all operations
 *
 * [ ] 7. Monitor application logs for cache hits/misses
 *        Look for "Cache HIT" and "Cache SET" messages
 *
 * [ ] 8. Verify no business logic changes
 *        All existing tests should still pass
 *        API responses should be identical
 */

export const MIGRATION_COMPLETE = true;
