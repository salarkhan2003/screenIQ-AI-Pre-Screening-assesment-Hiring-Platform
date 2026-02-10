import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Download, Target, 
  CheckCircle2, XCircle, AlertCircle, Loader2,
  BrainCircuit, MessageSquareText,
  CalendarDays, Shield, Clock, Search,
  Activity, Eye, EyeOff, Settings, Filter, Sparkles, FileText, X, Users, CheckSquare,
  // Fix: Added missing ShieldCheck import
  ShieldCheck
} from 'lucide-react';
import { Job, Candidate, CandidateStatus, CandidateAnswer } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RadarArea } from 'recharts';
import { generateInterviewScript } from '../services/geminiService';

const StatusPill = ({ status }: { status: CandidateStatus }) => {
  const styles: Record<CandidateStatus, string> = {
    [CandidateStatus.APPLIED]: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    [CandidateStatus.SHORTLISTED]: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    [CandidateStatus.REJECTED]: 'bg-red-50 text-red-700 border-red-100',
    [CandidateStatus.INTERVIEW_SCHEDULED]: 'bg-amber-50 text-amber-700 border-amber-100',
    [CandidateStatus.INVITED_TO_ASSESSMENT]: 'bg-orange-50 text-orange-700 border-orange-100',
    [CandidateStatus.DRAFT]: 'bg-slate-50 text-slate-500',
    [CandidateStatus.ASSESSMENT_PENDING]: 'bg-slate-50 text-slate-500',
    [CandidateStatus.ASSESSMENT_COMPLETED]: 'bg-indigo-50 text-indigo-700',
    [CandidateStatus.ON_HOLD]: 'bg-slate-100 text-slate-600',
  };

  return (
    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border ${styles[status]}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};

const TabBtn = ({ label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'}`}>
    {label}
  </button>
);

const StatTile = ({ label, val, sub, alert }: any) => (
  <div className={`p-6 border rounded-[32px] text-center shadow-sm group transition-all ${alert ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100 hover:border-indigo-100 hover:shadow-md'}`}>
    <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${alert ? 'text-red-500' : 'text-slate-400 group-hover:text-indigo-400'}`}>{label}</p>
    <p className={`text-3xl font-black ${alert ? 'text-red-700' : 'text-slate-800'}`}>{val}</p>
    <p className={`text-[8px] font-bold uppercase mt-1 ${alert ? 'text-red-400' : 'text-slate-300'}`}>{sub}</p>
  </div>
);

const JobDetail: React.FC<{ jobs: Job[], candidates: Candidate[], setCandidates: any }> = ({ jobs, candidates, setCandidates }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = jobs.find(j => j.id === id);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'replay' | 'resume'>('summary');
  const [isAnonymized, setIsAnonymized] = useState(false);
  const [interviewScript, setInterviewScript] = useState<string | null>(null);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  if (!job) return <div className="p-20 text-center font-bold text-slate-400 font-black">JOB PIPELINE NOT FOUND</div>;

  const jobCandidates = candidates
    .filter(c => c.appliedJobs.some(aj => aj.jobId === id))
    .sort((a, b) => {
      const appA = a.appliedJobs.find(aj => aj.jobId === id)!;
      const appB = b.appliedJobs.find(aj => aj.jobId === id)!;
      return (appB.score || 0) - (appA.score || 0);
    });

  const selectedCandidate = jobCandidates.find(c => c.id === selectedCandidateId);
  const selectedApplication = selectedCandidate?.appliedJobs.find(aj => aj.jobId === id);

  const updateStatus = async (candId: string, status: CandidateStatus) => {
    setCandidates((prev: Candidate[]) => prev.map(c => {
      if (c.id === candId) {
        return {
          ...c,
          appliedJobs: c.appliedJobs.map(aj => aj.jobId === id ? { ...aj, status, notified: true } : aj)
        };
      }
      return c;
    }));
  };

  const handleGenerateScript = async () => {
    if (!selectedCandidate || !selectedApplication) return;
    setIsGeneratingScript(true);
    const script = await generateInterviewScript(job, selectedApplication.feedback || '', job.skills);
    setInterviewScript(script);
    setIsGeneratingScript(false);
  };

  const radarData = Object.keys(job.idealSkillProfile || { 'Technical': 80, 'Logic': 80, 'Domain': 80 }).map(skill => ({
    subject: skill,
    Actual: selectedApplication?.skillBreakdown?.[skill] || 0,
    Ideal: job.idealSkillProfile?.[skill] || 80,
    fullMark: 100
  }));

  const candidateDisplayName = isAnonymized && selectedCandidateId ? `Elite Talent #${selectedCandidate?.id.slice(-4)}` : selectedCandidate?.name;
  const candidateDisplayEmail = isAnonymized ? "anonymized@screeniq.ai" : selectedCandidate?.email;

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col animate-in fade-in duration-500 overflow-hidden -m-4 md:-m-8">
      <header className="flex items-center justify-between bg-white px-8 py-6 border-b border-slate-100 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 border border-slate-100 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter flex items-center gap-2">
              {job.title} <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{job.status}</span>
            </h2>
            <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
              <span>{job.company}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
              <span className="flex items-center gap-1"><Shield size={12} className="text-indigo-400" /> Proctoring Active</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
              <span className="flex items-center gap-1"><Target size={12} className="text-emerald-400" /> Threshold: {job.cutoffScore}%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsAnonymized(!isAnonymized)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isAnonymized ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
            <EyeOff size={14} /> Anonymize
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-400 rounded-xl border border-slate-100 hover:bg-white"><Settings size={18} /></button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
          <div className="p-8 pb-4 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Priority Talent Queue ({jobCandidates.length})</h3>
            <div className="flex gap-2">
              <div className="relative group">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                <input type="text" placeholder="Search priority queue..." className="pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-indigo-100 transition-all w-64 shadow-sm" />
              </div>
              <button className="p-2.5 bg-white rounded-xl border border-slate-100 text-slate-400 hover:text-indigo-600 transition-all shadow-sm"><Filter size={16} /></button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-8">
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/80 border-b border-slate-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Candidate Signature</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Integrity Pulse</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Gate Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {jobCandidates.map(c => {
                    const app = c.appliedJobs.find(aj => aj.jobId === id)!;
                    const isSelected = selectedCandidateId === c.id;
                    const integrityFlag = (app.integrityScore || 100) < 70 || (app.tabSwitches || 0) > 2;
                    
                    return (
                      <tr 
                        key={c.id} 
                        onClick={() => setSelectedCandidateId(c.id)}
                        className={`group cursor-pointer transition-all ${isSelected ? 'bg-indigo-50/40' : 'hover:bg-slate-50/50'}`}
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg group-hover:scale-110 transition-transform">
                              {isAnonymized ? <Shield size={20} className="text-indigo-400" /> : c.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-slate-800 text-sm leading-none mb-1">{isAnonymized ? `Elite Talent #${c.id.slice(-4)}` : c.name}</p>
                              <div className="flex items-center gap-2">
                                <StatusPill status={app.status} />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className={`text-2xl font-black ${app.score! >= job.cutoffScore ? 'text-indigo-600' : 'text-slate-800'}`}>{app.score}%</span>
                            <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden mt-1"><div className="h-full bg-indigo-500" style={{ width: `${app.score}%` }}></div></div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          {integrityFlag ? (
                            <div className="flex items-center gap-1.5 text-red-500 font-black text-[9px] uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-xl border border-red-100 shadow-sm animate-pulse">
                              <AlertCircle size={14} /> Flagged
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[9px] uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 shadow-sm"><ShieldCheck size={14} /> Verified</div>
                          )}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                            <button onClick={(e) => { e.stopPropagation(); updateStatus(c.id, CandidateStatus.SHORTLISTED); }} className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-lg hover:bg-emerald-600 transition-all"><CheckCircle2 size={16} /></button>
                            <button onClick={(e) => { e.stopPropagation(); updateStatus(c.id, CandidateStatus.REJECTED); }} className="p-2.5 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all"><XCircle size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {jobCandidates.length === 0 && (
                <div className="flex flex-col items-center justify-center p-32 text-center space-y-4">
                   <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-200">
                     <Users size={40} />
                   </div>
                   <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Waiting for verified candidates to clear the gate...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`w-[550px] bg-white border-l border-slate-100 shadow-2xl transition-all duration-500 flex flex-col z-[60] ${selectedCandidate ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full'}`}>
          {!selectedCandidate ? (
             <div className="m-auto text-center p-20 space-y-4">
              <BrainCircuit size={48} className="mx-auto text-slate-100" />
              <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest">Select talent for deep-dive intelligence</p>
             </div>
          ) : (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="p-8 border-b border-slate-50 space-y-6 bg-slate-50/30">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 bg-slate-900 text-white rounded-[28px] flex items-center justify-center text-3xl font-black shadow-2xl">
                      {isAnonymized ? <Shield size={32} className="text-indigo-400" /> : selectedCandidate.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-800 tracking-tighter leading-tight">{candidateDisplayName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-indigo-600 font-black text-xs uppercase tracking-widest">Elite Score: {selectedApplication?.score}%</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                        <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{candidateDisplayEmail}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedCandidateId(null)} className="p-2 hover:bg-slate-200 rounded-xl transition-all text-slate-400 hover:text-slate-600"><X size={24} /></button>
                </div>

                <div className="flex p-1 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <TabBtn label="AI Summary" active={activeTab === 'summary'} onClick={() => setActiveTab('summary')} />
                  <TabBtn label="Question Logs" active={activeTab === 'replay'} onClick={() => setActiveTab('replay')} />
                  <TabBtn label="Resume View" active={activeTab === 'resume'} onClick={() => setActiveTab('resume')} />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
                {activeTab === 'summary' && (
                  <div className="space-y-10 animate-in fade-in zoom-in-95">
                    <div className="grid grid-cols-2 gap-6">
                      <StatTile 
                        label="Tab Switches" 
                        val={selectedApplication?.tabSwitches || 0} 
                        sub="Suspicious after 2"
                        alert={(selectedApplication?.tabSwitches || 0) > 0}
                      />
                      <StatTile 
                        label="Identity Trace" 
                        val={selectedApplication?.multiplePersonsDetected ? "Fail" : "Secure"} 
                        sub="Face tracking verified"
                        alert={selectedApplication?.multiplePersonsDetected}
                      />
                    </div>

                    <div className="bg-indigo-50 p-8 rounded-[40px] border border-indigo-100 relative overflow-hidden group">
                      <Sparkles className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-all" size={80} />
                      <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-4 flex items-center gap-2"><BrainCircuit size={16}/> Strategic Suitability</h4>
                      <p className="text-indigo-800 font-medium italic text-base leading-relaxed">"{selectedApplication?.feedback || "Evaluation pending..."}"</p>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Target size={14} className="text-indigo-600" /> Infrastructure Alignment</h4>
                      <div className="h-64 min-h-[256px] bg-slate-50 rounded-[40px] p-8 border border-slate-100 shadow-inner">
                        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 900 }} />
                            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                            <RadarArea name="Actual" dataKey="Actual" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} strokeWidth={3} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'replay' && (
                  <div className="space-y-8 animate-in slide-in-from-right-8">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Activity size={14} className="text-indigo-600" /> Response Logs</h4>
                    <div className="space-y-4">
                      {(Object.entries(selectedApplication?.answers || {}) as [string, CandidateAnswer][]).map(([qId, ans], idx) => (
                        <div key={qId} className="p-6 bg-white border border-slate-100 rounded-[32px] space-y-4 shadow-sm group hover:shadow-md transition-all">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black uppercase text-slate-400">Question #{idx + 1}</span>
                            <span className="text-[8px] font-black uppercase px-2 py-1 bg-slate-50 text-slate-500 rounded-lg">{ans.timeTaken}s speed</span>
                          </div>
                          <p className="text-sm font-bold text-slate-700 leading-relaxed italic">"{ans.value}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'resume' && (
                  <div className="space-y-8 animate-in slide-in-from-right-8 h-full">
                    <div className="bg-slate-900 text-white p-10 rounded-[48px] shadow-2xl relative overflow-hidden group min-h-[400px]">
                      <FileText className="absolute top-0 right-0 p-8 opacity-10" size={100} />
                      <h4 className="text-2xl font-black tracking-tight mb-8">AI-Highlighter</h4>
                      <ul className="space-y-8">
                        {selectedCandidate.parsedResume?.timeline.map((item, i) => (
                          <li key={i} className="flex gap-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                            <div className="space-y-2">
                              <p className="text-xs font-black uppercase tracking-widest text-indigo-400">{item.company}</p>
                              <p className="text-sm font-medium text-slate-300 leading-relaxed">{item.description}</p>
                              {item.aiNote && (
                                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 w-fit">
                                  <CheckSquare size={12} className="text-emerald-400" />
                                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">{item.aiNote}</p>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-slate-100 grid grid-cols-2 gap-4 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.03)] sticky bottom-0 z-10">
                 <button onClick={handleGenerateScript} disabled={isGeneratingScript} className="py-5 bg-indigo-50 text-indigo-700 rounded-[28px] font-black text-[10px] uppercase tracking-widest border-2 border-indigo-100 flex items-center justify-center gap-3 hover:bg-indigo-100 transition-all disabled:opacity-50">
                  {isGeneratingScript ? <Loader2 size={16} className="animate-spin" /> : <MessageSquareText size={16} />} Custom Script
                </button>
                <button onClick={() => updateStatus(selectedCandidate.id, CandidateStatus.INTERVIEW_SCHEDULED)} className="py-5 bg-slate-900 text-white rounded-[28px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 shadow-xl transition-all active:scale-95">
                  <CalendarDays size={18} /> Schedule Interview
                </button>
              </div>

              {interviewScript && (
                <div className="absolute inset-0 bg-white/98 backdrop-blur-xl z-[70] p-12 overflow-y-auto animate-in fade-in zoom-in-95">
                  <div className="max-w-xl mx-auto space-y-10">
                    <div className="flex justify-between items-center"><h4 className="text-4xl font-black text-slate-800 tracking-tighter">AI Interview Script</h4><button onClick={() => setInterviewScript(null)} className="p-3 hover:bg-slate-100 rounded-full transition-all"><X size={32} /></button></div>
                    <div className="bg-slate-900 text-slate-200 p-10 rounded-[48px] shadow-2xl space-y-6 leading-loose text-base font-medium whitespace-pre-line border border-white/5">{interviewScript}</div>
                    <button onClick={() => setInterviewScript(null)} className="w-full py-6 bg-indigo-600 text-white rounded-[32px] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-indigo-700 transition-all">Done</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;