import { z } from 'zod';

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeoutMs: number;
}

/**
 * Enterprise Telemetry Circuit Breaker & Resilience Engine
 * Built for Zurich-grade distributed edge nodes to prevent cascading systemic failures.
 */
export class TelemetryCircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount: number = 0;
  private lastStateChangeTimestamp: number = Date.now();

  constructor(private config: CircuitBreakerConfig = { failureThreshold: 3, resetTimeoutMs: 10000 }) {}

  public async executeCommand<T>(action: () => Promise<T>, fallback: () => T): Promise<T> {
    this.evaluateStateTransitions();

    if (this.state === 'OPEN') {
      console.warn('[Circuit Breaker OPEN]: Request intercepted. Executing resilience fallback.');
      return fallback();
    }

    try {
      const result = await action();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      console.error('[Circuit Breaker Interception]: Edge node call failed.', error);
      return fallback();
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      this.lastStateChangeTimestamp = Date.now();
      console.log('[Circuit Breaker Reset]: Cluster restored to HEALTHY (CLOSED state).');
    }
  }

  private onFailure(): void {
    this.failureCount += 1;
    if (this.failureCount >= this.config.failureThreshold) {
      this.state = 'OPEN';
      this.lastStateChangeTimestamp = Date.now();
      console.error(`[Circuit Breaker Tripped]: Failure threshold exceeded (${this.failureCount}). Circuit is now OPEN.`);
    }
  }

  private evaluateStateTransitions(): void {
    if (this.state === 'OPEN' && Date.now() - this.lastStateChangeTimestamp > this.config.resetTimeoutMs) {
      this.state = 'HALF_OPEN';
      this.lastStateChangeTimestamp = Date.now();
      console.log('[Circuit Breaker Probe]: Circuit transitioning to HALF_OPEN to test node recovery.');
    }
  }

  public getCircuitHealth(): { state: CircuitState; currentFailures: number } {
    return {
      state: this.state,
      currentFailures: this.failureCount
    };
  }
}

export const globalTelemetryBreaker = new TelemetryCircuitBreaker();
