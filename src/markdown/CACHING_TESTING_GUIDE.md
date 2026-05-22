# Redis Caching - Testing & Validation Guide

## Quick Validation (5 minutes)

### 1. Verify Redis Connection

```bash
redis-cli ping
# Output: PONG
```

### 2. Check Cache Files Were Built

```bash
ls dist/src/core/cache/
# Should see: cache.service.js, cache.interceptor.js, cache.decorators.js, etc.
```

### 3. Verify Module Registration

```bash
grep -r "CacheModuleConfig" src/app.module.ts
# Should find the import and it in imports array
```

---

## Testing Cache Functionality

### Test 1: Add Caching to a Controller

**Pick any existing GET endpoint**, for example in `src/main/client-admin/branch-management/controller/branch-management.controller.ts`:

```typescript
// Add import at top
import { CacheStrategy, CacheService } from '@/core/cache';

// Add CacheService to constructor
constructor(
  private readonly branchManagementService: BranchManagementService,
  private readonly cacheService: CacheService,  // Add this
) {}

// Add decorator to GET endpoint
@CacheStrategy('branches:list:test', 5 * 60 * 1000)  // 5 minutes
@Get('get-all-branches')
findAll(@Query() query: GetBranchesDto) {
  return this.branchManagementService.findAll(query);
}
```

### Test 2: Make API Requests

**Using curl or Postman:**

```bash
# First request (should hit database)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/branch/get-all-branches

# Check logs for: [CacheService] Cache SET

# Second request (should hit cache)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/branch/get-all-branches

# Check logs for: [CacheService] Cache HIT
```

### Test 3: Verify Cache in Redis

```bash
# Connect to Redis
redis-cli

# List all cache keys
KEYS '*'

# Get cache value (should be JSON)
GET "branches:list:test:userId:USER_ID|url:..."

# Monitor live cache operations
MONITOR
```

### Test 4: Test Cache Invalidation

```typescript
// In same controller, add to POST create endpoint:
@Post('create-branch')
async createBranch(
  @GetUser('sub') userId: string,
  @Body() createBranchDto: CreateBranchDto,
) {
  const result = await this.branchManagementService.createBranch(
    createBranchDto,
    userId,
  );

  // Clear cache after creation
  await this.cacheService.delByPattern('branches:*');

  return result;
}
```

**Test it:**

```bash
# Make request to get list (caches data)
GET /branch/get-all-branches

# Make POST to create (clears cache)
POST /branch/create-branch

# Make GET again (should be fresh from DB, not cache)
GET /branch/get-all-branches
```

---

## Performance Testing

### Setup Monitoring

**Terminal 1: Redis Monitor**

```bash
redis-cli MONITOR
```

**Terminal 2: Application Logs**

```bash
npm run dev
# Or attach to running process
```

**Terminal 3: Make Requests**

```bash
curl http://localhost:3000/api/endpoint
```

### Measure Response Times

**Using Apache Bench:**

```bash
# Install (if needed)
brew install httpd  # macOS
# or apt-get install apache2-utils  # Linux

# Test cached endpoint
ab -n 100 -c 10 -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/branch/get-all-branches

# Compare:
# - 1st batch: ~200ms per request (cache miss)
# - 2nd batch: ~50ms per request (cache hit)
# - 3x-4x faster!
```

### Cache Statistics

```bash
redis-cli INFO stats
# Look for:
# - hits: Cache hits
# - misses: Cache misses
# Calculate hit rate: hits / (hits + misses)
```

---

## Integration Tests

### Test Cache Module Loads

```bash
npm run build
node dist/src/main.js

# Look for:
# [NestFactory] Starting Nest application...
# [CacheService] Cache service initialized
# [CacheInterceptor] Interceptor registered
```

### Test with Different Query Parameters

```bash
# These should have separate cache entries:
GET /branch/get-all-branches?skip=0&take=10
GET /branch/get-all-branches?skip=10&take=10
GET /branch/get-all-branches?status=active

# Verify in Redis:
redis-cli KEYS '*branches*'
# Should show multiple entries with different params
```

### Test User Isolation

With multiple users:

```bash
# User A
curl -H "Authorization: Bearer TOKEN_A" \
  http://localhost:3000/branch/get-all-branches

# User B (gets their own cache)
curl -H "Authorization: Bearer TOKEN_B" \
  http://localhost:3000/branch/get-all-branches

# Verify separate cache entries in Redis:
redis-cli KEYS '*'
# Should have both User A and User B entries
```

---

## Validation Checklist

### Build & Startup

- [ ] `npm run build` completes without errors
- [ ] `npm run dev` starts successfully
- [ ] No "Cannot find module" errors
- [ ] Redis connection successful

### Cache Functionality

- [ ] `@CacheStrategy` decorator works
- [ ] `@BypassCache` decorator works
- [ ] Cache keys generated correctly
- [ ] Cache hits detected in logs
- [ ] Cache misses detected in logs

### Data Integrity

- [ ] No user data leakage between users
- [ ] Different queries have separate caches
- [ ] Cache invalidation works after mutations
- [ ] Stale data cleared correctly

