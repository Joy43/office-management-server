import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { from, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { CacheService } from './cache.service';
import { CACHE_BYPASS_METADATA, CACHE_STRATEGY_METADATA } from './cache.decorators';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInterceptor.name);

  constructor(private readonly cacheService: CacheService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    // Only cache GET requests
    if (request.method !== 'GET') {
      return next.handle();
    }

    // Check if caching is explicitly bypassed for this route
    const isBypassCache = Reflect.getMetadata(
      CACHE_BYPASS_METADATA,
      context.getHandler(),
    );

    if (isBypassCache) {
      return next.handle();
    }

    // Get cache strategy from metadata
    const cacheStrategy = Reflect.getMetadata(
      CACHE_STRATEGY_METADATA,
      context.getHandler(),
    );

    // If no strategy defined, don't cache
    if (!cacheStrategy) {
      return next.handle();
    }

    const { prefix, ttl = 5 * 60 * 1000 } = cacheStrategy;

    // Generate cache key from request URL and user ID (if available)
    const user = (request as any).user;
    const userId = user?.sub || user?.id || 'anonymous';
    const queryString = JSON.stringify(request.query);
    const paramsString = JSON.stringify(request.params || {});

    const cacheKey = this.cacheService.generateCacheKey(prefix, {
      userId,
      url: request.originalUrl,
      query: queryString,
      params: paramsString,
    });

    // Try to get from cache
    return from(this.cacheService.get(cacheKey)).pipe(
      switchMap((cached) => {
        if (cached) {
          this.logger.debug(`Returning cached response for: ${cacheKey}`);
          return of(cached);
        }

        // Cache miss, proceed with original handler
        return next.handle().pipe(
          tap((data) => {
            // Cache the successful response
            if (data) {
              this.cacheService.set(cacheKey, data, ttl).catch((error) => {
                this.logger.warn(`Failed to cache response: ${error.message}`);
              });
            }
          }),
        );
      }),
    );
  }
}
