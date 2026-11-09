import { createClient, RedisClientType } from 'redis';

export class RedisMeshService {
    private client: RedisClientType;
        private isConnected: boolean = false;

            constructor(redisUrl: string = process.env.REDIS_URL || 'redis://localhost:6379') {
                    this.client = createClient({ url: redisUrl });
                            
                                    this.client.on('error', (err) => {
                                                console.error('❌ Redis Mesh Error:', err);
                                                            this.isConnected = false;
                                                                    });

                                                                            this.client.on('connect', () => {
                                                                                        console.log('✅ Redis Mesh Connected Successfully');
                                                                                                    this.isConnected = true;
                                                                                                            });
                                                                                                                }

                                                                                                                    public async connect(): Promise<void> {
                                                                                                                            if (!this.isConnected) {
                                                                                                                                        await this.client.connect();
                                                                                                                                                }
                                                                                                                                                    }

                                                                                                                                                        public async setCache(key: string, value: string, ttlSeconds: number = 3600): Promise<void> {
                                                                                                                                                                try {
                                                                                                                                                                            await this.connect();
                                                                                                                                                                                        await this.client.set(key, value, { EX: ttlSeconds });
                                                                                                                                                                                                } catch (error) {
                                                                                                                                                                                                            console.error(`Failed to set cache for key: ${key}`, error);
                                                                                                                                                                                                                        throw error;
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                        public async getCache(key: string): Promise<string | null> {
                                                                                                                                                                                                                                                try {
                                                                                                                                                                                                                                                            await this.connect();
                                                                                                                                                                                                                                                                        return await this.client.get(key);
                                                                                                                                                                                                                                                                                } catch (error) {
                                                                                                                                                                                                                                                                                            console.error(`Failed to get cache for key: ${key}`, error);
                                                                                                                                                                                                                                                                                                        return null;
                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                                                                        public async healthCheck(): Promise<boolean> {
                                                                                                                                                                                                                                                                                                                                try {
                                                                                                                                                                                                                                                                                                                                            await this.connect();
                                                                                                                                                                                                                                                                                                                                                        const pong = await this.client.ping();
                                                                                                                                                                                                                                                                                                                                                                    return pong === 'PONG';
                                                                                                                                                                                                                                                                                                                                                                            } catch {
                                                                                                                                                                                                                                                                                                                                                                                        return false;
                                                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                                                                                    