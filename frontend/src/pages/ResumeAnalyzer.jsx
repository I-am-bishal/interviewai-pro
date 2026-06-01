import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Trash2, ChevronRight, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { resumeApi } from '../api/index.js';
import { Card, Badge, ProgressBar, SectionTitle, Skeleton } from '../components/ui/index.jsx';
import Button from '../components/ui/Button';
import ScoreRing from '../components/ui/ScoreRing';

const SKILL_LEVEL_COLOR = { advanced: 'green', intermediate: 'amber', beginner: 'red' };

const ResumeAnalyzer = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [resume, setResume]         = useState(null);
  const [uploading, setUploading]   = useState(false);
  const [loading, setLoading]       = useState(true);
  const [dragOver, setDragOver]     = useState(false);
  const [activeTab, setActiveTab]   = useState('analysis');

  // Load existing resume on mount
  useEffect(() => {
    resumeApi.getLatest()
      .then((r) => setResume(r))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleFile = async (file) => {
    if (!file) return;
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      toast.error('Only PDF or DOCX files are accepted');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be under 5 MB');
      return;
    }

    setUploading(true);
    try {
      const result = await resumeApi.upload(file);
      setResume(result);
      toast.success('✅ Resume analysed by AI!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onFileInput = (e) => handleFile(e.target.files[0]);
  const onDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); };

  if (loading) return (
    <div className="p-6 space-y-4 max-w-4xl mx-auto">
      <Skeleton className="h-48" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-64" /><Skeleton className="h-64" />
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold mb-1">Resume AI Analyzer</h1>
        <p className="text-white/40 text-sm">Upload your resume for deep AI analysis, ATS scoring, and tailored interview prep.</p>
      </div>

      {/* Upload Zone */}
      {!resume && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all mb-6 ${
            dragOver
              ? 'border-accent bg-accent/8 scale-[1.01]'
              : 'border-border-2 hover:border-accent hover:bg-accent/5'
          }`}
        >
          <input ref={fileRef} type="file" accept=".pdf,.docx" className="hidden" onChange={onFileInput} />
          <div className="text-5xl mb-4">📄</div>
          <div className="font-heading font-bold text-lg mb-2">
            {uploading ? 'Analysing your resume...' : 'Drop your resume here'}
          </div>
          <div className="text-white/40 text-sm mb-5">Supports PDF, DOCX — Max 5 MB</div>
          <Button loading={uploading} size="lg">
            {uploading ? 'Processing...' : 'Choose File'}
          </Button>
        </motion.div>
      )}

      {/* Resume Analysis Results */}
      {resume && (
        <AnimatePresence mode="wait">
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* File header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/15 flex items-center justify-center">
                  <FileText size={18} className="text-success" />
                </div>
                <div>
                  <div className="font-medium text-sm">{resume.fileName || 'resume.pdf'}</div>
                  <div className="text-xs text-success flex items-center gap-1">
                    <CheckCircle2 size={11} /> Analysed successfully
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost" size="sm"
                  icon={<Trash2 size={13} />}
                  onClick={() => { setResume(null); toast('Upload a new resume'); }}
                >
                  Remove
                </Button>
                <Button
                  size="sm"
                  icon={<ArrowRight size={13} />}
                  onClick={() => navigate('/interview/room', { state: { mode: 'hr' } })}
                >
                  Practice Interview
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-5 bg-bg-2 border border-border p-1 rounded-xl w-fit">
              {['analysis', 'skills', 'questions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                    activeTab === tab
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {tab === 'analysis' ? '📊 Analysis' : tab === 'skills' ? '🛠 Skills' : '❓ Questions'}
                </button>
              ))}
            </div>

            {/* ── Analysis Tab ── */}
            {activeTab === 'analysis' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {/* Score overview */}
                <Card>
                  <SectionTitle>ATS & Quality Scores</SectionTitle>
                  <div className="flex flex-wrap justify-around gap-4 py-2">
                    {[
                      ['ATS Score',    resume.analysis?.atsScore,           '#22c984'],
                      ['Impact',       resume.analysis?.impactScore,        '#7c6dfa'],
                      ['Keywords',     resume.analysis?.keywordScore,       '#4da6ff'],
                      ['Formatting',   resume.analysis?.formattingScore,    '#f5a623'],
                    ].map(([label, score = 0, color]) => (
                      <ScoreRing key={label} score={score} label={label} size={95} color={color} />
                    ))}
                  </div>
                  {resume.analysis?.summary && (
                    <p className="mt-4 text-[13.5px] text-white/60 leading-relaxed border-t border-border pt-4">
                      {resume.analysis.summary}
                    </p>
                  )}
                </Card>

                {/* Recommendations */}
                <Card>
                  <SectionTitle>AI Recommendations ⚡</SectionTitle>
                  <div className="space-y-3">
                    {(resume.analysis?.recommendations || []).map((rec, i) => (
                      <div key={i} className="flex gap-3 py-2.5 border-b border-border last:border-0">
                        <AlertCircle size={15} className="text-warning flex-shrink-0 mt-0.5" />
                        <span className="text-[13.5px] text-white/70">{rec}</span>
                      </div>
                    ))}
                    {resume.analysis?.missingKeywords?.length > 0 && (
                      <div className="pt-2">
                        <div className="text-xs text-white/40 mb-2">Missing Keywords</div>
                        <div className="flex flex-wrap gap-1.5">
                          {resume.analysis.missingKeywords.map((kw) => (
                            <Badge key={kw} color="red">{kw}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Score bars */}
                <Card>
                  <SectionTitle>Detailed Breakdown</SectionTitle>
                  <div className="space-y-3">
                    {[
                      ['ATS Score',         resume.analysis?.atsScore],
                      ['Quantified Results', resume.analysis?.quantificationScore],
                      ['Impact Statements', resume.analysis?.impactScore],
                      ['Keyword Match',     resume.analysis?.keywordScore],
                      ['Formatting',        resume.analysis?.formattingScore],
                      ['Overall Score',     resume.analysis?.overallScore],
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
              </motion.div>
            )}

            {/* ── Skills Tab ── */}
            {activeTab === 'skills' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <Card>
                  <SectionTitle>Extracted Skills</SectionTitle>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(resume.skills || []).map(({ name, level }) => (
                      <div
                        key={name}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-3 border border-border rounded-lg text-sm hover:border-accent transition-colors cursor-default"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full bg-${
                          level === 'advanced' ? 'success' : level === 'intermediate' ? 'warning' : 'danger'
                        }`} />
                        {name}
                        <Badge color={SKILL_LEVEL_COLOR[level]} className="ml-1 !text-[10px]">{level}</Badge>
                      </div>
                    ))}
                    {!resume.skills?.length && (
                      <p className="text-white/40 text-sm">No skills extracted. Ensure your resume has a skills section.</p>
                    )}
                  </div>

                  {/* Experience */}
                  {resume.experience?.length > 0 && (
                    <>
                      <SectionTitle>Work Experience</SectionTitle>
                      <div className="space-y-4">
                        {resume.experience.map((exp, i) => (
                          <div key={i} className="border-l-2 border-accent/30 pl-4">
                            <div className="font-medium text-sm">{exp.role}</div>
                            <div className="text-xs text-accent mb-1">{exp.company} · {exp.duration}</div>
                            {exp.description && (
                              <div className="text-[12.5px] text-white/50">{exp.description}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Education */}
                  {resume.education?.length > 0 && (
                    <>
                      <SectionTitle className="mt-5">Education</SectionTitle>
                      <div className="space-y-3">
                        {resume.education.map((edu, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center text-sm flex-shrink-0">🎓</div>
                            <div>
                              <div className="font-medium text-sm">{edu.degree}</div>
                              <div className="text-xs text-white/50">{edu.institution} · {edu.year}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </Card>
              </motion.div>
            )}

            {/* ── Questions Tab ── */}
            {activeTab === 'questions' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card>
                  <SectionTitle>AI-Generated Interview Questions</SectionTitle>
                  <p className="text-[13px] text-white/40 mb-4">
                    Based on your resume content, expect these questions in your next interview:
                  </p>
                  <div className="space-y-3">
                    {(resume.generatedQuestions || []).map((q, i) => (
                      <div key={i} className="flex gap-3 py-3 border-b border-border last:border-0">
                        <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center text-xs font-bold text-accent flex-shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-[13.5px] text-white/80 leading-relaxed">{q}</p>
                        </div>
                        <button
                          onClick={() => navigate('/interview/room', { state: { mode: 'hr', focusQuestion: q } })}
                          className="text-white/20 hover:text-accent transition-colors flex-shrink-0"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    ))}
                    {!resume.generatedQuestions?.length && (
                      <p className="text-white/40 text-sm text-center py-4">No questions generated yet.</p>
                    )}
                  </div>

                  <Button
                    className="w-full mt-4"
                    onClick={() => navigate('/interview/room', { state: { mode: 'hr' } })}
                  >
                    Practice These Questions →
                  </Button>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default ResumeAnalyzer;
