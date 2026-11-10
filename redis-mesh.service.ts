import { createClient, RedisClientType } from 'redis';

/**
 * Enterprise Redis Distributed Cache & Event Mesh Engine
 * Engineered for low-latency state synchronization across Zurich and Nordic Edge Nodes.
 */
class EnterpriseRedisTelemetryMesh {
  private client: RedisClientType;
  private isConnected: boolean = false;

  constructor(redisConnectionString: string = process.env.REDIS_URL || 'redis://localhost:6379') {
    this.client = createClient({
      url: redisConnectionString,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
        connectTimeout: 10000
      }
    });

    this.client.on('error', (err) => {
      console.error('[Redis Mesh Fatal Error]: High-availability cluster disconnected.', err);
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      console.log('[Redis Mesh Connected]: Secure telemetry stream active across European nodes.');
      this.isConnected = true;
    });
  }

  public async initializeMesh(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
    }
  }

  public async cacheEdgeTelemetry(nodeId: string, payload: Record<string, unknown>, ttlSeconds: number = 60): Promise<boolean> {
    try {
      await this.initializeMesh();
      const key = `telemetry:edge:${nodeId}`;
      const serializedData = JSON.stringify({
        ...payload,
        synchronizedAt: new Date().toISOString()
      });

      await this.client.setEx(key, ttlSeconds, serializedData);
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown caching failure';
      console.error(`[Cache Failure] Failed to sync node ${nodeId}:`, errorMessage);
      return false;
    }
  }

  public async getCachedTelemetry(nodeId: string): Promise<Record<string, unknown> | null> {
    try {
      await this.initializeMesh();
      const key = `telemetry:edge:${nodeId}`;
      const rawData = await this.client.get(key);

      if (!rawData) return null;
      return JSON.parse(rawData) as Record<string, unknown>;
    } catch (error: unknown) {
      console.error(`[Retrieval Failure] Could not fetch node ${nodeId}:`, error);
      return null;
    }
  }
}

export const globalRedisTelemetryMesh = new EnterpriseRedisTelemetryMesh();
    
