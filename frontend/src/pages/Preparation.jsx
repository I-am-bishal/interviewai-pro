import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, BookOpen, Layers, Award, Sparkles, 
  ChevronDown, BookOpenCheck, Bookmark, ArrowRight, Check, Play 
} from 'lucide-react';
import { Card, Badge, ProgressBar, SectionTitle } from '../components/ui/index.jsx';
import Button from '../components/ui/Button';

/* ─── Prep Data ──────────────────────────────────────────────────────────── */
const SECTIONS = [
  { id: 'hr', label: 'Behavioral & HR', emoji: '👤', color: 'blue' },
  { id: 'dsa', label: 'DSA Patterns', emoji: '🧮', color: 'green' },
  { id: 'system-design', label: 'System Design', emoji: '🏗️', color: 'amber' },
];

const CHECKLISTS = {
  hr: [
    { id: 'hr-1', label: 'Draft a 1-minute elevator pitch self-introduction' },
    { id: 'hr-2', label: 'Prepare 3 stories highlighting leadership, problem-solving, and adaptability' },
    { id: 'hr-3', label: 'Research the target company\'s core values, mission, and culture' },
    { id: 'hr-4', label: 'Formulate 3 thoughtful questions to ask the interviewer' },
    { id: 'hr-5', label: 'Review the STAR method framework (Situation, Task, Action, Result)' },
  ],
  dsa: [
    { id: 'dsa-1', label: 'Practice 5 easy/medium arrays and string questions' },
    { id: 'dsa-2', label: 'Memorize time & space complexities for standard algorithms' },
    { id: 'dsa-3', label: 'Solve 3 questions on Sliding Window & Two Pointer patterns' },
    { id: 'dsa-4', label: 'Practice DFS and BFS traversals on binary trees' },
    { id: 'dsa-5', label: 'Review basic recursion and dynamic programming structures' },
  ],
  'system-design': [
    { id: 'sd-1', label: 'Study high-level components (API Gateway, Load Balancer, CDN)' },
    { id: 'sd-2', label: 'Practice estimating system capacity (DAU, bandwidth, storage)' },
    { id: 'sd-3', label: 'Review caching strategies and cache eviction policies' },
    { id: 'sd-4', label: 'Understand horizontal vs vertical scaling and DB sharding' },
    { id: 'sd-5', label: 'Sketch high-level design for a URL Shortener or News Feed' },
  ]
};

