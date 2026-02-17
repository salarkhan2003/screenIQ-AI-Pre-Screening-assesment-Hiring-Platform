
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Target, CheckCircle2, XCircle, AlertCircle, Loader2,
  BrainCircuit, MessageSquareText, CalendarDays, Shield, Search,
  Activity, EyeOff, Settings, Filter, Sparkles, FileText, X, Users, CheckSquare,
  ShieldCheck, Terminal, Fingerprint, Star
} from 'lucide-react';
import { Job, Candidate, CandidateStatus, CandidateAnswer } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RadarArea } from 'recharts';
import { generateInterviewScript } from '../services/geminiService';

const StatusPill = ({ status }: { status: CandidateStatus }) => {
  const styles: Record<CandidateStatus, string> = {
    [CandidateStatus.APPLIED]: 'bg-slate-50 text-slate-500 border-slate-100',
    [CandidateStatus.SHORTLISTED]: 'bg-emerald-500 text-white border-emerald-600', // GREEN
    [CandidateStatus.POTENTIAL]: 'bg-amber-400 text-slate-900 border-amber-500', // YELLOW
    [CandidateStatus.REJECTED]: 'bg-red-500 text-white border-red-600',       // RED
    [CandidateStatus.INTERVIEW_SCHEDULED]: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    [CandidateStatus.INVITED_TO_ASSESSMENT]: 'bg-orange-50 text-orange-700 border-orange-100',
    [CandidateStatus.DRAFT]: 'bg-slate-50 text-slate-500',
    [CandidateStatus.ASSESSMENT_PENDING]: 'bg-slate-50 text-slate-500',
    [CandidateStatus.ASSESSMENT_COMPLETED]: 'bg-indigo-50 text-indigo-700',
    [CandidateStatus.ON_HOLD]: 'bg-slate-100 text-slate-600',
  };

  return (
    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border shadow-sm ${styles[status]}`}>
      {status === CandidateStatus.SHORTLISTED ? 'READY: GREEN' : 
       status === CandidateStatus.POTENTIAL ? 'POTENTIAL: YELLOW' : 
       status === CandidateStatus.REJECTED ? 'FAILED: RED' : status.replace(/_/g, ' ')}
    </span>
  );
};

const JobDetail: React.FC<{ jobs: Job[], candidates: Candidate[], setCandidates: any }> = ({ jobs, candidates, setCandidates }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = jobs.find(j => j.id === id);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'replay' | 'resume'>('summary');
  const [isAnonymized, setIsAnonymized] = useState(false);
  const [interviewScript, setInterviewScript] = useState<string | null>(null);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  if (!job) return <div className="p-20 text-center font-bold text-slate-400 font-black">GATE NOT FOUND</div>;

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

  const radarData = Object.keys(job.idealSkillProfile).map(skill => ({
    subject: skill,
    Actual: selectedApplication?.skillBreakdown?.[skill] || 0,
    Ideal: job.idealSkillProfile[skill] || 80
  }));

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col animate-in fade-in duration-500 overflow-hidden -m-4 md:-m-8 font-sans">
      <header className="flex items-center justify-between bg-white px-8 py-6 border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 border border-slate-100">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter flex items-center gap-2 italic uppercase">
              {job.title} <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">{job.status}</span>
            </h2>
            <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
              <span>{job.company}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
              <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-indigo-400" /> Intersection Engine Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsAnonymized(!isAnonymized)} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${isAnonymized ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
            Bias Control: {isAnonymized ? 'ON' : 'OFF'}
          </button>
          <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl border border-slate-100"><Settings size={18} /></button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
          <div className="p-8 pb-4 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Verified Leaderboard ({jobCandidates.length})</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/80 border-b border-slate-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Talent Signature</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Verity Score</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Role Verdict</th>
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
                              {isAnonymized ? <Terminal size={20} className="text-indigo-400" /> : c.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-slate-800 text-sm leading-none mb-1">{isAnonymized ? `Candidate-Verity-${c.id.slice(-4)}` : c.name}</p>
                              <StatusPill status={app.status} />
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className={`text-2xl font-black ${app.score! >= job.cutoffScore ? 'text-indigo-600' : 'text-slate-800'}`}>{app.score}%</span>
                        </td>
                        <td className="px-8 py-6 max-w-xs">
                          <p className="text-[11px] font-medium text-slate-500 italic leading-snug line-clamp-2">"{app.oneSentenceVerdict || "No verdict generated."}"</p>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                            <button onClick={(e) => { e.stopPropagation(); updateStatus(c.id, CandidateStatus.SHORTLISTED); }} className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-lg hover:bg-emerald-600"><CheckCircle2 size={16} /></button>
                            <button onClick={(e) => { e.stopPropagation(); updateStatus(c.id, CandidateStatus.POTENTIAL); }} className="p-2.5 bg-amber-400 text-slate-900 rounded-xl shadow-lg hover:bg-amber-500"><Star size={16} /></button>
                            <button onClick={(e) => { e.stopPropagation(); updateStatus(c.id, CandidateStatus.REJECTED); }} className="p-2.5 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600"><XCircle size={16} /></button>
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

        {/* Deep Dive Panel */}
        <div className={`w-[550px] bg-white border-l border-slate-100 shadow-2xl transition-all duration-500 flex flex-col z-[60] ${selectedCandidate ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full'}`}>
          {!selectedCandidate ? (
             <div className="m-auto text-center p-20 space-y-4">
              <BrainCircuit size={48} className="mx-auto text-slate-100" />
              <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest italic">Select talent for zero-knowledge proof intel</p>
             </div>
          ) : (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="p-8 border-b border-slate-50 space-y-6 bg-slate-50/30">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 bg-slate-900 text-white rounded-[28px] flex items-center justify-center text-3xl font-black shadow-2xl">
                       {isAnonymized ? <Fingerprint size={32} className="text-indigo-400" /> : selectedCandidate.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-800 tracking-tighter leading-tight">{isAnonymized ? 'Verity Talent' : selectedCandidate.name}</h3>
                      <p className="text-indigo-600 font-black text-xs uppercase tracking-widest mt-1">Integrity Shield: {selectedApplication?.integrityScore}%</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedCandidateId(null)} className="p-2 hover:bg-slate-200 rounded-xl text-slate-400"><X size={24} /></button>
                </div>

                <div className="flex p-1 bg-white rounded-2xl border border-slate-100 shadow-sm">
                   {['AI Analysis', '10-Bit Logs', 'Resume Info'].map((l, i) => (
                     <button key={l} onClick={() => setActiveTab(i === 0 ? 'summary' : i === 1 ? 'replay' : 'resume')} className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === (i === 0 ? 'summary' : i === 1 ? 'replay' : 'resume') ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
                        {l}
                     </button>
                   ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
                {activeTab === 'summary' && (
                  <div className="space-y-10 animate-in fade-in">
                    <div className="bg-indigo-50 p-8 rounded-[40px] border border-indigo-100 relative overflow-hidden group">
                      <Sparkles className="absolute top-0 right-0 p-6 opacity-10" size={80} />
                      <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-4 italic flex items-center gap-2">The Verdict</h4>
                      <p className="text-indigo-800 font-bold text-xl leading-relaxed italic">"{selectedApplication?.oneSentenceVerdict || "Reviewing..."}"</p>
                    </div>

                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Target size={14} className="text-indigo-600" /> Infrastructure Alignment</h4>
                       <div className="h-64 bg-slate-50 rounded-[40px] p-8 border border-slate-100">
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
                    {(Object.entries(selectedApplication?.answers || {}) as [string, CandidateAnswer][]).map(([qId, ans], idx) => (
                      <div key={qId} className="p-6 bg-white border border-slate-100 rounded-[32px] space-y-4 shadow-sm group">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black uppercase text-slate-400">10-Bit Step #{idx + 1} • {ans.timeTaken}s</span>
                          {ans.timeTaken < 5 && <span className="text-[8px] font-black uppercase text-amber-500 bg-amber-50 px-2 py-1 rounded">High Speed Anomaly</span>}
                        </div>
                        <p className="text-sm font-bold text-slate-700 italic">"{ans.value}"</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'resume' && (
                   <div className="space-y-8 animate-in slide-in-from-right-8">
                      <div className="bg-slate-900 text-white p-10 rounded-[48px] shadow-2xl space-y-8 relative overflow-hidden">
                        <FileText className="absolute top-0 right-0 p-8 opacity-10" size={100} />
                        <h4 className="text-2xl font-black tracking-tight mb-8 italic">Truth Logic Proofs</h4>
                        <ul className="space-y-6">
                           {selectedCandidate.parsedResume?.timeline.map((item, i) => (
                             <li key={i} className="flex gap-6 border-b border-white/5 pb-6">
                               <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                               <div className="space-y-2">
                                 <p className="text-xs font-black uppercase tracking-widest text-indigo-400">{item.company}</p>
                                 <p className="text-sm font-medium text-slate-300 italic">"{item.description}"</p>
                                 {item.aiNote && <p className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">✔ RoleScreen Verified: {item.aiNote}</p>}
                               </div>
                             </li>
                           ))}
                        </ul>
                      </div>
                   </div>
                )}
              </div>

              <div className="p-8 border-t border-slate-100 grid grid-cols-2 gap-4 bg-white shadow-inner">
                <button className="py-5 bg-indigo-50 text-indigo-700 rounded-[28px] font-black text-[10px] uppercase tracking-widest border-2 border-indigo-100 hover:bg-indigo-100 transition-all">
                   RoleScreen Verified Badge
                </button>
                <button onClick={() => updateStatus(selectedCandidate.id, CandidateStatus.INTERVIEW_SCHEDULED)} className="py-5 bg-slate-900 text-white rounded-[28px] font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-slate-800">
                  <CalendarDays size={18} className="inline-block mr-2"/> Schedule Interview
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
