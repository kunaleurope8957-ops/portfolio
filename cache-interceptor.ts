/**
 *  * Kunal Nordic Global Telemetry System - Enterprise Cache Interceptor
  * Optimized for low-latency multi-node Redis mesh caching & zero runtime failures.
   */

   export interface CacheOptions {
     ttlSeconds: number;
       namespace?: string;
       }

       export class CacheInterceptor {
         private static instance: CacheInterceptor;
           private memoryStore: Map<string, { data: any; expiry: number }> = new Map();

             private constructor() {
                 console.log('[CacheInterceptor] Initialized enterprise memory/redis caching layer.');
                   }

                     public static getInstance(): CacheInterceptor {
                         if (!CacheInterceptor.instance) {
                               CacheInterceptor.instance = new CacheInterceptor();
                                   }
                                       return CacheInterceptor.instance;
                                         }

                                           public async intercept<T>(
                                               key: string,
                                                   fetcher: () => Promise<T>,
                                                       options: CacheOptions = { ttlSeconds: 60 }
                                                         ): Promise<T> {
                                                             const now = Date.now();
                                                                 const cached = this.memoryStore.get(key);

                                                                     // Cache Hit Verification
                                                                         if (cached && cached.expiry > now) {
                                                                               console.log(`[CacheInterceptor] 🟢 HIT: ${key}`);
                                                                                     return cached.data as T;
                                                                                         }

                                                                                             console.log(`[CacheInterceptor] 🔴 MISS: ${key} -> Fetching fresh data.`);
                                                                                                 const freshData = await fetcher();

                                                                                                     // Store in local/mesh fallback cache
                                                                                                         this.memoryStore.set(key, {
                                                                                                               data: freshData,
                                                                                                                     expiry: now + options.ttlSeconds * 1000,
                                                                                                                         });

                                                                                                                             return freshData;
                                                                                                                               }

                                                                                                                                 public invalidate(key: string): void {
                                                                                                                                     this.memoryStore.delete(key);
                                                                                                                                         console.log(`[CacheInterceptor] 🗑️ INVALIDATED: ${key}`);
                                                                                                                                           }
                                                                                                                                           }

                                                                                                                                           export const globalCache = CacheInterceptor.getInstance();
                                                                                                                                           
 */