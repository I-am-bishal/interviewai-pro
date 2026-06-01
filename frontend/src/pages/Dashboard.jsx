import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Target, Award, ArrowRight, ChevronRight } from 'lucide-react';
import { Card, Badge, ProgressBar, SectionTitle } from '../components/ui/index.jsx';
import Button from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

const INTERVIEW_MODES = [
  {
    id: 'hr', emoji: '👤', label: 'HR Interview',
    desc: 'Culture fit, motivation, soft skills & situational judgment.',
    tags: ['Communication', 'Values', 'Leadership'], color: 'blue',
  },
  {
    id: 'dsa', emoji: '🧮', label: 'DSA Round',
    desc: 'Algorithms, data structures, and complexity analysis.',
    tags: ['Arrays', 'Trees', 'Dynamic Programming'], color: 'green',
  },
  {
    id: 'system-design', emoji: '🏗️', label: 'System Design',
    desc: 'Scalable architectures, trade-offs, and distributed systems.',
    tags: ['Scalability', 'APIs', 'Databases'], color: 'amber',
  },
  {
    id: 'behavioral', emoji: '💬', label: 'Behavioral',
    desc: 'STAR method competency and situational questions.',
    tags: ['Teamwork', 'Conflict', 'Achievement'], color: 'pink',
  },
];

const STATS = [
  { label: 'Total Interviews', value: '24', change: '+4 this week', icon: Target, up: true },
  { label: 'Average Score',    value: '82%', change: '+6% improved', icon: TrendingUp, up: true },
  { label: 'Current Streak',  value: '🔥 7d', change: 'Personal best!', icon: Zap, up: true },
  { label: 'Badges Earned',   value: '12',  change: '2 new unlocked', icon: Award, up: true },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const startInterview = (mode) => {
    navigate('/interview/room', { state: { mode } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">
            Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Ready for today's interview practice?</p>
        </div>
        <Button onClick={() => navigate('/interview')} iconRight={<ArrowRight size={15} />}>
          New Interview
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map(({ label, value, change, icon: Icon, up }) => (
          <Card key={label} className="!p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="text-[11px] font-semibold tracking-wider uppercase text-white/40">{label}</div>
              <Icon size={15} className="text-white/20" />
            </div>
            <div className="font-heading text-2xl font-extrabold mb-1">{value}</div>
            <div className={`text-xs font-medium ${up ? 'text-success' : 'text-danger'}`}>{change}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interview Modes */}
        <div className="lg:col-span-2">
          <SectionTitle>Start New Interview</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INTERVIEW_MODES.map((mode, i) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card hover onClick={() => startInterview(mode.id)} className="!p-5 group">
                  <div className="text-3xl mb-3">{mode.emoji}</div>
                  <div className="font-heading font-bold text-[15px] mb-1.5">{mode.label}</div>
                  <div className="text-[12.5px] text-white/50 mb-3 leading-relaxed">{mode.desc}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {mode.tags.map((t) => (
                      <Badge key={t} color={mode.color}>{t}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-end mt-3 text-accent text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Start <ChevronRight size={13} />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Daily Challenge */}
          <div>
            <SectionTitle>Daily Challenge</SectionTitle>
            <Card className="border-accent/40">
              <div className="flex items-center gap-2 mb-3">
                <Badge color="purple">Today</Badge>
                <Badge color="amber">Medium</Badge>
              </div>
              <div className="font-heading font-bold mb-1">Design a Distributed Cache</div>
              <div className="text-[12.5px] text-white/50 mb-3">System Design · 30 min · 150 XP</div>
              <Button size="sm" className="w-full" onClick={() => startInterview('system-design')}>
                Start Challenge →
              </Button>
            </Card>
          </div>

          {/* Recent interviews */}
          <div>
            <SectionTitle>Recent Sessions</SectionTitle>
            <Card className="!p-4 space-y-3">
              {[
                { type: 'System Design', topic: 'API Gateway', score: 88, color: 'amber' },
                { type: 'DSA Round', topic: 'Binary Trees', score: 76, color: 'green' },
                { type: 'HR Interview', topic: 'Leadership', score: 91, color: 'blue' },
              ].map(({ type, topic, score, color }) => (
                <div key={topic} className="flex items-center gap-3">
                  <Badge color={color} className="flex-shrink-0">{type}</Badge>
                  <span className="flex-1 text-[13px] text-white/70 truncate">{topic}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-accent text-sm">{score}%</span>
                    <ProgressBar value={score} className="w-12" />
                  </div>
                </div>
              ))}
              <button
                onClick={() => navigate('/analytics')}
                className="w-full text-center text-[12px] text-accent/70 hover:text-accent transition-colors pt-1"
              >
                View all →
              </button>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
