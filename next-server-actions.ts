'use server';

import { z } from 'zod';

/**
 * Enterprise-Grade Telemetry Payload Validation Schema
 * Engineered for strict runtime type safety across European Edge Nodes.
 */
const EnterpriseTelemetrySchema = z.object({
  nodeId: z.string().min(3, { message: 'Node identifier must be at least 3 characters.' }),
  region: z.enum([
    'Zurich-CH', 
    'Copenhagen-DK', 
    'Oslo-NO', 
    'Stockholm-SE', 
    'Helsinki-FI', 
    'Amsterdam-NL', 
    'Luxembourg-LU'
  ]),
  cpuLoadPercentage: z.number().min(0).max(100),
  edgeLatencyMs: z.number().positive(),
  memoryRssMegabytes: z.number().positive(),
  clusterStatus: z.enum(['OPERATIONAL', 'DEGRADED', 'CRITICAL_FAILOVER']),
  epochTimestamp: z.number()
});

