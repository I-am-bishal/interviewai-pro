import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, Zap } from 'lucide-react';
import { Card, Badge, SectionTitle } from '../components/ui/index.jsx';

const MODES = [
  {
    id: 'hr', emoji: '👤', label: 'HR Interview',
    desc: 'Culture fit, motivation, career goals, and soft-skill assessment.',
    tags: ['Communication', 'Values', 'Leadership'],
    color: 'blue', duration: '30-45 min', difficulty: 'Medium',
  },
  {
    id: 'dsa', emoji: '🧮', label: 'DSA Round',
    desc: 'Algorithm design, data structures, complexity and problem-solving.',
    tags: ['Arrays', 'Trees', 'Dynamic Programming', 'Graphs'],
    color: 'green', duration: '45-60 min', difficulty: 'Hard',
  },
  {
    id: 'system-design', emoji: '🏗️', label: 'System Design',
    desc: 'Design scalable distributed systems and discuss architecture trade-offs.',
    tags: ['Scalability', 'Databases', 'APIs', 'Caching'],
    color: 'amber', duration: '45-60 min', difficulty: 'Hard',
  },
  {
    id: 'behavioral', emoji: '💬', label: 'Behavioral (STAR)',
    desc: 'Competency-based questions using the Situation-Task-Action-Result framework.',
    tags: ['Teamwork', 'Conflict', 'Leadership', 'Initiative'],
    color: 'pink', duration: '25-35 min', difficulty: 'Medium',
  },
];

const InterviewSelect = () => {
  const navigate = useNavigate();

  const start = (mode) =>
    navigate('/interview/room', { state: { mode } });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-2xl mx-auto"
    >
      <div className="mb-7">
        <h1 className="font-heading text-2xl font-bold mb-1">Choose Interview Mode</h1>
        <p className="text-slate-400 text-sm">
          Select a category and our AI will generate tailored questions for your session.
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {MODES.map((mode, i) => (
          <motion.div
            key={mode.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Card
              hover
              onClick={() => start(mode.id)}
              className="!p-5 group"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl flex-shrink-0">{mode.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-bold text-[15px] mb-1">{mode.label}</div>
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
      <SectionTitle>Also Available</SectionTitle>
      <Card
        hover
        onClick={() => navigate('/coding')}
        className="!p-5 group border-accent/20"
      >
        <div className="flex items-center gap-4">
          <div className="text-4xl">💻</div>
          <div className="flex-1">
            <div className="font-heading font-bold text-[15px] mb-1">Live Coding Challenge</div>
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
  );
};

export default InterviewSelect;
