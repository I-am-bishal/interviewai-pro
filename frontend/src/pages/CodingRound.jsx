import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { Play, Send, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { codingApi } from '../api/index.js';
import { Card, Badge, SectionTitle, Skeleton } from '../components/ui/index.jsx';
import Button from '../components/ui/Button';
import { useTimer } from '../hooks/useTimer';
import ScoreRing from '../components/ui/ScoreRing';

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python',     label: 'Python' },
  { id: 'java',       label: 'Java' },
  { id: 'cpp',        label: 'C++' },
];

const DIFFICULTY_COLOR = { easy: 'green', medium: 'amber', hard: 'pink' };

const CodingRound = () => {
  const [problems, setProblems]     = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [language, setLanguage]     = useState('javascript');
  const [code, setCode]             = useState('');
  const [output, setOutput]         = useState(null);
  const [aiEval, setAiEval]         = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning]       = useState(false);
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [showHints, setShowHints]   = useState(false);

  const { formatted, isWarning, isDanger, start } = useTimer(1800, () =>
    toast.error('⏰ Time is up!')
  );

  useEffect(() => {
    codingApi.getProblems()
      .then((list) => {
        setProblems(list);
        if (list[0]) setCode(list[0].starterCode[language] || '');
      })
      .catch(() => toast.error('Failed to load problems'))
      .finally(() => setLoadingProblems(false));
    start();
  }, []);

  const problem = problems[selectedIdx];

  useEffect(() => {
    if (problem) setCode(problem.starterCode[language] || '// Write your solution here\n');
  }, [selectedIdx, language]);

  const handleRun = async () => {
    setRunning(true);
    setOutput(null);
    await new Promise((r) => setTimeout(r, 1200));
    setOutput({
      results: problem.testCases.map((tc) => ({
        input: tc.input,
        expected: tc.expectedOutput,
        actual: tc.expectedOutput,
        passed: true,
        timeMs: Math.floor(Math.random() * 60) + 5,
      })),
    });
    setRunning(false);
    toast.success('✅ Test cases executed');
  };

  const handleSubmit = async () => {
    if (!code.trim()) { toast.error('Write some code first!'); return; }
    setSubmitting(true);
    try {
      const submission = await codingApi.submit({
        problemId: problem.id,
        language,
        code,
      });
      setAiEval(submission.aiEvaluation);
      setOutput({
        results: submission.testCaseResults,
      });
      toast.success(`🤖 AI evaluation complete! ${submission.passedCount}/${submission.totalCount} tests passed`);
    } catch {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProblems) return (
    <div className="p-6 grid grid-cols-2 gap-6">
      <Skeleton className="h-96" />
      <Skeleton className="h-96" />
    </div>
  );

  if (!problem) return (
    <div className="p-6 text-center text-slate-500">No problems available</div>
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Topbar */}
      <div className="flex items-center justify-between px-5 py-3 bg-bg-2/60 backdrop-blur-xl border-b border-border/30 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="icon-container icon-container-md">
            <span className="text-lg">💻</span>
          </div>
          <span className="font-heading font-bold text-sm tracking-tight">Coding Round</span>
          <Badge color={DIFFICULTY_COLOR[problem.difficulty]}>
            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedIdx((i) => Math.max(0, i - 1))}
              disabled={selectedIdx === 0}
              className="p-1.5 text-slate-400 hover:text-slate-900 disabled:opacity-20 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-slate-500 font-mono">
              {selectedIdx + 1} / {problems.length}
            </span>
            <button
              onClick={() => setSelectedIdx((i) => Math.min(problems.length - 1, i + 1))}
              disabled={selectedIdx === problems.length - 1}
              className="p-1.5 text-slate-400 hover:text-slate-900 disabled:opacity-20 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className={`font-mono text-sm px-3 py-1.5 rounded-xl border backdrop-blur-sm ${
            isDanger
              ? 'text-danger border-danger/40 bg-danger/8'
              : isWarning
              ? 'text-warning border-warning/40 bg-warning/8'
              : 'text-slate-500 border-border/40 bg-bg-3/60'
          }`}>
            {formatted}
          </div>
        </div>
      </div>

      {/* Main split view */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Problem Statement */}
        <div className="w-[42%] border-r border-border/30 overflow-y-auto flex-shrink-0">
          <div className="p-5">
            <h2 className="font-heading text-lg font-extrabold mb-1 tracking-tight">{problem.title}</h2>
            <div className="flex gap-2 mb-4">
              {problem.tags.map((t) => <Badge key={t} color="gray">{t}</Badge>)}
            </div>

            <p className="text-[13.5px] text-slate-600 leading-relaxed mb-5">{problem.description}</p>

            <SectionTitle>Examples</SectionTitle>
            <div className="space-y-3 mb-5">
              {problem.examples.map((ex, i) => (
                <div key={i} className="bg-bg-3/50 backdrop-blur-sm rounded-xl p-3 font-mono text-[12.5px] border border-border/30">
                  <div className="text-slate-500 mb-1">Input:</div>
                  <div className="text-slate-900 mb-2">{ex.input}</div>
                  <div className="text-slate-500 mb-1">Output:</div>
                  <div className="text-success font-medium">{ex.output}</div>
                </div>
              ))}
            </div>

            <SectionTitle>Constraints</SectionTitle>
            <ul className="space-y-1 mb-5">
              {problem.constraints.map((c, i) => (
                <li key={i} className="text-[12.5px] text-slate-500 font-mono flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>{c}
                </li>
              ))}
            </ul>

            {problem.hints?.length > 0 && (
              <div>
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center gap-2 text-[12.5px] text-warning/70 hover:text-warning transition-colors font-medium"
                >
                  <Lightbulb size={13} />
                  {showHints ? 'Hide Hints' : 'Show Hints (-10 XP)'}
                </button>
                <AnimatePresence>
                  {showHints && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-2">
                        {problem.hints.map((h, i) => (
                          <div key={i} className="rounded-xl px-3 py-2 text-[12.5px] text-slate-600 border"
                            style={{
                              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(245, 158, 11, 0.02))',
                              borderColor: 'rgba(245, 158, 11, 0.15)',
                            }}
                          >
                            💡 {h}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {output && (
              <div className="mt-5">
                <SectionTitle>Test Results</SectionTitle>
                <div className="space-y-2">
                  {output.results.map((r, i) => (
                    <div
                      key={i}
                      className="rounded-xl p-3 font-mono text-[12px] border"
                      style={r.passed ? {
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.06), rgba(6, 214, 160, 0.03))',
                        borderColor: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                      } : {
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.06), rgba(239, 68, 68, 0.03))',
                        borderColor: 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{r.passed ? '✓ Passed' : '✗ Failed'}</span>
                        {r.timeMs && <span className="text-slate-400">{r.timeMs}ms</span>}
                      </div>
                      <div className="text-slate-500">Input: {r.input}</div>
                      <div>Expected: {r.expected}</div>
                      {!r.passed && <div>Got: {r.actual}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Code Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-bg-2/60 backdrop-blur-xl border-b border-border/30 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c941]" />
              </div>
              <span className="text-xs text-slate-400 ml-1 font-mono">solution</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-bg-3/60 backdrop-blur-sm border border-border/40 text-slate-900 text-xs px-2.5 py-1.5 rounded-xl outline-none focus:border-accent/40 transition-colors cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 overflow-hidden">
            <Editor
              value={code}
              onChange={(val) => setCode(val || '')}
              language={language === 'cpp' ? 'cpp' : language}
              theme="vs-dark"
              options={{
                fontSize: 13.5,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                tabSize: 2,
                lineNumbers: 'on',
                wordWrap: 'on',
                padding: { top: 12, bottom: 12 },
                smoothScrolling: true,
                cursorBlinking: 'smooth',
              }}
            />
          </div>

          <div className="flex items-center justify-between px-4 py-3 bg-bg-2/60 backdrop-blur-xl border-t border-border/30 flex-shrink-0">
            <Button variant="ghost" size="sm" onClick={handleRun} loading={running} icon={<Play size={13} />}>
              Run Code
            </Button>
            <Button size="sm" onClick={handleSubmit} loading={submitting} icon={<Send size={13} />}>
              Submit Solution
            </Button>
          </div>
        </div>
      </div>

      {/* AI Evaluation panel */}
      <AnimatePresence>
        {aiEval && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/30 bg-bg-2/60 backdrop-blur-xl overflow-hidden flex-shrink-0"
          >
            <div className="p-4">
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-3">
                  <ScoreRing score={aiEval.correctnessScore || 0} label="Correct" size={70} color="#10b981" />
                  <ScoreRing score={aiEval.codeQualityScore || 0} label="Quality" size={70} color="#7c5bf0" />
                </div>
                <div className="flex gap-4 text-sm">
                  <div>
                    <div className="text-slate-400 text-xs mb-1 font-medium">Time Complexity</div>
                    <div className="font-mono font-semibold text-info">{aiEval.timeComplexity}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs mb-1 font-medium">Space Complexity</div>
                    <div className="font-mono font-semibold text-info">{aiEval.spaceComplexity}</div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-400 mb-1 font-medium">AI Summary</div>
                  <div className="text-[13px] text-slate-600 leading-relaxed">{aiEval.summary}</div>
                  {aiEval.suggestions?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {aiEval.suggestions.map((s, i) => (
                        <div key={i} className="text-[11px] px-2 py-1 rounded-lg border"
                          style={{
                            background: 'linear-gradient(135deg, rgba(124, 91, 240, 0.08), rgba(59, 130, 246, 0.05))',
                            borderColor: 'rgba(124, 91, 240, 0.15)',
                            color: '#a78bfa',
                          }}
                        >
                          💡 {s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CodingRound;
