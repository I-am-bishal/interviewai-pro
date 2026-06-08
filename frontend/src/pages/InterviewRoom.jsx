import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, ChevronRight, Lightbulb, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useInterviewStore } from '../store/interviewStore';
import { useVoice } from '../hooks/useVoice';
import { useTypewriter } from '../hooks/useTypewriter';
import { useTimer } from '../hooks/useTimer';
import LoadingSpinner, { Card, Badge, ProgressBar, SectionTitle } from '../components/ui';
import Button from '../components/ui/Button';
import VoiceVisualizer from '../components/ui/VoiceVisualizer';

const MODE_META = {
  hr:            { label: 'HR Interview', color: 'blue',  emoji: '👤' },
  dsa:           { label: 'DSA Round',    color: 'green', emoji: '🧮' },
  'system-design': { label: 'System Design', color: 'amber', emoji: '🏗️' },
  behavioral:    { label: 'Behavioral',   color: 'pink',  emoji: '💬' },
};

const InterviewRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, level } = location.state || { mode: 'hr', level: 'mid' };
  const meta = MODE_META[mode] || MODE_META.hr;

  const { currentInterview, currentQuestionIndex, isLoading, isAiTyping, startSession, submitAnswer, completeSession, setTranscript } = useInterviewStore();
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const textareaRef = useRef(null);

  const { formatted: elapsed } = useTimer(0);

  const { isRecording, transcript, startListening, stopListening, speak, isSupported } = useVoice({
    onTranscript: (text) => {
      setUserAnswer(text);
      setTranscript(text);
    },
  });

  useEffect(() => {
    if (!currentInterview) {
      startSession(mode, null, level).catch(() => {
        toast.error('Failed to start interview');
        navigate('/interview');
      });
    }
  }, []);

  const questions = currentInterview?.questions || [];
  const currentQ = questions[currentQuestionIndex] || '';
  const totalQ = questions.length;
  const progress = totalQ > 0 ? ((currentQuestionIndex) / totalQ) * 100 : 0;

  const { displayed: typedQuestion } = useTypewriter(currentQ, 28);

  useEffect(() => {
    if (currentQ && !isAiTyping) speak(currentQ);
  }, [currentQ]);

  const handleSubmit = async () => {
    if (!userAnswer.trim()) { toast.error('Please provide an answer'); return; }
    stopListening();

    if (currentQuestionIndex >= totalQ - 1) {
      try {
        const interview = await completeSession({ fillerWordCount: 0 });
        toast.success('Interview complete! Generating feedback...');
        navigate(`/interview/feedback/${interview._id}`);
      } catch {
        toast.error('Failed to complete interview');
      }
    } else {
      try {
        await submitAnswer(userAnswer);
        setUserAnswer('');
        setShowHint(false);
        if (textareaRef.current) textareaRef.current.focus();
      } catch {
        toast.error('Failed to submit answer');
      }
    }
  };

  const toggleMic = () => {
    if (isRecording) stopListening();
    else startListening();
  };

  if (isLoading || !currentInterview) {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-4">
        <LoadingSpinner />
        <p className="text-slate-500 text-sm font-medium">Starting your {meta.label}...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* ── Main Interview Area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/30 bg-bg-2/60 backdrop-blur-xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, rgba(124, 91, 240, 0.12), rgba(59, 130, 246, 0.08))' }}
            >
              {meta.emoji}
            </div>
            <div>
              <div className="font-heading font-bold text-sm tracking-tight">{meta.label}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs text-success font-medium">Live Session</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="font-mono text-sm text-slate-500 bg-bg-3/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border/40">
              {currentQuestionIndex + 1} / {totalQ}
            </div>
            <Button variant="danger" size="sm" onClick={() => { completeSession({}); navigate('/dashboard'); }}>
              <X size={13} /> End
            </Button>
          </div>
        </div>

        {/* Progress */}
        <ProgressBar value={progress} className="h-0.5 rounded-none" />

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          <div className="ambient-orb ambient-orb-1 absolute -top-40 left-1/3 !opacity-[0.05]" />

          {/* AI Avatar + Question */}
          <div className="flex items-start gap-4 mb-6 relative z-10">
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                style={{
                  background: 'linear-gradient(135deg, #7c5bf0, #3b82f6)',
                  boxShadow: '0 4px 20px -4px rgba(124, 91, 240, 0.35)',
                }}
              >
                🤖
              </div>
              {isAiTyping && (
                <div className="absolute inset-0 rounded-2xl border-2 border-accent animate-pulse-ring" />
              )}
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold mb-2 tracking-widest uppercase gradient-text-accent">
                Question {currentQuestionIndex + 1}
              </div>
              <div className="bg-bg-3/50 backdrop-blur-sm border border-border/30 rounded-2xl p-5">
                {isAiTyping ? (
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="text-sm">AI is thinking</span>
                    <span className="flex gap-1">
                      {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: `${i*0.1}s` }} />)}
                    </span>
                  </div>
                ) : (
                  <p className="text-[15px] leading-relaxed font-medium">
                    {typedQuestion}
                    {typedQuestion.length < currentQ.length && <span className="typing-cursor" />}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Hint */}
          <AnimatePresence>
            {showHint && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="mb-4 p-4 rounded-xl flex gap-3 border relative z-10"
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.06), rgba(245, 158, 11, 0.02))',
                  borderColor: 'rgba(245, 158, 11, 0.2)',
                }}
              >
                <Lightbulb size={16} className="text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-warning mb-1">AI Hint</div>
                  <div className="text-sm text-slate-600">
                    {mode === 'dsa' && 'Think about edge cases first. Consider the naive solution, then optimize using a hash map or two-pointer technique.'}
                    {mode === 'hr' && 'Use the STAR method: Situation → Task → Action → Result. Be specific with one real example.'}
                    {mode === 'system-design' && 'Start with requirements, then APIs, data model, then high-level components and trade-offs.'}
                    {mode === 'behavioral' && 'Pick ONE specific situation. Walk through what YOU personally did — avoid saying "we".'}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Answer Area */}
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-400 font-semibold tracking-wide">Your Answer</div>
              <div className="flex items-center gap-2">
                <VoiceVisualizer isRecording={isRecording} bars={8} />
                {isSupported && (
                  <button
                    onClick={toggleMic}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                      isRecording
                        ? 'border-accent/40 text-accent shadow-glow-sm'
                        : 'bg-bg-3/60 backdrop-blur-sm border-border/40 text-slate-500 hover:text-slate-900 hover:border-accent/20'
                    }`}
                    style={isRecording ? {
                      background: 'linear-gradient(135deg, rgba(124, 91, 240, 0.1), rgba(59, 130, 246, 0.06))',
                    } : undefined}
                  >
                    {isRecording ? <><Mic size={12} /> Recording</> : <><MicOff size={12} /> Voice</>}
                  </button>
                )}
              </div>
            </div>

            <textarea
              ref={textareaRef}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here, or click Voice to speak your response..."
              rows={6}
              className="w-full bg-bg-3/40 backdrop-blur-sm border border-border/40 rounded-2xl px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400/50 outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10 resize-none transition-all duration-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]"
            />

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowHint(!showHint)}
                  icon={<Lightbulb size={13} />}
                >Hint</Button>
                <Button variant="ghost" size="sm" onClick={() => speak(currentQ)}
                  icon={<Volume2 size={13} />}
                >Read Aloud</Button>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!userAnswer.trim()}
                loading={isAiTyping}
                iconRight={<ChevronRight size={15} />}
              >
                {currentQuestionIndex >= totalQ - 1 ? 'Finish Interview' : 'Next Question'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Side Panel ── */}
      <div className="hidden lg:flex flex-col w-72 bg-bg-2/60 backdrop-blur-2xl border-l border-border/30 overflow-y-auto flex-shrink-0 p-4 gap-5">
        <div>
          <SectionTitle>Session Stats</SectionTitle>
          <div className="space-y-2.5">
            {[
              ['Answered', `${currentQuestionIndex} / ${totalQ}`],
              ['Confidence', '78%'],
              ['Avg Response', '1m 24s'],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between text-[13px]">
                <span className="text-slate-500">{label}</span>
                <span className="font-semibold text-slate-800">{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionTitle>Confidence Metrics</SectionTitle>
          <div className="space-y-2.5">
            {[['Clarity', 82], ['Speaking Pace', 74], ['Confidence', 78], ['Depth', 65]].map(([label, val]) => (
              <div key={label}>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-slate-500">{label}</span>
                  <span className="text-slate-600 font-medium">{val}%</span>
                </div>
                <ProgressBar value={val} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionTitle>Live Transcript</SectionTitle>
          <div className="bg-bg-3/40 backdrop-blur-sm border border-border/30 rounded-xl p-3 min-h-[80px] text-[12.5px] text-slate-500 font-mono leading-relaxed">
            {transcript || <span className="text-slate-400/60">Voice transcript will appear here...</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;
