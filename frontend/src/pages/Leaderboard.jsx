import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Trophy, Medal } from 'lucide-react';
import { analyticsApi } from '../api/index.js';
import { Card, Badge, SectionTitle, Skeleton } from '../components/ui/index.jsx';
import { useAuthStore } from '../store/authStore';

const AVATARS_BG = [
  '#7c6dfa','#22c984','#4da6ff','#f5a623',
  '#ff6eb3','#9d8fff','#5dcaa5','#7f77dd',
];

const MOCK_LEADERS = [
  { name: 'Priya S.',  xp: 2840, currentStreak: 42 },
  { name: 'Marcus T.', xp: 2620, currentStreak: 38 },
  { name: 'Alex R.',   xp: 2480, currentStreak: 31 },
  { name: 'Yuki N.',   xp: 2310, currentStreak: 27 },
  { name: 'Rania K.',  xp: 2190, currentStreak: 22 },
  { name: 'Jake M.',   xp: 2050, currentStreak: 19 },
  { name: 'Chen W.',   xp: 1980, currentStreak: 14 },
  { name: 'Aria B.',   xp: 1840, currentStreak: 11 },
];

const ACHIEVEMENTS = [
  { icon: '🔥', title: 'Streak Master',  desc: '30-day practice streak' },
  { icon: '⚡', title: 'Speed Coder',    desc: 'Solved a problem in < 10 min' },
  { icon: '🧠', title: 'DSA Pro',        desc: '90%+ average DSA score' },
  { icon: '🏆', title: 'Top 10',         desc: 'Reached weekly top 10' },
  { icon: '💯', title: 'Perfect Round',  desc: 'Scored 100% on HR interview' },
  { icon: '📈', title: 'Consistent',     desc: '7-day consecutive streak' },
];

const PERIODS = ['Weekly', 'Monthly', 'All Time'];

const Leaderboard = () => {
  const { user } = useAuthStore();
  const [leaders, setLeaders]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [period, setPeriod]       = useState('Weekly');

  useEffect(() => {
    analyticsApi.leaderboard()
      .then((d) => setLeaders(d.leaders?.length ? d.leaders : MOCK_LEADERS))
      .catch(() => setLeaders(MOCK_LEADERS))
      .finally(() => setLoading(false));
  }, []);

  const myRank = leaders.findIndex((l) => l.name === user?.name) + 1;

  const rankDisplay = (rank) => {
    if (rank === 1) return { emoji: '🥇', cls: 'text-yellow-400 font-black' };
    if (rank === 2) return { emoji: '🥈', cls: 'text-gray-300 font-black' };
    if (rank === 3) return { emoji: '🥉', cls: 'text-orange-400 font-black' };
    return { emoji: null, cls: 'text-white/30 font-bold' };
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold mb-1">Leaderboard</h1>
        <p className="text-white/40 text-sm">Compete with engineers worldwide and track your rank</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main leaderboard */}
        <div className="lg:col-span-2">
          {/* Period toggle */}
          <div className="flex gap-1.5 mb-4">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  period === p ? 'bg-accent text-white' : 'bg-bg-2 border border-border text-white/50 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <Card className="!p-4">
            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-14" />)}
              </div>
            ) : (
              <div className="space-y-1">
                {leaders.map((leader, idx) => {
                  const rank = idx + 1;
                  const { emoji, cls } = rankDisplay(rank);
                  const initials = leader.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                  const isMe = leader.name === user?.name;

                  return (
                    <motion.div
                      key={leader.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                        isMe ? 'bg-accent/10 border border-accent/30' : 'hover:bg-bg-3'
                      }`}
                    >
                      {/* Rank */}
                      <div className={`w-7 text-center text-sm ${cls}`}>
                        {emoji || rank}
                      </div>

                      {/* Avatar */}
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: AVATARS_BG[idx % AVATARS_BG.length] }}
                      >
                        {initials}
                      </div>

                      {/* Name */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium flex items-center gap-2">
                          {leader.name}
                          {isMe && <Badge color="purple" className="!text-[9px]">You</Badge>}
                        </div>
                        <div className="text-[11px] text-warning flex items-center gap-1">
                          🔥 {leader.currentStreak || 0} day streak
                        </div>
                      </div>

                      {/* XP */}
                      <div className="text-right">
                        <div className="font-heading font-bold text-accent text-sm">
                          {(leader.xp || 0).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-white/30">XP</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Your rank */}
          <Card className="text-center !p-5">
            <Trophy size={24} className="text-accent mx-auto mb-2" />
            <SectionTitle className="text-center">Your Rank</SectionTitle>
            <div className="font-heading text-5xl font-extrabold text-accent mb-1">
              #{myRank || '—'}
            </div>
            <div className="text-white/40 text-xs mb-3">
              of {leaders.length.toLocaleString()}+ users
            </div>
            <Badge color="purple" className="!text-xs">
              Top {myRank && leaders.length ? Math.ceil((myRank / leaders.length) * 100) : '—'}%
            </Badge>
          </Card>

          {/* Your stats */}
          <Card className="!p-4">
            <SectionTitle>Your Stats</SectionTitle>
            <div className="space-y-2.5">
              {[
                ['XP Earned',    '2,480'],
                ['Current Streak', '🔥 7 days'],
                ['Interviews',   '24'],
                ['Avg Score',    '82%'],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between text-[13px]">
                  <span className="text-white/40">{label}</span>
                  <span className="font-medium">{val}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Achievements */}
          <Card className="!p-4">
            <SectionTitle>Achievements</SectionTitle>
            <div className="space-y-2">
              {ACHIEVEMENTS.map(({ icon, title, desc }) => (
                <div key={title} className="flex items-center gap-2.5 py-2 border-b border-border last:border-0">
                  <div className="text-lg flex-shrink-0">{icon}</div>
                  <div>
                    <div className="text-[13px] font-medium">{title}</div>
                    <div className="text-[11px] text-white/40">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Leaderboard;
