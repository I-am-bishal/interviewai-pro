import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Zap, Award } from 'lucide-react';
import { analyticsApi } from '../api/index.js';
import { Card, Badge, ProgressBar, SectionTitle, Skeleton } from '../components/ui/index.jsx';
import ScoreRing from '../components/ui/ScoreRing';

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([analyticsApi.summary(), analyticsApi.trend(30)])
      .then(([s, t]) => { setSummary(s); setTrend(t.trend || []); })
      .catch(() => {
        setSummary({
          totalInterviews: 24, avgScore: 82, currentStreak: 7,
          longestStreak: 14, xp: 4280, codingAccepted: 18, codingTotal: 22,
          avgScoreByMode: { hr: 91, dsa: 74, 'system-design': 79, behavioral: 86 },
        });
        setTrend(Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
          score: 50 + Math.round(Math.sin(i * 0.4) * 18) + i,
        })));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-6 space-y-4 max-w-5xl mx-auto">
      <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-24" />)}</div>
      <div className="grid grid-cols-3 gap-4">{[1,2,3].map(i => <Skeleton key={i} className="h-48" />)}</div>
    </div>
  );

  const maxScore = Math.max(...trend.map(t => t.score), 1);

  const SKILL_RADAR = [
    ['Communication',   88],
    ['Problem Solving', 79],
    ['Tech Knowledge',  82],
    ['System Thinking', 74],
    ['Leadership',      85],
    ['Code Quality',    91],
  ];

  const STAT_ITEMS = [
    { label: 'Total Interviews', value: summary?.totalInterviews ?? 0,   icon: Target,   color: '#3b82f6' },
    { label: 'Average Score',    value: `${summary?.avgScore ?? 0}%`,    icon: TrendingUp, color: '#10b981' },
    { label: 'Total XP',        value: (summary?.xp ?? 0).toLocaleString(), icon: Zap, color: '#7c5bf0' },
    { label: 'Best Streak',     value: `🔥 ${summary?.longestStreak ?? 0}d`, icon: Award, color: '#f59e0b' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-5xl mx-auto relative overflow-hidden">
      <div className="ambient-orb ambient-orb-1 absolute -top-48 -left-20" />
      <div className="ambient-orb ambient-orb-2 absolute top-1/2 -right-20" />

      <div className="mb-7 relative z-10">
        <h1 className="font-heading text-2xl font-extrabold mb-1 tracking-tight">Analytics</h1>
        <p className="text-slate-500 text-sm">Your interview performance over time</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7 relative z-10">
        {STAT_ITEMS.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="!p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="text-[10.5px] font-semibold tracking-widest uppercase text-slate-500">{label}</div>
              <div
                className="icon-container icon-container-sm"
                style={{ background: `${color}12`, borderColor: `${color}20` }}
              >
                <Icon size={13} style={{ color }} />
              </div>
            </div>
            <div className="font-heading text-2xl font-extrabold tracking-tight" style={{ color }}>{value}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5 relative z-10">
        {/* 30-day trend chart */}
        <Card className="lg:col-span-2">
          <SectionTitle>30-Day Score Trend</SectionTitle>
          <div className="flex items-end gap-[3px] h-28 pb-1">
            {trend.map((point, i) => {
              const h = Math.max(4, (point.score / maxScore) * 100);
              const isToday = i === trend.length - 1;
              return (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.015, duration: 0.4, ease: 'easeOut' }}
                  title={`${point.date}: ${point.score}%`}
                  className="flex-1 rounded-t-sm cursor-pointer group relative transition-colors duration-200"
                  style={{
                    background: isToday
                      ? 'linear-gradient(180deg, #7c5bf0, #3b82f6)'
                      : `linear-gradient(180deg, rgba(124,91,240,${0.3 + (h/100)*0.5}), rgba(59,130,246,${0.15 + (h/100)*0.3}))`,
                  }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-bg-2 border border-border/50 rounded-lg px-2 py-1 text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-mono shadow-elevated">
                    {point.score}%
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-medium">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </Card>

        {/* Score by mode */}
        <Card>
          <SectionTitle>Score by Mode</SectionTitle>
          <div className="space-y-3">
            {[
              ['HR',            summary?.avgScoreByMode?.hr,              'blue'],
              ['DSA',           summary?.avgScoreByMode?.dsa,             'green'],
              ['System Design', summary?.avgScoreByMode?.['system-design'], 'amber'],
              ['Behavioral',    summary?.avgScoreByMode?.behavioral,      'pink'],
            ].map(([label, score = 0, color]) => (
              <div key={label}>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-semibold text-slate-800">{score}%</span>
                </div>
                <ProgressBar value={score} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 relative z-10">
        {/* Skill radar (bar version) */}
        <Card>
          <SectionTitle>Skill Breakdown</SectionTitle>
          <div className="space-y-3">
            {SKILL_RADAR.map(([label, val]) => (
              <div key={label}>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-semibold text-accent">{val}%</span>
                </div>
                <ProgressBar value={val} />
              </div>
            ))}
          </div>
        </Card>

        {/* Score rings + activity */}
        <div className="space-y-4">
          <Card>
            <SectionTitle>Overall Scores</SectionTitle>
            <div className="flex justify-around py-2">
              <ScoreRing score={summary?.avgScore ?? 0}     label="Avg Score"  size={90} color="#7c5bf0" />
              <ScoreRing score={summary?.currentStreak ?? 0} label="Streak"    size={90} color="#f59e0b" />
              <ScoreRing
                score={summary?.codingTotal ? Math.round((summary.codingAccepted / summary.codingTotal) * 100) : 0}
                label="Code Pass"
                size={90}
                color="#10b981"
              />
            </div>
          </Card>

          <Card>
            <SectionTitle>Weekly Activity</SectionTitle>
            <div className="flex gap-1.5 flex-wrap">
              {Array.from({ length: 35 }, (_, i) => {
                const intensity = Math.random();
                const opacity = intensity > 0.7 ? 0.9 : intensity > 0.4 ? 0.5 : intensity > 0.2 ? 0.2 : 0.06;
                return (
                  <div
                    key={i}
                    title={`${intensity > 0.2 ? Math.ceil(intensity * 3) : 0} interviews`}
                    className="w-4 h-4 rounded cursor-pointer hover:ring-1 hover:ring-accent/40 transition-all"
                    style={{
                      background: intensity > 0.2
                        ? `rgba(124, 91, 240, ${opacity})`
                        : 'rgb(var(--bg-4) / 0.4)',
                    }}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-medium">
              <span>5 weeks ago</span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded" style={{ background: 'rgba(124, 91, 240, 0.2)' }} /> Low
                <span className="w-3 h-3 rounded ml-1" style={{ background: 'rgba(124, 91, 240, 0.9)' }} /> High
              </span>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
