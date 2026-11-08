import { Request, Response, NextFunction } from 'express';
import { EnterpriseRedisMesh } from './redis-mesh.service';

const redisMesh = new EnterpriseRedisMesh();
redisMesh.connect();

export const cacheInterceptor = (ttl: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
      // Only cache read-heavy operations
          if (req.method !== 'GET') {
                return next();
                    }

                        const cacheKey = `mesh_telemetry:${req.originalUrl || req.url}`;
                            const cachedData = await redisMesh.getCache(cacheKey);

                                if (cachedData) {
                                      res.setHeader('X-Nordic-Cache-Hit', 'TRUE');
                                            res.setHeader('X-Latency-SLA', '< 2ms');
                                                  return res.status(200).json(cachedData);
                                                      }

                                                          // Intercept response to inject into Redis automatically
                                                              const originalJson = res.json.bind(res);
                                                                  res.json = (body: any): Response => {
                                                                        res.setHeader('X-Nordic-Cache-Hit', 'FALSE');
                                                                              redisMesh.setCache(cacheKey, body, ttl);
                                                                                    return originalJson(body);
                                                                                        };

                                                                                            next();
                                                                                              };
                                                                                              };
                                                                                              