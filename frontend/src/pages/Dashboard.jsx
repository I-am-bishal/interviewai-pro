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

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 24
    }
  }
};

const AnimatedCounter = ({ value, duration = 1200 }) => {
  const [displayVal, setDisplayVal] = React.useState('');

  React.useEffect(() => {
    const numericStr = value.replace(/[^0-9]/g, '');
    const numeric = parseInt(numericStr, 10);
    
    if (isNaN(numeric)) {
      setDisplayVal(value);
      return;
    }

    const suffix = value.replace(/[0-9]/g, '');
    const isStreak = value.includes('🔥');
    const cleanSuffix = suffix.replace('🔥', '').trim();
    
    let startTime = null;
    let animFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      const current = Math.floor(eased * numeric);
      
      const formatted = isStreak 
        ? `🔥 ${current}${cleanSuffix}` 
        : `${current}${cleanSuffix}`;
        
      setDisplayVal(formatted);

      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      }
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [value, duration]);

  return <>{displayVal || value}</>;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const startInterview = (mode) => {
    navigate('/interview/room', { state: { mode } });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6 max-w-6xl mx-auto relative min-h-full dot-grid overflow-hidden"
    >
      {/* Background Ambient Glow Lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/8 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2 -z-10" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
            Welcome back, {user?.name?.split(' ')[0] || 'there'}{' '}
            <motion.span
              className="inline-block origin-[70%_70%]"
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{
                duration: 2.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 1.5
              }}
            >
              👋
            </motion.span>
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Ready for today's interview practice?</p>
        </div>
        <Button onClick={() => navigate('/interview')} iconRight={<ArrowRight size={15} />}>
          New Interview
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 relative z-10">
        {STATS.map(({ label, value, change, icon: Icon, up }) => (
          <motion.div key={label} variants={itemVariants}>
            <Card className="!p-4 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-start justify-between mb-2">
                <div className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">{label}</div>
                <Icon size={15} className="text-slate-300" />
              </div>
              <div className="font-heading text-2xl font-extrabold mb-1">
                <AnimatedCounter value={value} />
              </div>
              <div className={`text-xs font-medium ${up ? 'text-success' : 'text-danger'}`}>{change}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Interview Modes */}
        <div className="lg:col-span-2">
          <SectionTitle>Start New Interview</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INTERVIEW_MODES.map((mode) => (
              <motion.div
                key={mode.id}
                variants={itemVariants}
              >
                <Card hover onClick={() => startInterview(mode.id)} className="!p-5 group hover:shadow-2xl hover:shadow-accent/5 transition-all duration-300">
                  <div className="text-3xl mb-3">{mode.emoji}</div>
                  <div className="font-heading font-bold text-[15px] mb-1.5">{mode.label}</div>
                  <div className="text-[12.5px] text-slate-500 mb-3 leading-relaxed">{mode.desc}</div>
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
          <motion.div variants={itemVariants}>
            <SectionTitle>Daily Challenge</SectionTitle>
            <Card className="animated-border bg-transparent border-transparent">
              <div className="flex items-center gap-2 mb-3">
                <Badge color="purple">Today</Badge>
                <Badge color="amber">Medium</Badge>
              </div>
              <div className="font-heading font-bold mb-1">Design a Distributed Cache</div>
              <div className="text-[12.5px] text-slate-500 mb-3">System Design · 30 min · 150 XP</div>
              <Button size="sm" className="w-full" onClick={() => startInterview('system-design')}>
                Start Challenge →
              </Button>
            </Card>
          </motion.div>

          {/* Recent interviews */}
          <motion.div variants={itemVariants}>
            <SectionTitle>Recent Sessions</SectionTitle>
            <Card className="!p-4 space-y-3 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300">
              {[
                { type: 'System Design', topic: 'API Gateway', score: 88, color: 'amber' },
                { type: 'DSA Round', topic: 'Binary Trees', score: 76, color: 'green' },
                { type: 'HR Interview', topic: 'Leadership', score: 91, color: 'blue' },
              ].map(({ type, topic, score, color }) => (
                <div key={topic} className="flex items-center gap-3">
                  <Badge color={color} className="flex-shrink-0">{type}</Badge>
                  <span className="flex-1 text-[13px] text-slate-700 truncate">{topic}</span>
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
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