const CHEAT_SHEETS = {
  hr: [
    {
      id: 'hr-sheet-1',
      title: 'The STAR Method Story Template',
      desc: 'How to structure answers to behavioral questions step-by-step.',
      summary: 'Used to answer competency questions like "Tell me about a time when..."',
      details: `• **Situation (15%)**: Set the scene. Give brief context of the challenge/project.
• **Task (15%)**: Explain your specific responsibility in that situation.
• **Action (50%)**: Detail what YOU did. Focus on your actions, technical details, and choices.
• **Result (20%)**: Describe the outcome. Use quantitative metrics if possible (e.g. "reduced latency by 30%", "delivered 2 weeks early").

*Tip: Write down stories beforehand covering leadership, failure, conflict, and innovation.*`
    },
    {
      id: 'hr-sheet-2',
      title: '1-Minute Self Intro Structure',
      desc: 'The Present-Past-Future model for elevator pitches.',
      summary: 'Answer "Tell me about yourself" professionally and concisely.',
      details: `1. **Present (30s)**: "Currently, I\'m a [Role] at [Company], where I focus on [1-2 key technical responsibilities or achievements]..."
2. **Past (20s)**: "Before this, I developed my skills by [mention 1 past relevant job, project, or degree with major impact]..."
3. **Future (10s)**: "Moving forward, I\'m looking to bring my expertise in [Skill] to a team like yours, because I\'m excited about [Company\'s project/values]..."`
    }
  ],
  dsa: [
    {
      id: 'dsa-sheet-1',
      title: 'Sliding Window Pattern',
      desc: 'Optimal for sub-array or substring problems.',
      summary: 'Reduces O(N²) nested loops to efficient O(N) single pass solutions.',
      details: `**When to use**: Input is linear (array/string) and you need to find a subarray that satisfies a condition (longest, shortest, target sum).

**Template Code (JS)**:
\`\`\`javascript
function slidingWindow(arr, target) {
  let start = 0, currentSum = 0, maxLen = 0;
  for (let end = 0; end < arr.length; end++) {
    currentSum += arr[end]; // expand window
    
    while (currentSum > target) { // shrink window
      currentSum -= arr[start];
      start++;
    }
    maxLen = Math.max(maxLen, end - start + 1);
  }
  return maxLen;
}
\`\`\``
    },
    {
      id: 'dsa-sheet-2',
      title: 'Two Pointers Pattern',
      desc: 'Saves memory and time for sorted arrays.',
      summary: 'Solves search and matching problems in O(N) time & O(1) space.',
      details: `**When to use**: The array is sorted, and you need to find two elements that satisfy a condition (e.g. summing to a target value).

**Template Code (JS)**:
\`\`\`javascript
function twoPointers(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    else if (sum < target) left++;
    else right--;
  }
  return [];
}
\`\`\``
    }
  ],
  'system-design': [
    {
      id: 'sd-sheet-1',
      title: 'Load Balancing & Scaling',
      desc: 'Distributing traffic smoothly to prevent bottlenecking.',
      summary: 'Architecting high availability systems using Nginx or HAProxy.',
      details: `**Core Scaling Models**:
• **Vertical Scaling (Scale Up)**: Adding CPU/RAM to a single server. Simple but has physical limits and single point of failure (SPOF).
• **Horizontal Scaling (Scale Out)**: Adding more servers. Highly resilient, requires a Load Balancer (LB) to route requests.

**Load Balancer Algorithms**:
1. **Round Robin**: Routes requests sequentially.
2. **Least Connections**: Routes to the server with fewest active sessions. Ideal for long-lived connections.
3. **IP Hash**: Deterministically routes based on client IP. Ensures session persistence.`
    },
    {
      id: 'sd-sheet-2',
      title: 'Caching Strategies',
      desc: 'Reducing database latency using Redis or Memcached.',
      summary: 'Core patterns to read and write cache data efficiently.',
      details: `**1. Cache-Aside (Lazy Loading)**:
- App checks cache. If miss, queries database, writes to cache, and returns.
- *Pros*: Memory efficient (only caches requested data).
- *Cons*: Cache miss penalty on first request.

**2. Write-Through**:
- App writes to cache, cache writes to DB immediately.
- *Pros*: Data in cache is never stale.
- *Cons*: High write latency since both database and cache must complete.`
    }
  ]
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } }
};

