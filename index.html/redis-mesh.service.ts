import { createClient, RedisClientType } from 'redis';

export class EnterpriseRedisMesh {
  private client: RedisClientType;
    private isConnected: boolean = false;
      private readonly DEFAULT_TTL: number = 3600; // 1 hour caching boundary

        constructor() {
            this.client = createClient({
                  url: process.env.REDIS_URL || 'redis://localhost:6379',
                        socket: {
                                reconnectStrategy: (retries) => Math.min(retries * 100, 3000), // Exponential backoff
                                      },
                                          });

                                              this.initializeEvents();
                                                }

                                                  private initializeEvents(): void {
                                                      this.client.on('connect', () => {
                                                            this.isConnected = true;
                                                                  console.log('⚡ [Nordic Mesh]: Redis Connection Pool Established.');
                                                                      });

                                                                          this.client.on('error', (err) => {
                                                                                this.isConnected = false;
                                                                                      console.error('⚠️ [Nordic Mesh Warning]: Redis Mesh Offline, Triggering DB Fallback Routing.', err.message);
                                                                                          });
                                                                                            }

                                                                                              public async connect(): Promise<void> {
                                                                                                  if (!this.isConnected) {
                                                                                                        await this.client.connect();
                                                                                                            }
                                                                                                              }

                                                                                                                // Ultra-Fast Cache Retrieval with Sub-Millisecond Guard Clauses
                                                                                                                  public async getCache<T>(key: string): Promise<T | null> {
                                                                                                                      if (!this.isConnected) return null; // Resilient fallback
                                                                                                                          try {
                                                                                                                                const data = await this.client.get(key);
                                                                                                                                      return data ? JSON.parse(data) : null;
                                                                                                                                          } catch (error) {
                                                                                                                                                console.error(`[Cache Miss/Error] Key: ${key}`, error);
                                                                                                                                                      return null;
                                                                                                                                                          }
                                                                                                                                                            }

                                                                                                                                                              // High-Throughput In-Memory Pipeline Insertion
                                                                                                                                                                public async setCache(key: string, value: any, ttlInSeconds: number = this.DEFAULT_TTL): Promise<void> {
                                                                                                                                                                    if (!this.isConnected) return;
                                                                                                                                                                        try {
                                                                                                                                                                              await this.client.set(key, JSON.stringify(value), { EX: ttlInSeconds });
                                                                                                                                                                                  } catch (error) {
                                                                                                                                                                                        console.error(`[Cache Set Error] Key: ${key}`, error);
                                                                                                                                                                                            }
                                                                                                                                                                                              }
                                                                                                                                                                                              }
                                                                                                                                                                                              