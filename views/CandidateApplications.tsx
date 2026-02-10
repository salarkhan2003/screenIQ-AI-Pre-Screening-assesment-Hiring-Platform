
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, CheckCircle2, XCircle, Clock, ExternalLink, 
  Target, ShieldCheck, Trophy, ArrowRight, BrainCircuit,
  Zap, Bookmark, Activity, Sparkles, UserCheck
} from 'lucide-react';
import { Candidate, Job, CandidateStatus } from '../types';

interface Props {
  jobs: Job[];
  candidates: Candidate[];
  currentUserEmail: string;
}

const CandidateApplications: React.FC<Props> = ({ jobs, candidates, currentUserEmail }) => {
  const navigate = useNavigate();
  
  const currentCandidate = candidates.find(c => c.email === currentUserEmail) || candidates[0];
  const applications = currentCandidate?.appliedJobs || [];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
           <UserCheck size={160} />
        </div>
        <div className="relative z-10 space-y-4">
          <h2 className="text-5xl font-black text-slate-800 tracking-tighter">Your <span className="text-indigo-600">Skill Passport</span></h2>
          <p className="text-slate-500 text-xl font-medium">Verified proof of expertise across {applications.length} pipelines.</p>
        </div>
        <div className="relative z-10 flex gap-4">
          <div className="bg-emerald-50 p-6 rounded-[32px] border border-emerald-100 text-center">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Avg Score</p>
            <p className="text-3xl font-black text-emerald-700">88%</p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-[32px] border border-indigo-100 text-center">
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Verification</p>
            <p className="text-3xl font-black text-indigo-700">Elite</p>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3">
            <Bookmark size={24} className="text-indigo-600" /> Active Tracking
          </h3>

          <div className="space-y-6">
            {applications.length > 0 ? applications.map(app => {
              const job = jobs.find(j => j.id === app.jobId);
              if (!job) return null;

              return (
                <div key={app.jobId} className="bg-white rounded-[40px] border border-slate-100 shadow-lg p-8 flex flex-col md:flex-row items-center gap-8 hover:shadow-2xl transition-all group">
                  <div className="w-20 h-20 bg-slate-900 text-white rounded-[24px] flex items-center justify-center text-3xl font-black shadow-xl shrink-0 group-hover:scale-110 transition-transform">
                    {job.company.charAt(0)}
                  </div>
                  
                  <div className="flex-1 space-y-2 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                      <p className="text-indigo-600 font-black text-xs uppercase tracking-widest">{job.company}</p>
                      <h4 className="text-2xl font-black text-slate-800 tracking-tight">{job.title}</h4>
                      <StatusPill status={app.status} />
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center gap-10 shrink-0">
                    <div className="text-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Verified Score</p>
                      <p className="text-2xl font-black text-indigo-600">{app.score || 0}%</p>
                    </div>
                    <button 
                      onClick={() => navigate('/feedback', { state: { result: app, job, passed: (app.score || 0) >= job.cutoffScore } })}
                      className="p-5 bg-slate-50 text-slate-400 rounded-3xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                    >
                      <ExternalLink size={20} />
                    </button>
                  </div>
                </div>
              );
            }) : (
              <div className="p-20 bg-white rounded-[40px] border-4 border-dashed border-slate-100 text-center space-y-4">
                <Briefcase size={48} className="mx-auto text-slate-200" />
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No verified applications found.</p>
                <button onClick={() => navigate('/browse')} className="text-indigo-600 font-black text-xs uppercase tracking-widest underline underline-offset-4">Browse Active Pipelines</button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3">
            <Activity size={24} className="text-indigo-600" /> Insights
          </h3>

          <div className="bg-slate-900 text-white p-10 rounded-[48px] shadow-2xl space-y-8 relative overflow-hidden group">
            <Sparkles className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-all" size={100} />
            <div className="relative z-10 space-y-2">
              <h4 className="text-2xl font-black tracking-tight">AI Talent Ranking</h4>
              <p className="text-slate-400 text-xs font-medium italic">"Your logical efficiency remains in the top 5% of all applicants."</p>
            </div>
            
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technical Mastery</span>
                <span className="text-sm font-black text-indigo-400">Elite</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[92%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusPill = ({ status }: { status: CandidateStatus }) => {
  const styles: Record<CandidateStatus, string> = {
    [CandidateStatus.APPLIED]: 'bg-indigo-50 text-indigo-700',
    [CandidateStatus.SHORTLISTED]: 'bg-emerald-50 text-emerald-700',
    [CandidateStatus.REJECTED]: 'bg-red-50 text-red-700',
    [CandidateStatus.INTERVIEW_SCHEDULED]: 'bg-amber-50 text-amber-700',
    [CandidateStatus.INVITED_TO_ASSESSMENT]: 'bg-orange-50 text-orange-700',
    [CandidateStatus.DRAFT]: 'bg-slate-50 text-slate-500',
    [CandidateStatus.ASSESSMENT_PENDING]: 'bg-blue-50 text-blue-700',
    [CandidateStatus.ASSESSMENT_COMPLETED]: 'bg-indigo-50 text-indigo-700',
    [CandidateStatus.ON_HOLD]: 'bg-slate-100 text-slate-600',
  };

  return (
    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-xl border border-transparent ${styles[status]}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};

export default CandidateApplications;
