# Redis Caching Implementation Guide

## Overview

This document explains the Redis caching system implemented in your NestJS application. The caching layer improves performance by reducing database queries and expensive operations while maintaining existing business logic.

## Architecture

### Components

1. **CacheService** (`cache.service.ts`)
   - Core service for cache operations
   - Methods: `get()`, `set()`, `del()`, `delByPattern()`, `clear()`, `getOrSet()`
   - Automatic key generation
   - Error handling and logging

2. **CacheInterceptor** (`cache.interceptor.ts`)
   - Global HTTP interceptor for automatic caching
   - Only caches GET requests
   - Respects `@CacheStrategy` decorator
   - Can be bypassed with `@BypassCache` decorator

3. **Decorators** (`cache.decorators.ts`)
   - `@CacheStrategy(prefix, ttl)` - Enable caching for GET endpoints
   - `@BypassCache()` - Disable caching for specific endpoints

4. **CacheModule** (`cache.module.ts`)
   - Bundles cache service and interceptor
   - Registered globally in AppModule

## Configuration

### Redis Setup in AppModule

```typescript
CacheModule.registerAsync({
  isGlobal: true,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const host = configService.get<string>(ENVEnum.REDIS_HOST, 'localhost');
    const port = configService.get<string>(ENVEnum.REDIS_PORT, '6379');

    return {
      host,
      port: parseInt(port, 10),
      ttl: 5 * 60 * 1000, // 5 minutes default TTL
    };
  },
}),
```

### Environment Variables Required

```env
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Usage Patterns

### Pattern 1: Using @CacheStrategy Decorator (Recommended)

The simplest approach - just add a decorator to GET endpoints:

```typescript
import { CacheStrategy } from '@/core/cache';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Cache for 10 minutes
  @CacheStrategy('users:list', 10 * 60 * 1000)
  @Get()
  async getUsers(@Query() query: GetUsersDto) {
    // Your existing logic - NO CHANGES NEEDED
    return this.userService.getUsers(query);
  }

  // Cache for 15 minutes
  @CacheStrategy('users:detail', 15 * 60 * 1000)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }
}
```

### Pattern 2: Manual Cache in Service (For Complex Logic)

Use `getOrSet` method in services:

```typescript
import { CacheService } from '@/core/cache';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
  ) {}

  async getUsers(query: GetUsersDto) {
    const cacheKey = this.cacheService.generateCacheKey('users:list', {
      skip: query.skip,
      take: query.take,
    });

    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        // Your existing database query
        return this.prisma.user.findMany({
          skip: query.skip,
          take: query.take,
        });
      },
      10 * 60 * 1000,
    ); // 10 minutes
  }
}
```

### Pattern 3: Bypass Cache

For endpoints that need always-fresh data:

```typescript
import { BypassCache } from '@/core/cache';

@BypassCache()
@Get('latest-updates')
async getLatestUpdates() {
  return this.userService.getLatestUpdates();
}
```

### Pattern 4: Cache Invalidation

After mutations (CREATE, UPDATE, DELETE), invalidate related caches:

```typescript
import { CacheService } from '@/core/cache';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
  ) {}

  async updateUser(id: string, updateDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateDto,
    });

    // Invalidate related caches
    await this.cacheService.delByPattern('users:*');

    return user;
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.delete({
      where: { id },
    });

    // Clear all user-related caches
    await this.cacheService.delByPattern('users:*');

    return user;
  }
}
```

## Cache Key Generation

### Automatic Key Generation (from decorator)

When using `@CacheStrategy`, keys include:

- User ID (if authenticated)
- Request URL
- Query parameters
- Route parameters

Example generated keys:

```
users:list:userId:user123|url:/api/users?skip=0&take=10
users:detail:userId:user123|params:{"id":"456"}
branches:all:userId:admin1|query:{"status":"active"}
```

### Manual Key Generation (from service)

```typescript
const key = this.cacheService.generateCacheKey('users:profile', {
  userId: 'user123',
  language: 'en',
});
// Result: "users:profile:userId:\"user123\"|language:\"en\""
```

## Best Practices

### 1. **Choose Appropriate TTL Values**

- **Real-time data**: 1-2 minutes or use `@BypassCache()`
- **Daily data**: 30 minutes - 1 hour
- **Static data**: 1-24 hours
- **Reference data**: 24 hours or longer

```typescript
// Real-time dashboard
@CacheStrategy('dashboard:metrics', 1 * 60 * 1000) // 1 minute

// User profile
@CacheStrategy('users:profile', 10 * 60 * 1000) // 10 minutes

// System settings
@CacheStrategy('system:settings', 60 * 60 * 1000) // 1 hour
```

### 2. **Cache Key Naming Convention**

Use descriptive prefixes:

```
resource:action:identifier
users:list
users:detail
branches:all
branches:metrics
invoices:history
```

### 3. **Invalidation Strategy**

Always invalidate cache after mutations:

```typescript
// When creating
await this.cacheService.delByPattern('users:*');

// When updating specific user
await this.cacheService.del(
  this.cacheService.generateCacheKey('users:detail', { id }),
);

