import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, RefreshCw, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { interviewApi } from '../api/interview.api';
import { Card, Badge, ProgressBar, SectionTitle, Skeleton } from '../components/ui/index.jsx';
import Button from '../components/ui/Button';
import ScoreRing from '../components/ui/ScoreRing';

const Feedback = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interviewApi.getById(id)
      .then(setInterview)
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      {[1,2,3].map(i => <Skeleton key={i} className="h-32" />)}
    </div>
  );

  const fb = interview?.feedback;
  const scores = fb?.scores || {};

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎯</span>
          <div>
            <h1 className="font-heading text-xl font-bold">Interview Complete!</h1>
            <p className="text-white/40 text-sm">Here's your AI-generated feedback</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" icon={<Download size={13} />}>Export PDF</Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/interview')}>
            <RefreshCw size={13} /> Retry
          </Button>
        </div>
      </div>

      {/* Score rings */}
      <Card className="mb-4">
        <div className="flex flex-wrap items-center justify-around gap-4 py-2">
          <ScoreRing score={scores.overall || 0} label="Overall" size={110} color="#7c6dfa" />
          <ScoreRing score={scores.technical || 0} label="Technical" size={100} color="#4da6ff" />
          <ScoreRing score={scores.communication || 0} label="Communication" size={100} color="#22c984" />
          <ScoreRing score={scores.confidence || 0} label="Confidence" size={100} color="#f5a623" />
        </div>
      </Card>

      {/* Detailed scores */}
      <Card className="mb-4">
        <SectionTitle>Score Breakdown</SectionTitle>
        <div className="space-y-3">
          {[
            ['Clarity', scores.clarity],
            ['Depth', scores.depth],
            ['Technical Accuracy', scores.technical],
            ['Communication', scores.communication],
            ['Confidence', scores.confidence],
            ['Overall', scores.overall],
          ].map(([label, val = 0]) => (
            <div key={label}>
              <div className="flex justify-between text-[13px] mb-1">
                <span className="text-white/60">{label}</span>
                <span className="font-semibold text-accent">{val}%</span>
              </div>
              <ProgressBar value={val} />
            </div>
          ))}
        </div>
      </Card>

      {/* Strengths + Weaknesses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Card>
          <SectionTitle>Strengths ✅</SectionTitle>
          <div className="space-y-2">
            {(fb?.strengths || ['Good participation', 'Showed effort']).map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-[13.5px]">
                <CheckCircle2 size={14} className="text-success flex-shrink-0 mt-0.5" />
                <span className="text-white/70">{s}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionTitle>Areas to Improve ⚡</SectionTitle>
          <div className="space-y-2">
            {(fb?.weaknesses || ['Keep practicing!']).map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-[13.5px]">
                <AlertCircle size={14} className="text-warning flex-shrink-0 mt-0.5" />
                <span className="text-white/70">{w}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Improvement Roadmap */}
      {fb?.roadmap?.length > 0 && (
        <Card className="mb-4">
          <SectionTitle>AI Improvement Roadmap 🗺️</SectionTitle>
          <div className="space-y-3">
            {fb.roadmap.map(({ period, title, description }, i) => (
              <div key={i} className="flex gap-3 py-2 border-b border-border last:border-0">
                <Badge color="purple" className="flex-shrink-0 mt-0.5">{period}</Badge>
                <div>
                  <div className="font-medium text-[13.5px] mb-0.5">{title}</div>
                  <div className="text-[12.5px] text-white/50">{description}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Summary */}
      {fb?.summary && (
        <Card className="mb-6 border-accent/30">
          <SectionTitle>Overall Assessment</SectionTitle>
          <p className="text-[13.5px] text-white/70 leading-relaxed">{fb.summary}</p>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="flex-1" onClick={() => navigate('/interview')}>
          🔄 Practice Again
        </Button>
        <Button variant="ghost" className="flex-1" icon={<ArrowLeft size={14} />} onClick={() => navigate('/dashboard')}>
          Dashboard
        </Button>
      </div>
    </motion.div>
  );
};

export default Feedback;
