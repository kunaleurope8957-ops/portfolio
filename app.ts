import express, { Application, Request, Response, NextFunction } from 'express';
import { connectDatabase } from './core-infrastructure/db.connection';
import { RedisMeshService } from './redis-mesh.service';
import { cacheInterceptor } from './core-infrastructure/cache-interceptor';
import { UserModel } from './user.schema';

class ServerApp {
  public app: Application;
    private redisMesh: RedisMeshService;

      constructor() {
          this.app = express();
              this.redisMesh = new RedisMeshService();
                  this.configureMiddleware();
                      this.configureRoutes();
                          this.configureErrorHandler();
                            }

                              private configureMiddleware(): void {
                                  // Body Parsers & Standard Middleware
                                      this.app.use(express.json());
                                          this.app.use(express.urlencoded({ extended: true }));

                                              // Global High-Performance Redis Caching Interceptor for GET routes
                                                  this.app.use(cacheInterceptor(this.redisMesh, 3600));
                                                    }

                                                      private configureRoutes(): void {
                                                          // Health Check Endpoint (Nordic Telemetry Standard)
                                                              this.app.get('/health', (req: Request, res: Response) => {
                                                                    res.status(200).json({
                                                                            status: 'ONLINE',
                                                                                    architecture: 'ENTERPRISE_DISTRIBUTED_MESH',
                                                                                            timestamp: new Date().toISOString()
                                                                                                  });
                                                                                                      });

                                                                                                          // High-Throughput User Profile Endpoint
                                                                                                              this.app.get('/api/v1/users/:username', async (req: Request, res: Response, next: NextFunction) => {
                                                                                                                    try {
                                                                                                                            const { username } = req.params;
                                                                                                                                    const user = await UserModel.findOne({ username }).lean();
                                                                                                                                            
                                                                                                                                                    if (!user) {
                                                                                                                                                              return res.status(404).json({ error: 'User target identity not found' });
                                                                                                                                                                      }

                                                                                                                                                                              return res.status(200).json(user);
                                                                                                                                                                                    } catch (error) {
                                                                                                                                                                                            next(error);
                                                                                                                                                                                                  }
                                                                                                                                                                                                      });
                                                                                                                                                                                                        }

                                                                                                                                                                                                          private configureErrorHandler(): void {
                                                                                                                                                                                                              this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
                                                                                                                                                                                                                    console.error('🔥 Server Error Unhandled Fault:', err.message);
                                                                                                                                                                                                                          res.status(500).json({
                                                                                                                                                                                                                                  error: 'Internal Server Fault',
                                                                                                                                                                                                                                          message: err.message
                                                                                                                                                                                                                                                });
                                                                                                                                                                                                                                                    });
                                                                                                                                                                                                                                                      }

                                                                                                                                                                                                                                                        public async bootstrap(port: number = 5000): Promise<void> {
                                                                                                                                                                                                                                                            try {
                                                                                                                                                                                                                                                                  // 1. Connect Primary Database
                                                                                                                                                                                                                                                                        await connectDatabase();

                                                                                                                                                                                                                                                                              // 2. Connect Redis Caching Mesh
                                                                                                                                                                                                                                                                                    await this.redisMesh.connect();

                                                                                                                                                                                                                                                                                          // 3. Start Express Engine
                                                                                                                                                                                                                                                                                                this.app.listen(port, () => {
                                                                                                                                                                                                                                                                                                        console.log(`🚀 Enterprise Telemetry Server operational on port ${port}`);
                                                                                                                                                                                                                                                                                                              });
                                                                                                                                                                                                                                                                                                                  } catch (error) {
                                                                                                                                                                                                                                                                                                                        console.error('❌ Bootstrap Critical Failure:', error);
                                                                                                                                                                                                                                                                                                                              process.exit(1);
                                                                                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                                                                                    const server = new ServerApp();
                                                                                                                                                                                                                                                                                                                                    server.bootstrap();
                                                                                                                                                                                                                                                                                                                                    