// When deleting
await this.cacheService.delByPattern('users:*');
```

### 4. **User-Specific Caching**

The interceptor automatically includes user ID in cache keys, so each user gets their own cached data:

```typescript
// Same endpoint, different cache for different users
GET / api / dashboard; // User A → cache key with userId:A
GET / api / dashboard; // User B → cache key with userId:B
```

### 5. **Query Parameter Handling**

Cache automatically includes query parameters:

```typescript
// Different cache entries for different queries
GET /api/users?status=active     // Cached separately
GET /api/users?status=inactive   // Cached separately
GET /api/users?skip=0&take=10    // Cached separately
```

## Migration Guide

### Step 1: Add Decorators to Existing GET Endpoints

No logic changes needed - just add the decorator:

```typescript
// BEFORE
@Get('get-all-branches')
findAll(@Query() query: GetBranchesDto) {
  return this.branchService.findAll(query);
}

// AFTER
@CacheStrategy('branches:list', 10 * 60 * 1000)
@Get('get-all-branches')
findAll(@Query() query: GetBranchesDto) {
  return this.branchService.findAll(query);
}
```

### Step 2: Add Cache Invalidation After Mutations

```typescript
// BEFORE
@Post('create')
async createBranch(@Body() dto: CreateBranchDto) {
  return this.branchService.createBranch(dto);
}

// AFTER
@Post('create')
async createBranch(@Body() dto: CreateBranchDto) {
  const result = await this.branchService.createBranch(dto);
  await this.cacheService.delByPattern('branches:*');
  return result;
}
```

### Step 3: Update Services (Optional)

For performance-critical operations, add manual caching in services:

```typescript
// In BranchManagementService
async findAll(query: GetBranchesDto) {
  const cacheKey = this.cacheService.generateCacheKey('branches:list', {
    skip: query.skip,
    take: query.take,
  });

  return this.cacheService.getOrSet(cacheKey, () => {
    return this.prisma.branch.findMany({
      skip: query.skip,
      take: query.take,
    });
  }, 10 * 60 * 1000);
}
```

## Monitoring & Debugging

### Enable Debug Logs

The CacheService logs all cache operations:

- `Cache HIT` - Data found in cache
- `Cache MISS` - Data fetched from source
- `Cache SET` - Data stored in cache
- `Cache DELETE` - Cache entry removed

```
[CacheService] Cache HIT: users:list:userId:user123|url:/api/users
[CacheService] Cache SET: users:list:userId:user123|url:/api/users (TTL: 600000ms)
[CacheService] Cache DELETE: users:list
```

### Performance Metrics

Watch for:

- Cache hit rate (should increase over time)
- Response times (should improve with caching)
- Redis memory usage (monitor and adjust TTL if needed)

## Troubleshooting

### Cache Not Working

1. **Check Redis connection**

   ```bash
   redis-cli ping
   # Should respond with PONG
   ```

2. **Verify decorator is applied**

   ```typescript
   @CacheStrategy('resource:action', 5 * 60 * 1000)
   @Get()
   async method() { }
   ```

3. **Check cache logs**
   - Look for `Cache HIT` messages in logs
   - Missing logs = decorator not applied

### Cache Not Invalidating

1. **Verify invalidation call**

   ```typescript
   await this.cacheService.delByPattern('resource:*');
   ```

2. **Check cache key pattern**
   - Use same prefix as caching decorator
   - Pattern should match generated keys

### High Memory Usage

1. **Reduce TTL values**
   - Shorter TTL = faster invalidation
   - Critical data only gets long TTL

2. **Implement cache limits**
   - Monitor Redis memory
   - Set maxmemory policy in Redis

## Example: Complete Implementation

### Before (No Caching)

```typescript
@Controller('branch')
export class BranchController {
  constructor(private readonly service: BranchService) {}

  @Get('all')
  findAll(@Query() query: GetBranchesDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateBranchDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBranchDto) {
    return this.service.update(id, dto);
  }
}
```

### After (With Caching)

```typescript
import { CacheStrategy, CacheService } from '@/core/cache';

@Controller('branch')
export class BranchController {
  constructor(
    private readonly service: BranchService,
    private readonly cacheService: CacheService,
  ) {}

  @CacheStrategy('branches:list', 10 * 60 * 1000)
  @Get('all')
  findAll(@Query() query: GetBranchesDto) {
    return this.service.findAll(query);
  }

  @CacheStrategy('branches:detail', 15 * 60 * 1000)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateBranchDto) {
    const result = await this.service.create(dto);
    await this.cacheService.delByPattern('branches:*');
    return result;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBranchDto) {
    const result = await this.service.update(id, dto);
    await this.cacheService.delByPattern('branches:*');
    return result;
  }
}
```

## Performance Improvements

Expected improvements:

- **API Response Time**: 50-80% faster for cached GET requests
- **Database Load**: 40-60% reduction in queries
- **Server Resources**: Reduced CPU/memory usage

## Support & Questions

Refer to:

1. `CACHING_GUIDE.ts` - Code examples
2. `cache.service.ts` - Detailed method documentation
3. `cache.decorators.ts` - Decorator options
