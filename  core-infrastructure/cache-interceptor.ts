import { Request, Response, NextFunction, RequestHandler } from 'express';
import { RedisMeshService } from './redis-mesh.service';

/**
 * Global Enterprise-Grade Caching Interceptor
  * High-performance middleware serving sub-millisecond memory responses with fail-safe fallback.
   */
   export const cacheInterceptor = (
     redisMesh: RedisMeshService,
       ttlSeconds: number = 3600
       ): RequestHandler => {
         return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
             // 1. Only intercept idempotent GET operations
                 if (req.method !== 'GET') {
                       return next();
                           }

                               const cacheKey = `cache:${req.originalUrl || req.url}`;

                                   try {
                                         // 2. Query Redis Mesh
                                               const cachedData = await redisMesh.getCache(cacheKey);

                                                     if (cachedData) {
                                                             res.setHeader('X-Cache-Status', 'HIT');
                                                                     res.setHeader('Content-Type', 'application/json; charset=utf-8');
                                                                             res.setHeader('Cache-Control', `public, max-age=${ttlSeconds}`);
                                                                                     
                                                                                             // Direct string transfer to eliminate unnecessary JSON parsing overhead
                                                                                                     res.status(200).send(cachedData);
                                                                                                             return;
                                                                                                                   }

                                                                                                                         res.setHeader('X-Cache-Status', 'MISS');

                                                                                                                               // 3. High-Performance Output Stream Interception
                                                                                                                                     const originalSend = res.send.bind(res);

                                                                                                                                           res.send = function (body: any): Response {
                                                                                                                                                   if (res.statusCode >= 200 && res.statusCode < 300 && body) {
                                                                                                                                                             const contentToCache = typeof body === 'string' ? body : JSON.stringify(body);
                                                                                                                                                                       
                                                                                                                                                                                 redisMesh.setCache(cacheKey, contentToCache, ttlSeconds).catch((err: Error) => {
                                                                                                                                                                                             console.error(`[Redis Mesh Error] Async write failed for key ${cacheKey}:`, err.message);
                                                                                                                                                                                                       });
                                                                                                                                                                                                               }
                                                                                                                                                                                                                       return originalSend(body);
                                                                                                                                                                                                                             } as Response['send'];

                                                                                                                                                                                                                                   next();
                                                                                                                                                                                                                                       } catch (error) {
                                                                                                                                                                                                                                             // 4. Zero-Downtime Fallback: Continue via primary database execution stream
                                                                                                                                                                                                                                                   console.error(`[Cache Interceptor Fault-Tolerance Bypass]:`, error);
                                                                                                                                                                                                                                                         next();
                                                                                                                                                                                                                                                             }
                                                                                                                                                                                                                                                               };
                                                                                                                                                                                                                                                               };
                                                                                                                                                                                                                                                               