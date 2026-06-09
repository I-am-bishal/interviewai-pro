import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Database, Cpu, Clock, RefreshCw, AlertTriangle,
  CheckCircle, Server, Wifi, WifiOff, ListCollapse
} from 'lucide-react';
import { Card, Badge, ProgressBar, SectionTitle, Toggle } from '../components/ui/index.jsx';
import Button from '../components/ui/Button';
import axios from 'axios';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 280, damping: 24 }
  }
};

const formatUptime = (seconds) => {
  if (!seconds && seconds !== 0) return '0s';
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(' ');
};

const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const Status = () => {
  const [loading, setLoading] = useState(false);
  const [healthData, setHealthData] = useState(null);
  const [latency, setLatency] = useState(null);
  const [error, setError] = useState(null);
  const [pingHistory, setPingHistory] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(10);
  const [logMessages, setLogMessages] = useState([]);

  // Fetch health data
  const fetchHealthData = useCallback(async () => {
    setLoading(true);
    const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const healthUrl = baseApiUrl.replace(/\/api\/?$/, '') + '/health';
    const startTime = performance.now();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    try {
      const response = await axios.get(healthUrl, { timeout: 6000 });
      const duration = Math.round(performance.now() - startTime);

      setHealthData(response.data);
      setLatency(duration);
      setError(null);

      // Append to history
      setPingHistory((prev) => {
        const next = [...prev, { time: timeStr, latency: duration, status: response.data?.status || 'healthy' }];
        return next.slice(-12); // Keep last 12 entries
      });

      // Add to log
      setLogMessages((prev) => [
        { time: timeStr, type: 'success', text: `Ping success. Latency: ${duration}ms. DB Status: ${response.data?.database?.status || 'unknown'}` },
        ...prev.slice(0, 19)
      ]);
    } catch (err) {
      const duration = Math.round(performance.now() - startTime);
      let payload = null;
      let dbStatus = 'disconnected';

      // Check if we received system metrics even with error (e.g. 500 status on degraded database)
      if (err.response && err.response.data) {
        payload = err.response.data;
        dbStatus = payload.database?.status || 'disconnected';
      }

      setHealthData(payload);
      setLatency(payload ? duration : null);
      setError(err.message || 'Server Unreachable');

      // Append to history
      setPingHistory((prev) => {
        const next = [...prev, {
          time: timeStr,
          latency: payload ? duration : 0,
          status: payload ? 'degraded' : 'offline'
        }];
        return next.slice(-12);
      });

      // Add to log
      setLogMessages((prev) => [
        {
          time: timeStr,
          type: payload ? 'warning' : 'danger',
          text: payload
            ? `Degraded performance. Latency: ${duration}ms. DB Status: ${dbStatus}`
            : `System offline. Reason: ${err.message || 'Connection timeout'}`
        },
        ...prev.slice(0, 19)
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchHealthData();
  }, [fetchHealthData]);

  // Countdown timer for auto-refresh
  useEffect(() => {
    let timer;
    if (autoRefresh && !loading) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            fetchHealthData();
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [autoRefresh, loading, fetchHealthData]);

  // Handle manual refresh
  const handleManualRefresh = () => {
    fetchHealthData();
    setCountdown(10);
  };

  // Determine overall status indicators
  const isOnline = healthData !== null;
  const isHealthy = isOnline && healthData?.status === 'healthy';
  const isDegraded = isOnline && healthData?.status === 'degraded';

  let bannerText = 'SYSTEM STATUS UNKNOWN';
  let bannerColor = 'text-slate-400 bg-slate-500/10 border-slate-500/20 shadow-[0_0_20px_rgba(100,116,139,0.15)]';
  let bannerIcon = <Activity className="w-5 h-5 animate-pulse" />;

  if (!isOnline) {
    bannerText = 'SYSTEM OFFLINE';
    bannerColor = 'text-red-400 bg-red-500/10 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]';
    bannerIcon = <WifiOff className="w-5 h-5 text-red-400" />;
  } else if (isHealthy) {
    bannerText = 'ALL SYSTEMS OPERATIONAL';
    bannerColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.25)]';
    bannerIcon = <CheckCircle className="w-5 h-5 text-emerald-400" />;
  } else if (isDegraded) {
    bannerText = 'SYSTEM PERFORMANCE DEGRADED';
    bannerColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.2)]';
    bannerIcon = <AlertTriangle className="w-5 h-5 text-amber-400 animate-bounce" />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6 max-w-6xl mx-auto relative min-h-full overflow-hidden"
    >
      {/* Background Orbs */}
      <div className="ambient-orb ambient-orb-1 absolute -top-48 left-1/4" />
      <div className="ambient-orb ambient-orb-2 absolute top-1/3 -right-20" />
      <div className="ambient-orb ambient-orb-3 absolute -bottom-20 left-10" />

      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7 relative z-10">
        <div>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight flex items-center gap-2">
            System Diagnostics & Status
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isHealthy ? 'bg-emerald-400' : isDegraded ? 'bg-amber-400' : 'bg-red-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isHealthy ? 'bg-emerald-500' : isDegraded ? 'bg-amber-500' : 'bg-red-500'}`}></span>
            </span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Live monitoring and hardware resource diagnostics of the infrastructure.</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 bg-bg-2/50 backdrop-blur-md px-4 py-2 border border-border/40 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="text-[12px] font-semibold text-slate-500">Auto Refresh</span>
            <Toggle checked={autoRefresh} onChange={setAutoRefresh} />
          </div>
          <div className="h-4 w-[1px] bg-border/40" />
          <Button
            size="sm"
            onClick={handleManualRefresh}
            disabled={loading}
            className="flex items-center gap-1.5"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Check Now
          </Button>
        </div>
      </motion.div>

      {/* Status Banner */}
      <motion.div
        variants={itemVariants}
        className={`w-full border rounded-2xl p-4 flex items-center gap-4 font-heading font-extrabold text-[15px] tracking-wide mb-6 relative z-10 transition-all duration-500 ${bannerColor}`}
      >
        {bannerIcon}
        <span className="flex-1">{bannerText}</span>
        {autoRefresh && !loading && (
          <div className="text-[11px] font-mono font-medium tracking-normal text-slate-500 hidden sm:block">
            Next poll in {countdown}s
          </div>
        )}
      </motion.div>

      {/* Auto Refresh Progress bar indicator */}
      {autoRefresh && !loading && (
        <div className="w-full h-[2px] bg-bg-3/20 mb-6 overflow-hidden rounded-full z-10 relative">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: `${(countdown / 10) * 100}%` }}
            transition={{ duration: 1, ease: 'linear' }}
            className="h-full bg-accent-soft"
          />
        </div>
      )}

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7 relative z-10">
        {/* Metric 1: API Status */}
        <motion.div variants={itemVariants}>
          <Card className="!p-5 hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="text-[10.5px] font-bold tracking-widest uppercase text-slate-500">API Connection</div>
              <div className="icon-container icon-container-sm bg-blue-500/10 border-blue-500/20">
                <Server size={14} className="text-blue-400" />
              </div>
            </div>
            <div className="font-heading text-2xl font-extrabold mb-1.5 tracking-tight">
              {isOnline ? 'Online' : 'Offline'}
            </div>
            <div className="text-[11.5px] font-semibold text-slate-400 flex items-center gap-1">
              {isOnline ? (
                <>
                  <Wifi size={12} className="text-emerald-400" />
                  Latency: <span className="text-accent">{latency || 0} ms</span>
                </>
              ) : (
                <>
                  <WifiOff size={12} className="text-red-400" />
                  No connection response
                </>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Metric 2: Database Status */}
        <motion.div variants={itemVariants}>
          <Card className="!p-5 hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="text-[10.5px] font-bold tracking-widest uppercase text-slate-500">Database</div>
              <div className="icon-container icon-container-sm bg-emerald-500/10 border-emerald-500/20">
                <Database size={14} className="text-emerald-400" />
              </div>
            </div>
            <div className="font-heading text-2xl font-extrabold mb-1.5 tracking-tight capitalize">
              {isOnline && healthData?.database?.status ? healthData.database.status : 'Disconnected'}
            </div>
            <div className="text-[11.5px] font-semibold text-slate-400 flex items-center gap-1">
              {isOnline && healthData?.database?.status === 'connected' ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  ● Mongoose active
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-1">
                  ▲ Database offline
                </span>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Metric 3: Server Uptime */}
        <motion.div variants={itemVariants}>
          <Card className="!p-5 hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="text-[10.5px] font-bold tracking-widest uppercase text-slate-500">Server Uptime</div>
              <div className="icon-container icon-container-sm bg-amber-500/10 border-amber-500/20">
                <Clock size={14} className="text-amber-400" />
              </div>
            </div>
            <div className="font-heading text-xl font-extrabold mb-2 tracking-tight">
              {isOnline && healthData?.uptime !== undefined ? formatUptime(healthData.uptime) : 'Offline'}
            </div>
            <div className="text-[11.5px] font-semibold text-slate-400">
              Environment: <span className="text-accent uppercase text-[10px]">{isOnline ? (healthData?.env || 'dev') : 'none'}</span>
            </div>
          </Card>
        </motion.div>

        {/* Metric 4: Node Version & Load */}
        <motion.div variants={itemVariants}>
          <Card className="!p-5 hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="text-[10.5px] font-bold tracking-widest uppercase text-slate-500">App Version</div>
              <div className="icon-container icon-container-sm bg-violet-500/10 border-violet-500/20">
                <Activity size={14} className="text-violet-400" />
              </div>
            </div>
            <div className="font-heading text-2xl font-extrabold mb-1.5 tracking-tight">
              v{isOnline ? (healthData?.version || '1.0.0') : '0.0.0'}
            </div>
            <div className="text-[11.5px] font-semibold text-slate-400">
              Host Platform: <span className="text-accent">Node.js Express</span>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Latency History & Hardware Specs Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 relative z-10">
        {/* Latency graph panel */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <SectionTitle>Ping Latency History</SectionTitle>
          <Card className="!p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-[13px] font-semibold text-slate-400">Response Profile (Last 12 cycles)</div>
                <div className="flex items-center gap-3 text-[10px] text-slate-500 font-semibold">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Fast (&lt;75ms)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Normal (&lt;150ms)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> Slow / Offline
                  </span>
                </div>
              </div>

              {/* Ping history bar graph */}
              <div className="flex items-end justify-between h-28 px-3 bg-bg-3/20 backdrop-blur-sm rounded-2xl border border-border/30 pt-6 pb-2 relative">
                {/* Y-axis helper guides */}
                <div className="absolute left-0 right-0 top-1/4 border-b border-border/10 pointer-events-none" />
                <div className="absolute left-0 right-0 top-2/4 border-b border-border/10 pointer-events-none" />
                <div className="absolute left-0 right-0 top-3/4 border-b border-border/10 pointer-events-none" />

                {pingHistory.map((item, idx) => {
                  const maxVal = 200;
                  const heightPercent = Math.min(100, (item.latency / maxVal) * 100);

                  // Bar color
                  let barColor = 'bg-emerald-500/80 hover:bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]';
                  if (item.status === 'offline') {
                    barColor = 'bg-red-500/80 hover:bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]';
                  } else if (item.latency > 150) {
                    barColor = 'bg-red-500/80 hover:bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]';
                  } else if (item.latency > 75) {
                    barColor = 'bg-amber-500/80 hover:bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.2)]';
                  }

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group relative mx-0.5 sm:mx-1 max-w-[34px]">
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30 shadow-xl border border-border/20 font-mono">
                        {item.status === 'offline' ? (
                          <span className="text-red-400 font-bold">Offline</span>
                        ) : (
                          <span>{item.latency} ms</span>
                        )}
                        <div className="text-[8px] text-slate-400 mt-0.5">{item.time}</div>
                      </div>

                      {/* Bar */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${item.status === 'offline' ? 100 : Math.max(8, heightPercent)}%` }}
                        className={`w-full rounded-t-md transition-all duration-300 cursor-pointer ${barColor}`}
                      />
                    </div>
                  );
                })}

                {pingHistory.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 font-medium">
                    No diagnostic history recorded yet. Please wait...
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between text-[10px] text-slate-500 px-1 mt-3 font-mono font-medium">
              <span>{pingHistory[0]?.time || 'T-Minus'}</span>
              <span>Response Latency Profile (Capped @ 200ms)</span>
              <span>{pingHistory[pingHistory.length - 1]?.time || 'Now'}</span>
            </div>
          </Card>
        </motion.div>

        {/* Server Hardware specs & CPU Load */}
        <motion.div variants={itemVariants}>
          <SectionTitle>Server Resources</SectionTitle>
          <Card className="!p-6 h-full flex flex-col justify-between">
            {isOnline && healthData?.memory ? (
              <div className="space-y-5">
                {/* Memory Usage */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Cpu size={13} className="text-accent" />
                      RAM Utilization
                    </span>
                    <span className="text-slate-200 font-bold">
                      {healthData.memory.usagePercent}%
                    </span>
                  </div>
                  <ProgressBar value={healthData.memory.usagePercent} className="mb-2" />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Used: {formatBytes(healthData.memory.total - healthData.memory.free)}</span>
                    <span>Total: {formatBytes(healthData.memory.total)}</span>
                  </div>
                </div>

                <div className="border-t border-border/20 pt-4">
                  {/* Load Averages */}
                  <span className="block text-xs font-semibold text-slate-400 mb-2.5">
                    CPU Load Averages (1/5/15 min)
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {healthData.cpuLoad && healthData.cpuLoad.length > 0 ? (
                      healthData.cpuLoad.map((load, idx) => (
                        <div key={idx} className="bg-bg-3/20 rounded-xl p-2 border border-border/25">
                          <div className="text-[10px] text-slate-500 font-bold mb-0.5">
                            {idx === 0 ? '1 Min' : idx === 1 ? '5 Min' : '15 Min'}
                          </div>
                          <div className="font-heading font-extrabold text-sm text-accent">
                            {parseFloat(load.toFixed(2))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 text-xs text-slate-500 italic">No load stats returned</div>
                    )}
                  </div>
                </div>

                <div className="border-t border-border/20 pt-4 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Node Free Memory</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    {formatBytes(healthData.memory.free)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-center">
                <AlertTriangle size={24} className="text-red-400/80 mb-2 animate-bounce" />
                <span className="text-xs font-semibold">Server metrics unavailable</span>
                <span className="text-[10px] text-slate-500/80 mt-1 max-w-[180px]">Please ensure the backend server is running and reachable.</span>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Connection & Diagnostics Log Output */}
      <motion.div variants={itemVariants} className="relative z-10">
        <SectionTitle>Diagnostics Log Trace</SectionTitle>
        <Card className="!p-4 bg-slate-950/80 border-slate-900/60 font-mono text-xs max-h-56 overflow-y-auto">
          <div className="flex items-center justify-between text-slate-500 text-[10px] pb-2 border-b border-slate-800/60 mb-2 font-bold uppercase tracking-wider">
            <span>Timestamp</span>
            <span>Diagnostic Action & Payload Summary</span>
          </div>
          <div className="space-y-1.5">
            {logMessages.map((log, idx) => {
              let textClass = 'text-emerald-400';
              if (log.type === 'danger') textClass = 'text-red-400';
              if (log.type === 'warning') textClass = 'text-amber-400';

              return (
                <div key={idx} className="flex items-start gap-4">
                  <span className="text-slate-500 select-none flex-shrink-0">{log.time}</span>
                  <span className={`${textClass} leading-relaxed`}>{log.text}</span>
                </div>
              );
            })}
            {logMessages.length === 0 && (
              <div className="text-slate-600 italic text-center py-4">
                Initializing logs...
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Status;
