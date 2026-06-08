import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, Zap } from 'lucide-react';
import { Card, Badge, SectionTitle } from '../components/ui/index.jsx';
import { useAuthStore } from '../store/authStore';

const MODES = [
  {
    id: 'hr', emoji: '👤', label: 'HR Interview',
    desc: 'Culture fit, motivation, career goals, and soft-skill assessment.',
    tags: ['Communication', 'Values', 'Leadership'],
    color: 'blue', duration: '30-45 min', difficulty: 'Medium',
    gradient: 'from-blue-500/10 to-cyan-500/5',
  },
  {
    id: 'dsa', emoji: '🧮', label: 'DSA Round',
    desc: 'Algorithm design, data structures, complexity and problem-solving.',
    tags: ['Arrays', 'Trees', 'Dynamic Programming', 'Graphs'],
    color: 'green', duration: '45-60 min', difficulty: 'Hard',
    gradient: 'from-emerald-500/10 to-teal-500/5',
  },
  {
    id: 'system-design', emoji: '🏗️', label: 'System Design',
    desc: 'Design scalable distributed systems and discuss architecture trade-offs.',
    tags: ['Scalability', 'Databases', 'APIs', 'Caching'],
    color: 'amber', duration: '45-60 min', difficulty: 'Hard',
    gradient: 'from-amber-500/10 to-orange-500/5',
  },
  {
    id: 'behavioral', emoji: '💬', label: 'Behavioral (STAR)',
    desc: 'Competency-based questions using the Situation-Task-Action-Result framework.',
    tags: ['Teamwork', 'Conflict', 'Leadership', 'Initiative'],
    color: 'pink', duration: '25-35 min', difficulty: 'Medium',
    gradient: 'from-cyan-500/10 to-blue-500/5',
  },
];

const LEVELS = [
  { id: 'entry', label: 'Beginner / Entry', emoji: '🌱', desc: '0-2 years. Core concepts & structures.' },
  { id: 'mid', label: 'Intermediate / Mid', emoji: '⚡', desc: '2-5 years. Practical algorithms & applications.' },
  { id: 'senior', label: 'Advanced / Senior', emoji: '🧠', desc: '5+ years. System complexity & trade-offs.' },
  { id: 'lead', label: 'Expert / Lead', emoji: '👑', desc: 'Leads & Architects. Distributed systems & concurrency.' }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 24 } }
};

const InterviewSelect = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [selectedLevel, setSelectedLevel] = useState(user?.experienceLevel || 'mid');

  const start = (mode) =>
    navigate('/interview/room', { state: { mode, level: selectedLevel } });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6 max-w-2xl mx-auto relative min-h-full overflow-hidden"
    >
      {/* Ambient orbs */}
      <div className="ambient-orb ambient-orb-1 absolute -top-48 left-1/4" />
      <div className="ambient-orb ambient-orb-2 absolute bottom-10 -right-20" />

      <motion.div variants={itemVariants} className="mb-7 relative z-10">
        <h1 className="font-heading text-2xl font-extrabold mb-1 tracking-tight">Choose Interview Mode</h1>
        <p className="text-slate-500 text-sm">
          Select a category and our AI will generate tailored questions for your session.
        </p>
      </motion.div>

      {/* Experience Level Selector */}
      <motion.div variants={itemVariants} className="mb-8 relative z-10">
        <SectionTitle>Select Target Difficulty</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
          {LEVELS.map((lvl) => {
            const isSelected = selectedLevel === lvl.id;
            return (
              <motion.div
                key={lvl.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedLevel(lvl.id)}
                className={`relative p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer select-none overflow-hidden ${
                  isSelected
                    ? 'border-accent/30 shadow-glow-sm'
                    : 'bg-bg-2/60 backdrop-blur-xl border-border/40 hover:border-accent/15 hover:bg-bg-2/80'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeDifficulty"
                    className="absolute inset-0 -z-10"
                    style={{
                      background: 'linear-gradient(135deg, rgba(124, 91, 240, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%)',
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
                {isSelected && (
                  <div className="absolute top-0 right-0 w-8 h-8 rounded-bl-3xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(124, 91, 240, 0.2), rgba(59, 130, 246, 0.15))' }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  </div>
                )}
                <div className="flex flex-col h-full justify-between relative z-10">
                  <div>
                    <span className="text-xl mb-1.5 block">{lvl.emoji}</span>
                    <h3 className={`font-bold text-[12.5px] ${isSelected ? 'text-accent' : 'text-slate-700'}`}>
                      {lvl.label}
                    </h3>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-normal">
                    {lvl.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <div className="space-y-3 mb-6 relative z-10">
        {MODES.map((mode) => (
          <motion.div key={mode.id} variants={itemVariants}>
            <Card hover onClick={() => start(mode.id)} className="!p-5 group transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mode.gradient} border border-border/30 flex items-center justify-center text-2xl flex-shrink-0`}>
                  {mode.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-bold text-[15px] mb-1 tracking-tight">{mode.label}</div>
                  <div className="text-[13px] text-slate-500 mb-2.5 leading-relaxed">{mode.desc}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {mode.tags.map((t) => (
                      <Badge key={t} color={mode.color}>{t}</Badge>
                    ))}
                    <Badge color="gray">
                      <Clock size={10} className="mr-1" />
                      {mode.duration}
                    </Badge>
                    <Badge color={mode.difficulty === 'Hard' ? 'pink' : 'amber'}>
                      {mode.difficulty}
                    </Badge>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="text-slate-300 group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0"
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Coding Round shortcut */}
      <motion.div variants={itemVariants} className="relative z-10">
        <SectionTitle>Also Available</SectionTitle>
        <Card hover onClick={() => navigate('/coding')} className="!p-5 group border-accent/10 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/10 to-blue-500/5 border border-border/30 flex items-center justify-center text-2xl flex-shrink-0">
              💻
            </div>
            <div className="flex-1">
              <div className="font-heading font-bold text-[15px] mb-1 tracking-tight">Live Coding Challenge</div>
              <div className="text-[13px] text-slate-500 mb-2">
                Solve real DSA problems in our code editor with AI evaluation and hidden test cases.
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <Badge color="purple"><Zap size={10} className="mr-1" />Monaco Editor</Badge>
                <Badge color="gray">Multi-Language</Badge>
                <Badge color="gray">AI Evaluation</Badge>
                <Badge color="gray">Test Cases</Badge>
              </div>
            </div>
            <ChevronRight
              size={18}
              className="text-slate-300 group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0"
            />
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default InterviewSelect;
