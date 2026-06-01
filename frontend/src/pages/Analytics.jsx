import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Zap, Award, Calendar } from 'lucide-react';
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
        // Use mock data when API not connected yet
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

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold mb-1">Analytics</h1>
        <p className="text-slate-400 text-sm">Your interview performance over time</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Interviews', value: summary?.totalInterviews ?? 0,   icon: Target,   color: 'text-info' },
          { label: 'Average Score',    value: `${summary?.avgScore ?? 0}%`,    icon: TrendingUp, color: 'text-success' },
          { label: 'Total XP',        value: (summary?.xp ?? 0).toLocaleString(), icon: Zap, color: 'text-accent' },
          { label: 'Best Streak',     value: `🔥 ${summary?.longestStreak ?? 0}d`, icon: Award, color: 'text-warning' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="!p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">{label}</div>
              <Icon size={14} className={`${color} opacity-60`} />
            </div>
            <div className={`font-heading text-2xl font-extrabold ${color}`}>{value}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* 30-day trend chart */}
        <Card className="lg:col-span-2">
          <SectionTitle>30-Day Score Trend</SectionTitle>
          <div className="flex items-end gap-1 h-28 pb-1">
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
                  className={`flex-1 rounded-t cursor-pointer group relative ${
                    isToday
                      ? 'bg-accent'
                      : 'bg-gradient-to-t from-accent/30 to-accent/70 hover:from-accent/50 hover:to-accent'
                  }`}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-bg-2 border border-border rounded px-1.5 py-0.5 text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {point.score}%
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-2">
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
                  <span className="text-slate-600">{label}</span>
                  <span className="font-semibold text-slate-800">{score}%</span>
                </div>
                <ProgressBar value={score} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Skill radar (bar version) */}
        <Card>
          <SectionTitle>Skill Breakdown</SectionTitle>
          <div className="space-y-3">
            {SKILL_RADAR.map(([label, val]) => (
              <div key={label}>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="text-slate-600">{label}</span>
                  <span className="font-semibold text-accent">{val}%</span>
                </div>
                <ProgressBar value={val} />
              </div>
            ))}
          </div>
        </Card>

        {/* Score rings + coding stats */}
        <div className="space-y-4">
          <Card>
            <SectionTitle>Overall Scores</SectionTitle>
            <div className="flex justify-around py-2">
              <ScoreRing score={summary?.avgScore ?? 0}     label="Avg Score"  size={90} color="#7c6dfa" />
              <ScoreRing score={summary?.currentStreak ?? 0} label="Streak"    size={90} color="#f5a623" />
              <ScoreRing
                score={summary?.codingTotal ? Math.round((summary.codingAccepted / summary.codingTotal) * 100) : 0}
                label="Code Pass"
                size={90}
                color="#22c984"
              />
            </div>
          </Card>

          <Card>
            <SectionTitle>Weekly Activity</SectionTitle>
            <div className="flex gap-1.5 flex-wrap">
              {Array.from({ length: 35 }, (_, i) => {
                const intensity = Math.random();
                let bg = 'bg-bg-4';
                if (intensity > 0.7) bg = 'bg-accent';
                else if (intensity > 0.4) bg = 'bg-accent/50';
                else if (intensity > 0.2) bg = 'bg-accent/20';
                return (
                  <div
                    key={i}
                    title={`${intensity > 0.2 ? Math.ceil(intensity * 3) : 0} interviews`}
                    className={`w-4 h-4 rounded-sm ${bg} cursor-pointer hover:ring-1 hover:ring-accent/50 transition-all`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-2">
              <span>5 weeks ago</span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-accent/20" /> Low
                <span className="w-3 h-3 rounded-sm bg-accent ml-1" /> High
              </span>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
