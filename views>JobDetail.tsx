
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Download, User, Mail, Star, ExternalLink, 
  Radar, Target, CheckCircle2, ShieldCheck, 
  XCircle, ChevronRight, AlertCircle, Loader2,
  BrainCircuit, History, Share2, MessageSquareText,
  CalendarDays, UserPlus, Shield, Clock, Search, MoreVertical,
  Briefcase, Activity, CheckSquare, Eye,
  // Fix: Added missing icon imports
  Settings, Filter, Sparkles, FileText
} from 'lucide-react';
import { Job, Candidate, CandidateStatus, CandidateAnswer } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RadarArea } from 'recharts';
import { generateInterviewScript } from '../services/geminiService';

interface Props {
  jobs: Job[];
  candidates: Candidate[];
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
}

const JobDetail: React.FC<Props> = ({ jobs, candidates, setCandidates }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = jobs.find(j => j.id === id);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'replay' | 'resume'>('summary');
  const [processing, setProcessing] = useState<string | null>(null);
  const [interviewScript, setInterviewScript] = useState<string | null>(null);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  if (!job) return <div className="p-20 text-center font-bold text-slate-400 font-black">JOB PIPELINE NOT FOUND</div>;

  const jobCandidates = candidates
    .filter(c => c.appliedJobs.some(aj => aj.jobId === id))
    .sort((a, b) => {
      const appA = a.appliedJobs.find(aj => aj.jobId === id)!;
      const appB = b.appliedJobs.find(aj => aj.jobId === id)!;
      return (appB.suitability || 0) - (appA.suitability || 0);
    });

  const selectedCandidate = jobCandidates.find(c => c.id === selectedCandidateId);
  const selectedApplication = selectedCandidate?.appliedJobs.find(aj => aj.jobId === id);

  const updateStatus = async (candId: string, status: CandidateStatus, actionName: string) => {
    setProcessing(actionName);
    await new Promise(resolve => setTimeout(resolve, 800));
    setCandidates(prev => prev.map(c => {
      if (c.id === candId) {
        return {
          ...c,
          appliedJobs: c.appliedJobs.map(aj => aj.jobId === id ? { ...aj, status, notified: true } : aj)
        };
      }
      return c;
    }));
    setProcessing(null);
  };

  const handleGenerateScript = async () => {
    if (!selectedCandidate || !selectedApplication) return;
    setIsGeneratingScript(true);
    const script = await generateInterviewScript(job, selectedApplication.feedback || '', job.skills);
    setInterviewScript(script);
    setIsGeneratingScript(false);
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col animate-in fade-in duration-500 overflow-hidden">
      {/* Infrastructure Toolbar */}
      <header className="flex items-center justify-between bg-white px-8 py-5 border-b border-slate-100">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 border border-slate-100">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter flex items-center gap-2">
              {job.title} <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{job.status}</span>
            </h2>
            <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
              <span>{job.department}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
              <span className="flex items-center gap-1"><Shield size={12} className="text-indigo-400" /> Proctoring Active</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
              <span className="flex items-center gap-1"><Target size={12} className="text-emerald-400" /> Cutoff: {job.cutoffScore}%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-100 hover:bg-white">
            <Settings size={14} /> Pipeline Config
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700">
            <Share2 size={14} /> Copy Apply Link
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Elite Candidate Queue (Main Table) */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
          <div className="p-8 pb-4 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Verified Talent Queue ({jobCandidates.length})</h3>
            <div className="flex gap-2">
              <button className="p-2 bg-white rounded-lg border border-slate-100 text-slate-400"><Search size={16} /></button>
              <button className="p-2 bg-white rounded-lg border border-slate-100 text-slate-400"><Filter size={16} /></button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-8">
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/80 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Candidate Info</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Match Score</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Skill Tags</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Integrity</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {jobCandidates.map(c => {
                    const app = c.appliedJobs.find(aj => aj.jobId === id)!;
                    const isSelected = selectedCandidateId === c.id;
                    const integrityFlag = (app.integrityScore || 100) < 70;
                    
                    return (
                      <tr 
                        key={c.id} 
                        onClick={() => setSelectedCandidateId(c.id)}
                        className={`group cursor-pointer transition-all ${isSelected ? 'bg-indigo-50/40' : 'hover:bg-slate-50/50'}`}
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg">
                              {c.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-slate-800 text-sm leading-none mb-1">{c.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{c.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <span className={`text-2xl font-black ${app.suitability! > 80 ? 'text-indigo-600' : 'text-slate-800'}`}>
                              {app.suitability}%
                            </span>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500" style={{ width: `${app.suitability}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-wrap gap-1.5">
                            {c.parsedResume?.heatmapKeywords.slice(0, 3).map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-slate-100 rounded text-[8px] font-black text-slate-500 uppercase tracking-tighter">
                                ● {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          {integrityFlag ? (
                            <div className="flex items-center gap-1.5 text-red-500 font-black text-[9px] uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-xl border border-red-100">
                              <AlertCircle size={14} /> Suspicious
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[9px] uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                              <ShieldCheck size={14} /> Verified
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => { e.stopPropagation(); updateStatus(c.id, CandidateStatus.SHORTLISTED, 'Approving'); }}
                              className="p-2 bg-emerald-500 text-white rounded-lg shadow-lg hover:bg-emerald-600"
                            ><CheckCircle2 size={16} /></button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); updateStatus(c.id, CandidateStatus.ON_HOLD, 'Holding'); }}
                              className="p-2 bg-slate-800 text-white rounded-lg shadow-lg hover:bg-slate-900"
                            ><Clock size={16} /></button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); updateStatus(c.id, CandidateStatus.REJECTED, 'Rejecting'); }}
                              className="p-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"
                            ><XCircle size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Intelligence Deep-Dive (Right Panel) */}
        <div className={`w-[500px] bg-white border-l border-slate-100 shadow-2xl transition-all duration-500 flex flex-col ${selectedCandidate ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full'}`}>
          {!selectedCandidate ? (
             <div className="m-auto text-center p-20 space-y-4">
              <BrainCircuit size={48} className="mx-auto text-slate-100" />
              <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest">Select talent for deep-dive intelligence</p>
             </div>
          ) : (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="p-8 border-b border-slate-50 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-900 text-white rounded-[24px] flex items-center justify-center text-2xl font-black shadow-xl">
                      {selectedCandidate.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-800 tracking-tighter leading-none">{selectedCandidate.name}</h3>
                      <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mt-1">ScreenIQ Fit Score: {selectedApplication?.suitability}%</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedCandidateId(null)} className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-300"><XCircle size={24} /></button>
                </div>

                <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-100">
                  <TabBtn label="AI Summary" active={activeTab === 'summary'} onClick={() => setActiveTab('summary')} />
                  <TabBtn label="Assessment" active={activeTab === 'replay'} onClick={() => setActiveTab('replay')} />
                  <TabBtn label="Resume" active={activeTab === 'resume'} onClick={() => setActiveTab('resume')} />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                {activeTab === 'summary' && (
                  <div className="space-y-8 animate-in fade-in zoom-in-95">
                    <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 relative overflow-hidden group">
                      <Sparkles className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-all" size={64} />
                      <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-3 flex items-center gap-2"><BrainCircuit size={14}/> 3-Sentence Elevator Pitch</h4>
                      <p className="text-indigo-800 font-medium italic text-sm leading-relaxed">
                        {selectedApplication?.feedback || "Evaluation pending."}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Target size={14} className="text-indigo-600" /> Skill Alignment Radar</h4>
                      <div className="h-56 bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={Object.keys(job.idealSkillProfile).map(skill => ({
                            subject: skill,
                            Actual: selectedApplication?.skillBreakdown?.[skill] || 0,
                            Ideal: job.idealSkillProfile[skill] || 80
                          }))}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                            <RadarArea name="Actual" dataKey="Actual" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} strokeWidth={2} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <StatTile label="Integrity" val={`${selectedApplication?.integrityScore}%`} />
                      <StatTile label="Confidence" val={`${selectedApplication?.confidenceScore}%`} />
                    </div>
                  </div>
                )}

                {activeTab === 'replay' && (
                  <div className="space-y-6 animate-in slide-in-from-right-8">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Activity size={14} className="text-indigo-600" /> Question-by-Question Replay</h4>
                    <div className="space-y-4">
                      {/* Fix: Casted answers mapping to handle unknown type during iteration */}
                      {(Object.entries(selectedApplication?.answers || {}) as [string, CandidateAnswer][]).map(([id, ans], idx) => (
                        <div key={id} className="p-4 bg-white border border-slate-100 rounded-2xl space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] font-black uppercase text-slate-400">Q#{idx + 1} • {ans.timeTaken}s</span>
                            <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg ${ans.confidence === 'certain' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>{ans.confidence}</span>
                          </div>
                          <p className="text-xs font-bold text-slate-800 leading-relaxed truncate">{ans.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'resume' && (
                  <div className="space-y-8 animate-in slide-in-from-right-8">
                    <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
                      <FileText className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-all" size={80} />
                      <h4 className="text-xl font-black tracking-tight mb-4">AI-Highlighted Proof Points</h4>
                      <ul className="space-y-4">
                        {selectedCandidate.parsedResume?.timeline.map((item, i) => (
                          <li key={i} className="flex gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2"></div>
                            <div className="space-y-1">
                              <p className="text-xs font-black uppercase tracking-widest text-indigo-400">{item.company}</p>
                              <p className="text-sm font-medium text-slate-300 leading-relaxed">{item.description}</p>
                              {item.aiNote && <p className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">✔ {item.aiNote}</p>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                      <Download size={16} /> Download Original PDF
                    </button>
                  </div>
                )}
              </div>

              {/* Panel Footer Actions */}
              <div className="p-8 border-t border-slate-50 grid grid-cols-2 gap-3 bg-white">
                 <button 
                  onClick={handleGenerateScript}
                  disabled={isGeneratingScript}
                  className="py-4 bg-indigo-50 text-indigo-700 rounded-2xl font-black text-[9px] uppercase tracking-widest border border-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-100"
                >
                  {isGeneratingScript ? <Loader2 size={14} className="animate-spin" /> : <MessageSquareText size={14} />} Custom Script
                </button>
                <button 
                  onClick={() => updateStatus(selectedCandidate.id, CandidateStatus.INTERVIEW_SCHEDULED, 'Booking')}
                  className="py-4 bg-slate-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800"
                >
                  <CalendarDays size={14} /> Schedule Interview
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TabBtn = ({ label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
    {label}
  </button>
);

const StatTile = ({ label, val }: any) => (
  <div className="p-4 bg-white border border-slate-100 rounded-2xl text-center shadow-sm">
    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-lg font-black text-slate-800">{val}</p>
  </div>
);

const StatusPill = ({ status }: { status: CandidateStatus }) => {
  const styles: Record<CandidateStatus, string> = {
    [CandidateStatus.APPLIED]: 'bg-indigo-50 text-indigo-700',
    [CandidateStatus.SHORTLISTED]: 'bg-emerald-50 text-emerald-700',
    [CandidateStatus.POTENTIAL]: 'bg-amber-50 text-amber-700',
    [CandidateStatus.REJECTED]: 'bg-red-50 text-red-700',
    [CandidateStatus.INTERVIEW_SCHEDULED]: 'bg-amber-50 text-amber-700',
    [CandidateStatus.INVITED_TO_ASSESSMENT]: 'bg-orange-50 text-orange-700 border-orange-100',
    [CandidateStatus.DRAFT]: 'bg-slate-50 text-slate-500',
    [CandidateStatus.ASSESSMENT_PENDING]: 'bg-slate-50 text-slate-500',
    [CandidateStatus.ASSESSMENT_COMPLETED]: 'bg-indigo-50 text-indigo-700',
    [CandidateStatus.ON_HOLD]: 'bg-slate-100 text-slate-600',
  };

  return (
    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border border-transparent ${styles[status]}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};

export default JobDetail;