### Performance

- [ ] Cached response is faster
- [ ] Cache hit rate increases over time
- [ ] No memory leaks
- [ ] Redis memory usage reasonable

### Error Handling

- [ ] Graceful fallback if Redis down
- [ ] Logs show errors but don't crash
- [ ] Application recovers after Redis restart
- [ ] Invalid cache keys handled

---

## Common Test Scenarios

### Scenario 1: New User Lists

```bash
# Request 1: GET /users/list (cache miss, ~200ms)
time curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/users/list

# Request 2: Same URL (cache hit, ~50ms)
time curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/users/list

# Request 3: Different query (cache miss, ~200ms)
time curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/users/list?status=active"
```

### Scenario 2: Create & Cache Invalidation

```bash
# Request 1: Get list (caches)
GET /users/list  # ~200ms, cache SET

# Request 2: Create new user
POST /users/create  # Clears cache with delByPattern

# Request 3: Get list again (cache miss)
GET /users/list  # ~200ms, fresh from DB
```

### Scenario 3: Real-time Data Bypass

```typescript
// In controller
@BypassCache()
@Get('alerts')
getAlerts() { ... }
```

```bash
# Should never be cached:
GET /api/alerts  # Always fresh, never cached
GET /api/alerts  # Still fresh, no cache used
```

---

## Debugging Tips

### Enable Verbose Logging

```typescript
// In cache.service.ts, change:
private readonly logger = new Logger(CacheService.name);
// To see all operations

// Or temporarily add:
console.log('Cache operation:', operation);
```

### Redis CLI Debugging

```bash
redis-cli

# See all keys
KEYS '*'

# See specific key value
GET "key:name:here"

# See key TTL
TTL "key:name:here"

# Delete specific key
DEL "key:name:here"

# Clear all
FLUSHALL

# Monitor operations
MONITOR

# Get Redis info
INFO stats
INFO memory
```

### Application Logs

Look for:

```
[CacheService] Cache HIT: users:list:...
[CacheService] Cache SET: users:list:... (TTL: 600000ms)
[CacheService] Cache DELETE: users:list
```

---

## Troubleshooting Tests

### Test: Cache not hitting?

```bash
# Check decorator is applied
grep -A 5 "@CacheStrategy" src/main/*/controller/*.ts

# Check logs for "Cache HIT"
npm run dev 2>&1 | grep "Cache HIT"

# Manually verify Redis:
redis-cli KEYS '*'
```

### Test: Cache not clearing?

```bash
# Check invalidation code in POST/PATCH/DELETE
grep -B 5 -A 5 "delByPattern" src/main/*/controller/*.ts

# Manually test:
redis-cli KEYS '*'  # See keys before
redis-cli FLUSHALL   # Clear
redis-cli KEYS '*'  # Should be empty
```

### Test: Performance not improving?

```bash
# Verify caching is actually enabled
grep -r "@CacheStrategy" src/

# Check if Redis is connected
redis-cli ping  # Should be PONG

# Check cache hits vs misses
redis-cli INFO stats
```

---

## Success Indicators

Your caching is working when you see:

1. **In Logs:**

   ```
   [CacheService] Cache SET: ...
   [CacheService] Cache HIT: ...
   ```

2. **In Redis:**

   ```bash
   redis-cli KEYS '*'  # Shows cache keys
   redis-cli GET key    # Shows cached JSON
   ```

3. **In Performance:**
   - First request: ~200ms
   - Second request: ~50ms (4x faster!)

4. **In Monitoring:**
   ```bash
   redis-cli INFO stats
   # hits: 1000 (high number = working!)
   # misses: 100 (low number = good hit rate!)
   ```

---

## Next Testing Steps

After validation:

1. ✅ **Test 1 endpoint** - Verify caching works
2. ✅ **Test 5 endpoints** - Verify pattern works
3. ✅ **Test mutations** - Verify cache invalidation
4. ✅ **Load test** - Verify performance improvement
5. ✅ **Production readiness** - Verify error handling

---

## Files to Test

Recommended controllers to add caching to (in order):

1. **Branch Management** (`branch-management.controller.ts`)
   - Simple, many GET endpoints
   - Good for testing

2. **User Management** (`user-management.controller.ts`)
   - Similar pattern
   - Important endpoints

3. **Dashboards** (any `*-dashboard.controller.ts`)
   - High-traffic endpoints
   - Great performance gains

4. **Lists/Searches** (any list endpoint)
   - Most benefit
   - Easy to implement

5. **Real-time** endpoints (keep as-is or use `@BypassCache()`)
   - Notifications
   - Alerts
   - Live updates

---

## Rollback if Needed

If anything goes wrong:

```bash
# Remove decorator from controller
# Remove CacheService injection
# Remove CacheModuleConfig from AppModule
# Revert app.module.ts changes

# That's it - everything else is optional
# The caching layer is non-invasive!
```

---

**Ready to test? Start with QUICK_START_CACHING.md!**
