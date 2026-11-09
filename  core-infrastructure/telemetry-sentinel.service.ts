import { EventEmitter } from 'events';

export interface NodeHealthMetric {
  nodeId: string;
    cpuLoad: number;
      memoryUsageMB: number;
        activeConnections: number;
          latencyMs: number;
            status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
              timestamp: number;
              }

              export class TelemetrySentinel extends EventEmitter {
                private nodeRegistry: Map<string, NodeHealthMetric> = new Map();
                  private readonly LATENCY_THRESHOLD_MS = 250;
                    private readonly CPU_CRITICAL_LOAD = 85.0;

                      constructor() {
                          super();
                              this.initializeSentinelListeners();
                                }

                                  private initializeSentinelListeners(): void {
                                      this.on('node:metric-reported', (metric: NodeHealthMetric) => {
                                            this.evaluateNodeHealth(metric);
                                                });
                                                  }

                                                    public ingestNodeMetric(metric: NodeHealthMetric): void {
                                                        metric.timestamp = Date.now();
                                                            this.nodeRegistry.set(metric.nodeId, metric);
                                                                this.emit('node:metric-reported', metric);
                                                                  }

                                                                    private evaluateNodeHealth(metric: NodeHealthMetric): void {
                                                                        if (metric.cpuLoad >= this.CPU_CRITICAL_LOAD || metric.latencyMs >= this.LATENCY_THRESHOLD_MS) {
                                                                              metric.status = 'CRITICAL';
                                                                                    this.triggerFailoverProtocol(metric);
                                                                                        } else if (metric.cpuLoad > 60.0) {
                                                                                              metric.status = 'DEGRADED';
                                                                                                  } else {
                                                                                                        metric.status = 'HEALTHY';
                                                                                                            }
                                                                                                              }

                                                                                                                private triggerFailoverProtocol(metric: NodeHealthMetric): void {
                                                                                                                    console.warn(`[SENTINEL-CRITICAL]: Node ${metric.nodeId} is failing! CPU: ${metric.cpuLoad}%, Latency: ${metric.latencyMs}ms. Rerouting traffic...`);
                                                                                                                        // Enterprise fault-tolerance trigger logic for distributed mesh
                                                                                                                            this.emit('node:failover-triggered', { nodeId: metric.nodeId, timestamp: Date.now() });
                                                                                                                              }

                                                                                                                                public getClusterOverview(): { totalNodes: number; criticalNodes: number; nodes: NodeHealthMetric[] } {
                                                                                                                                    const nodes = Array.from(this.nodeRegistry.values());
                                                                                                                                        const criticalNodes = nodes.filter(n => n.status === 'CRITICAL').length;
                                                                                                                                            return {
                                                                                                                                                  totalNodes: nodes.length,
                                                                                                                                                        criticalNodes,
                                                                                                                                                              nodes
                                                                                                                                                                  };
                                                                                                                                                                    }
                                                                                                                                                                    }
                                                                                                                                                                    