
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, Target, ShieldCheck, Zap, ArrowRight, 
  BrainCircuit, Activity, ChevronRight, Globe, Sparkles
} from 'lucide-react';
import { Candidate, Job, CandidateStatus } from '../types';

interface Props {
  jobs: Job[];
  candidates: Candidate[];
  currentUserEmail: string;
}

const CandidateHome: React.FC<Props> = ({ jobs, candidates, currentUserEmail }) => {
  const navigate = useNavigate();
  
  const currentCandidate = candidates.find(c => c.email === currentUserEmail) || candidates[0];
  const applications = currentCandidate?.appliedJobs || [];
  
  // Stats
  const activePipelines = applications.filter(a => a.status === CandidateStatus.APPLIED || a.status === CandidateStatus.INTERVIEW_SCHEDULED).length;
  const verifiedSkills = currentCandidate?.parsedResume?.heatmapKeywords.length || 0;
  
  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Dynamic Welcome Hero */}
      <header className="bg-slate-900 rounded-[48px] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
        <Globe className="absolute top-0 right-0 p-10 opacity-10" size={240} />
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-2 bg-white/10 w-fit px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              <Sparkles className="text-indigo-400" size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Global Ranking: Elite</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight">
              Welcome back, <br />
              <span className="text-indigo-400">{currentCandidate?.name.split(' ')[0] || 'User'}.</span>
            </h2>
            <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-sm">
              Your verified skills are currently visible to <span className="text-white font-bold">12 elite employers</span>. You have 1 interview pending.
            </p>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => navigate('/browse')}
                className="px-8 py-4 bg-indigo-600 text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-900/40 hover:bg-indigo-700 transition-all flex items-center gap-2 group"
              >
                Find New Roles <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <StatsCard label="Verified Skills" val={verifiedSkills} icon={<ShieldCheck className="text-emerald-400" />} />
            <StatsCard label="Active Funnels" val={activePipelines} icon={<Zap className="text-indigo-400" />} />
            <StatsCard label="Hiring Rank" val="Top 12%" icon={<Trophy className="text-orange-400" />} />
            <StatsCard label="Interview Rate" val="84%" icon={<Target className="text-pink-400" />} />
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Verification Timeline / Activity */}
        <div className="lg:col-span-8 space-y-8">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3">
            <Activity className="text-indigo-600" /> Active Verification Funnels
          </h3>
          
          <div className="space-y-6">
            {applications.length > 0 ? applications.slice(0, 3).map(app => {
              const job = jobs.find(j => j.id === app.jobId);
              if (!job) return null;
              
              return (
                <div key={app.jobId} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-lg group hover:shadow-2xl transition-all cursor-pointer" onClick={() => navigate('/applications')}>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl shrink-0 group-hover:scale-110 transition-transform">
                      {job.company.charAt(0)}
                    </div>
                    
                    <div className="flex-1 space-y-1 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-3">
                        <h4 className="text-xl font-black text-slate-800 tracking-tight">{job.title}</h4>
                        <StatusPill status={app.status} />
                      </div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{job.company} • Stage: {app.status.replace(/_/g, ' ')}</p>
                    </div>

                    <div className="flex gap-4 items-center shrink-0">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Elite Score</p>
                        <p className="text-xl font-black text-indigo-600">{app.score || 0}%</p>
                      </div>
                      <ChevronRight className="text-slate-200 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="p-16 bg-white rounded-[40px] border border-slate-100 text-center space-y-4">
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No active applications found.</p>
              </div>
            )}
            
            <button 
              onClick={() => navigate('/applications')}
              className="w-full py-5 bg-slate-50 border-2 border-slate-100 text-slate-500 rounded-[28px] font-black text-xs uppercase tracking-widest hover:bg-white hover:text-indigo-600 transition-all"
            >
              View Full Application History
            </button>
          </div>
        </div>

        {/* Recommended Path / Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3">
            <BrainCircuit className="text-indigo-600" /> AI Recommendations
          </h3>

          <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl space-y-8 relative overflow-hidden group">
            <Sparkles className="absolute top-0 right-0 p-8 opacity-5 text-indigo-600 group-hover:scale-125 transition-all" size={100} />
            
            <div className="relative z-10 space-y-2">
              <h4 className="text-xl font-black tracking-tight leading-none text-slate-800">Skill Gap Detected</h4>
              <p className="text-slate-500 text-xs font-medium italic leading-relaxed">
                "Based on your recent Senior Frontend assessment, strengthening your 'System Design' could increase your Match Score by 15%."
              </p>
            </div>

            <div className="space-y-4 relative z-10">
              <RecommendationRow label="System Design Level 1" status="Suggested" />
              <RecommendationRow label="Cloud Architecture" status="Ready to Verify" />
            </div>

            <div className="pt-4 relative z-10">
              <button className="w-full py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-100 transition-all">
                Practice Domain Tests
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ label, val, icon }: any) => (
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[32px] space-y-2 group hover:bg-white/10 transition-all cursor-default">
    <div className="p-2 bg-white/5 rounded-xl w-fit group-hover:scale-110 transition-transform">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-white tracking-tighter">{val}</p>
    </div>
  </div>
);

const RecommendationRow = ({ label, status }: any) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
    <span className="text-xs font-bold text-slate-700">{label}</span>
    <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest px-2 py-1 bg-white rounded-lg border border-indigo-100">{status}</span>
  </div>
);

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

export default CandidateHome;
