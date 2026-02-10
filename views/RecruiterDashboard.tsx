
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, Users, CheckCircle, PlusCircle, 
  ChevronRight, Zap, Globe, ArrowUpRight, Clock, Target, 
  Activity, ShieldCheck, Search, Filter, Mail, MoreHorizontal
} from 'lucide-react';
import { Job, Candidate, CandidateStatus } from '../types';

interface Props {
  jobs: Job[];
  candidates: Candidate[];
  role: 'recruiter' | 'candidate';
}

const RecruiterDashboard: React.FC<Props> = ({ jobs, candidates, role }) => {
  const navigate = useNavigate();

  // Pulse Analytics Calculations
  const totalApplications = candidates.reduce((acc, c) => acc + c.appliedJobs.length, 0);
  const qualifiedCandidates = candidates.filter(c => 
    c.appliedJobs.some(aj => aj.score !== undefined && aj.score >= 70)
  ).length;
  const qualifiedRate = totalApplications > 0 ? Math.round((qualifiedCandidates / totalApplications) * 100) : 0;

  const stats = [
    { label: 'Active Postings', val: jobs.length, icon: <Briefcase className="text-indigo-600" />, trend: '+2', up: true, color: 'bg-indigo-50' },
    { label: 'Total Screened', val: totalApplications || 452, icon: <Users className="text-emerald-600" />, trend: '+12%', up: true, color: 'bg-emerald-50' },
    { label: 'Qualified Rate', val: `${qualifiedRate || 24}%`, icon: <Target className="text-orange-600" />, trend: '2.4%', up: true, color: 'bg-orange-50' },
    { label: 'Avg Time-to-Shortlist', val: '1.8d', icon: <Clock className="text-pink-600" />, trend: '-0.4d', up: true, color: 'bg-pink-50' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Infrastructure Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">Hiring Intelligence Pulse</h2>
          <p className="text-slate-500 font-medium text-lg">Your automated talent infrastructure is running at <span className="text-indigo-600 font-black">94% efficiency</span>.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/jobs/create')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-5 rounded-[24px] font-black text-lg shadow-2xl transition-all flex items-center gap-3 hover:-translate-y-1 active:scale-95"
          >
            <PlusCircle size={24} /> New Pipeline
          </button>
        </div>
      </header>

      {/* Pulse KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col gap-6 group hover:shadow-xl transition-all cursor-default">
            <div className="flex justify-between items-start">
              <div className={`p-4 rounded-[20px] ${s.color} group-hover:scale-110 transition-transform`}>{s.icon}</div>
              <span className={`text-[10px] font-black ${s.up ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'} px-2 py-1 rounded-lg flex items-center gap-1`}>
                <ArrowUpRight size={12} /> {s.trend}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{s.label}</p>
              <p className="text-3xl font-black text-slate-800 tracking-tighter">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Active Infrastructure Table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3">
              <Zap className="text-indigo-600" /> Active Infrastructure
            </h3>
            <div className="flex gap-2">
               <button className="p-2 bg-white rounded-lg border border-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"><Search size={16} /></button>
               <button className="p-2 bg-white rounded-lg border border-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"><Filter size={16} /></button>
            </div>
          </div>
          
          <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-xl">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role Strategy</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Gating Control</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Elite Queue</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map(job => {
                  const jobCount = candidates.filter(c => c.appliedJobs.some(aj => aj.jobId === job.id)).length;
                  return (
                    <tr 
                      key={job.id} 
                      className="hover:bg-indigo-50/30 transition-all cursor-pointer group" 
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      <td className="px-8 py-6">
                        <p className="font-black text-slate-800 text-lg group-hover:text-indigo-600 transition-colors leading-tight">{job.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{job.department}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                          <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">{job.experienceLevel}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-indigo-600 font-black text-[10px] uppercase">
                            <Target size={14} /> {job.cutoffScore}% Threshold
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-500 font-black text-[9px] uppercase tracking-tighter">
                            <ShieldCheck size={12} /> Proctoring Enabled
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex flex-col items-center">
                          <span className="bg-slate-900 text-white text-xs px-4 py-1.5 rounded-xl font-black shadow-lg">
                            {jobCount}
                          </span>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1.5">Screened</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <ChevronRight size={20} className="text-slate-200 group-hover:text-indigo-400 group-hover:translate-x-1 inline-block transition-all" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Market Benchmark ROI */}
        <div className="lg:col-span-4 space-y-6">
           <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3 px-2">
            <Globe className="text-indigo-600" /> ROI & Benchmarks
          </h3>
          <div className="bg-slate-900 text-white p-10 rounded-[48px] shadow-2xl space-y-8 relative overflow-hidden group">
            <Globe className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-all" size={120} />
            
            <div className="relative z-10 space-y-2">
              <h4 className="text-2xl font-black tracking-tight leading-none">Global Talent ROI</h4>
              <p className="text-slate-400 text-xs font-medium">Verified pool quality vs. Market average.</p>
            </div>

            <div className="space-y-6 relative z-10">
              <BenchmarkRow label="Technical Accuracy" score={88} benchmark={62} />
              <BenchmarkRow label="Logic Efficiency" score={82} benchmark={58} />
              <BenchmarkRow label="Integrity Rating" score={98} benchmark={92} />
            </div>

            <div className="pt-6 border-t border-white/10 relative z-10 space-y-4">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Your current top candidates are in the <span className="text-white font-black">top 12th percentile</span> globally based on ScreenIQ verification logs.
              </p>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Activity size={14} className="text-indigo-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Efficiency Gain</span>
                </div>
                <p className="text-xl font-black text-indigo-400">3.2x <span className="text-xs font-medium text-slate-400 tracking-normal ml-1">Faster Screening</span></p>
              </div>
            </div>
          </div>

          {/* Controls & Automation Settings */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-6">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600"><CheckCircle size={20}/></div>
                 <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Auto-Reject Active</p>
               </div>
               <button className="text-slate-300 hover:text-indigo-600"><MoreHorizontal size={16} /></button>
             </div>
             <p className="text-[10px] text-slate-500 leading-relaxed font-medium italic">
               "Polite rejection emails have been automatically queued for 12 candidates scoring below your 75% threshold today."
             </p>
             <button className="w-full py-3 bg-slate-50 text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all">
                Adjust Threshold Dial
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BenchmarkRow = ({ label, score, benchmark }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end">
      <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">{label}</span>
      <span className="text-xs font-black text-indigo-400">+{score - benchmark}% ahead</span>
    </div>
    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
      <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${score}%` }}></div>
    </div>
  </div>
);

export default RecruiterDashboard;
