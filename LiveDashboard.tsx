'use client';

import React, { useEffect } from 'react';
import { create } from 'zustand';

// 1. Define Store State Interface
interface TelemetryState {
  serverStatus: string;
    architecture: string;
      lastUpdated: string;
        fetchHealth: () => Promise<void>;
        }

        // 2. Create Zustand High-Performance Store
        const useTelemetryStore = create<TelemetryState>((set) => ({
          serverStatus: 'CONNECTING...',
            architecture: 'PENDING_MESH_SYNC',
              lastUpdated: '-',
                fetchHealth: async () => {
                    try {
                          const response = await fetch('http://localhost:5000/health');
                                const data = await response.json();
                                      set({
                                              serverStatus: data.status,
                                                      architecture: data.architecture,
                                                              lastUpdated: new Date(data.timestamp).toLocaleTimeString(),
                                                                    });
                                                                        } catch (error) {
                                                                              set({ serverStatus: 'OFFLINE_FAULT', lastUpdated: new Date().toLocaleTimeString() });
                                                                                  }
                                                                                    },
                                                                                    }));

                                                                                    // 3. Live Dashboard React Component (Nordic Minimalist Dark Theme)
                                                                                    export default function LiveDashboard() {
                                                                                      const { serverStatus, architecture, lastUpdated, fetchHealth } = useTelemetryStore();

                                                                                        useEffect(() => {
                                                                                            fetchHealth();
                                                                                                const interval = setInterval(fetchHealth, 5000); // Poll every 5 seconds
                                                                                                    return () => clearInterval(interval);
                                                                                                      }, [fetchHealth]);

                                                                                                        return (
                                                                                                            <div style={{ background: '#0a0a0a', color: '#ededed', padding: '24px', fontFamily: 'monospace', minHeight: '100vh' }}>
                                                                                                                  <header style={{ borderBottom: '1px solid #333', paddingBottom: '16px', marginBottom: '24px' }}>
                                                                                                                          <h1 style={{ fontSize: '20px', margin: 0, color: '#00ff66' }}>🛡️ KUNAL NORDIC TELEMETRY MESH</h1>
                                                                                                                                  <p style={{ fontSize: '12px', color: '#888', margin: '4px 0 0 0' }}>Enterprise Distributed Node Monitor v1.0</p>
                                                                                                                                        </header>

                                                                                                                                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                                                                                                                                                      {/* Status Card */}
                                                                                                                                                              <div style={{ background: '#161616', border: '1px solid #222', padding: '16px', borderRadius: '8px' }}>
                                                                                                                                                                        <span style={{ fontSize: '12px', color: '#aaa' }}>SERVER STATUS</span>
                                                                                                                                                                                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: serverStatus === 'ONLINE' ? '#00ff66' : '#ff3333', marginTop: '8px' }}>
                                                                                                                                                                                              {serverStatus}
                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                        {/* Architecture Card */}
                                                                                                                                                                                                                                <div style={{ background: '#161616', border: '1px solid #222', padding: '16px', borderRadius: '8px' }}>
                                                                                                                                                                                                                                          <span style={{ fontSize: '12px', color: '#aaa' }}>MESH PROTOCOL</span>
                                                                                                                                                                                                                                                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#3399ff', marginTop: '8px' }}>
                                                                                                                                                                                                                                                                {architecture}
                                                                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                                                                                  </div>

                                                                                                                                                                                                                                                                                          {/* Last Sync Card */}
                                                                                                                                                                                                                                                                                                  <div style={{ background: '#161616', border: '1px solid #222', padding: '16px', borderRadius: '8px' }}>
                                                                                                                                                                                                                                                                                                            <span style={{ fontSize: '12px', color: '#aaa' }}>LAST TELEMETRY SYNC</span>
                                                                                                                                                                                                                                                                                                                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffcc00', marginTop: '8px' }}>
                                                                                                                                                                                                                                                                                                                                  {lastUpdated}
                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                