const Preparation = () => {
  const [activeTab, setActiveTab] = useState('hr');
  const [expandedSheet, setExpandedSheet] = useState(null);
  const [checkedItems, setCheckedItems] = useState(() => {
    const stored = localStorage.getItem('prep_checklist');
    return stored ? JSON.parse(stored) : {};
  });

  // Save checklist state to localStorage
  const handleCheck = (id) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem('prep_checklist', JSON.stringify(next));
      return next;
    });
  };

  // Calculate progress for the active tab
  const activeChecklist = CHECKLISTS[activeTab] || [];
  const checkedInActiveTab = activeChecklist.filter(item => checkedItems[item.id]).length;
  const progressPercent = activeChecklist.length > 0 
    ? Math.round((checkedInActiveTab / activeChecklist.length) * 100) 
    : 0;

  const currentTabMeta = SECTIONS.find(s => s.id === activeTab) || SECTIONS[0];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6 max-w-5xl mx-auto relative min-h-full dot-grid overflow-hidden"
    >
      {/* Background Ambient Glow Lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/8 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2 -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <motion.div variants={itemVariants} className="mb-7 relative z-10">
        <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
          Interview Preparation Hub <Sparkles size={20} className="text-accent animate-pulse" />
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Master core technical patterns, structural behavioral templates, and track your prep checklists.
        </p>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div variants={itemVariants} className="flex gap-2.5 mb-7 bg-bg-2 border border-border p-1.5 rounded-2xl relative z-10 w-fit">
        {SECTIONS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setExpandedSheet(null);
              }}
              className={`relative px-4 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all flex items-center gap-2 cursor-pointer outline-none ${
                isActive ? 'text-accent-2' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activePrepTab"
                  className="absolute inset-0 bg-accent/15 rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 items-start">
        {/* Left Column: Progress Card & Checklist */}
        <motion.div variants={itemVariants} className="lg:col-span-5 space-y-4">
          <Card className="!p-5 hover:shadow-xl hover:shadow-accent/5 transition-all duration-350">
            <div className="flex items-center justify-between mb-3">
              <SectionTitle className="!mb-0">Progress Tracker</SectionTitle>
              <Badge color={currentTabMeta.color}>{progressPercent}% Done</Badge>
            </div>
            <div className="flex items-center gap-3">
              <ProgressBar value={progressPercent} className="flex-1 h-2" />
              <span className="font-heading font-extrabold text-[15px] text-accent">
                {checkedInActiveTab}/{activeChecklist.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Complete your {currentTabMeta.label} tasks before mock practice.
            </p>
          </Card>

          <Card className="!p-5 hover:shadow-xl hover:shadow-accent/5 transition-all duration-350">
            <SectionTitle>Preparation Checklist</SectionTitle>
            <div className="space-y-3 mt-4">
              {activeChecklist.map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => handleCheck(item.id)}
                    className="flex items-start gap-3 cursor-pointer group select-none"
                  >
                    <div className={`mt-0.5 w-4.5 h-4.5 rounded border flex items-center justify-center transition-all ${
                      isChecked 
                        ? 'bg-accent border-accent text-white' 
                        : 'border-border group-hover:border-slate-400 bg-bg-3'
                    }`}>
                      {isChecked && <Check size={11} strokeWidth={3} />}
                    </div>
                    <span className={`text-[12.5px] leading-relaxed transition-colors ${
                      isChecked ? 'text-slate-400 line-through' : 'text-slate-700'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Right Column: Cheat Sheets / Expandable Cards */}
        <motion.div variants={itemVariants} className="lg:col-span-7 space-y-4">
          <SectionTitle>Interactive Cheat Sheets</SectionTitle>
          <div className="space-y-3">
            {CHEAT_SHEETS[activeTab]?.map((sheet) => {
              const isExpanded = expandedSheet === sheet.id;
              return (
                <motion.div
                  key={sheet.id}
                  layout="position"
                  onClick={() => setExpandedSheet(isExpanded ? null : sheet.id)}
                  className={`bg-bg-2 border rounded-2xl cursor-pointer select-none transition-all duration-300 overflow-hidden ${
                    isExpanded 
                      ? 'border-accent/40 shadow-xl shadow-accent/5 p-6' 
                      : 'border-border hover:border-slate-400 hover:bg-bg-3/40 p-5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mt-0.5 flex-shrink-0">
                        <BookOpenCheck size={16} />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-[14.5px] text-slate-800">
                          {sheet.title}
                        </h3>
                        <p className="text-[12px] text-slate-400 mt-0.5">
                          {sheet.desc}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-slate-400"
                    >
                      <ChevronDown size={16} />
                    </motion.div>
                  </div>

                  {!isExpanded && (
                    <div className="mt-3 text-[12px] text-slate-500 bg-bg-3/50 px-3 py-2 rounded-lg border border-border/50">
                      {sheet.summary}
                    </div>
                  )}

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="mt-5 border-t border-border pt-4 text-[13px] text-slate-650 leading-relaxed font-normal"
                        onClick={(e) => e.stopPropagation()} // stop toggle on clicking detail text
                      >
                        <div className="whitespace-pre-wrap font-sans text-slate-700 bg-bg-3/60 p-4 rounded-xl border border-border/80 shadow-inner">
                          {sheet.details.includes('```') ? (
                            // Render code chunks cleanly
                            sheet.details.split('```').map((chunk, index) => {
                              if (index % 2 === 1) {
                                // Code block chunk
                                const lines = chunk.replace('javascript', '').trim();
                                return (
                                  <pre key={index} className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-indigo-300 border border-zinc-800/80 overflow-x-auto my-3.5 shadow-md">
                                    {lines}
                                  </pre>
                                );
                              }
                              return <span key={index}>{chunk}</span>;
                            })
                          ) : (
                            sheet.details
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Preparation;
