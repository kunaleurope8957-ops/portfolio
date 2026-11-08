import express from 'express';
import { redisEngine } from './redis.config';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get('/health', async (req, res) => {
  try {
      const client = redisEngine.getClient();
          const pingResponse = await client.ping();
              res.status(200).json({
                    status: 'ONLINE',
                          architecture: 'Nordic Telemetry & Caching Mesh',
                                redisPing: pingResponse,
                                      timestamp: new Date().toISOString()
                                          });
                                            } catch (error) {
                                                res.status(500).json({ status: 'DEGRADED', error: String(error) });
                                                  }
                                                  });

                                                  app.listen(PORT, async () => {
                                                    await redisEngine.connect();
                                                      console.log(`🚀 Enterprise Server running on port ${PORT}`);
                                                      });
                                                      