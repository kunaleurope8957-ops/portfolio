import { createClient } from 'redis';

// Enterprise Redis Caching Mesh Configuration
class RedisConfigEngine {
      private client;

        constructor() {
                this.client = createClient({
                          url: process.env.REDIS_URL || 'redis://localhost:6379'
                });

                    this.client.on('error', (err) => {
                              console.error('Redis Mesh Connection Error:', err);
                    });
                }

                  public async connect(): Promise<void> {
                        if (!this.client.isOpen) {
                                  await this.client.connect();
                                        console.log('⚡ Redis In-Memory Caching Mesh Connected Successfully');
                        }
                    }

                      public getClient() {
                            return this.client;
                      }
                    }

                    export const redisEngine = new RedisConfigEngine();
                    
                      }
                        }
                  }
                    })
                })
        }
}