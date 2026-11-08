import mongoose from 'mongoose';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
    private isConnected: boolean = false;

      private constructor() {}

        public static getInstance(): DatabaseConnection {
            if (!DatabaseConnection.instance) {
                  DatabaseConnection.instance = new DatabaseConnection();
                      }
                          return DatabaseConnection.instance;
                            }

                              public async connect(uri: string): Promise<void> {
                                  if (this.isConnected) {
                                        console.log('⚡ MongoDB is already connected (Mesh Active).');
                                              return;
                                                  }

                                                      try {
                                                            const db = await mongoose.connect(uri, {
                                                                    serverSelectionTimeoutMS: 5000,
                                                                          });
                                                                                this.isConnected = true;
                                                                                      console.log(`🔥 MongoDB Connected Successfully: ${db.connection.host}`);
                                                                                          } catch (error) {
                                                                                                console.error('❌ MongoDB Connection Failed:', error);
                                                                                                      process.exit(1);
                                                                                                          }
                                                                                                            }

                                                                                                              public async disconnect(): Promise<void> {
                                                                                                                  if (!this.isConnected) return;
                                                                                                                      await mongoose.disconnect();
                                                                                                                          this.isConnected = false;
                                                                                                                              console.log('🔌 MongoDB Disconnected Gracefully.');
                                                                                                                                }
                                                                                                                                }
                                                                                                                                