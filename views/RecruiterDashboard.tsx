
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, Users, PlusCircle, 
  ChevronRight, Zap, Globe, ArrowUpRight, Clock, Target, 
  ShieldCheck, Search, Filter, Activity, Terminal
} from 'lucide-react';
import { Job, Candidate, CandidateStatus } from '../types';

interface Props {
  jobs: Job[];
  candidates: Candidate[];
  role: 'recruiter' | 'candidate';
}

const RecruiterDashboard: React.FC<Props> = ({ jobs, candidates }) => {
  const navigate = useNavigate();

  const totalApplications = candidates.reduce((acc, c) => acc + c.appliedJobs.length, 0);
  const qualifiedCandidates = candidates.filter(c => 
    c.appliedJobs.some(aj => aj.suitability !== undefined && aj.suitability >= 70)
  ).length;

  const stats = [
    { label: 'Active Gates', val: jobs.length, icon: <Terminal className="text-indigo-600" />, trend: '+1', up: true, color: 'bg-indigo-50' },
    { label: '10-Bit Screens', val: totalApplications || 1204, icon: <Zap className="text-emerald-600" />, trend: '+14%', up: true, color: 'bg-emerald-50' },
    { label: 'Verification Rate', val: '88%', icon: <ShieldCheck className="text-orange-600" />, trend: '2.4%', up: true, color: 'bg-orange-50' },
    { label: 'Review Latency', val: '0.4h', icon: <Clock className="text-pink-600" />, trend: '-0.2h', up: true, color: 'bg-pink-50' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">RoleScreen <span className="text-indigo-600">Leaderboard</span></h2>
          <p className="text-slate-500 font-medium text-lg italic">Verification Infrastructure Status: <span className="text-emerald-500 font-black">Active</span></p>
        </div>
        <button 
          onClick={() => navigate('/jobs/create')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-5 rounded-[24px] font-black text-lg shadow-2xl transition-all flex items-center gap-3 hover:-translate-y-1"
        >
          <PlusCircle size={24} /> Deploy New Gate
        </button>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col gap-6 group hover:shadow-xl transition-all">
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
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3">
              <Zap className="text-indigo-600" /> High-Verity Pipelines
            </h3>
          </div>
          
          <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-xl">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Gate</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Infrastructure</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Shortlist</th>
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
                        <p className="font-black text-slate-800 text-lg group-hover:text-indigo-600 leading-tight italic">{job.title}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{job.company}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-1.5 text-indigo-600 font-black text-[10px] uppercase">
                          <Target size={14} /> Threshold: {job.cutoffScore}%
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <span className="bg-slate-900 text-white text-xs px-4 py-1.5 rounded-xl font-black shadow-lg">
                            {jobCount}
                          </span>
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

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 text-white p-10 rounded-[48px] shadow-2xl space-y-8 relative overflow-hidden group">
            <Globe className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-all" size={120} />
            <div className="relative z-10 space-y-2">
              <h4 className="text-2xl font-black tracking-tight italic">Intersection Engine Status</h4>
              <p className="text-slate-400 text-xs font-medium">Verified proof for every candidate claim.</p>
            </div>
            <div className="space-y-6 relative z-10">
               <div className="h-40 bg-white/5 rounded-3xl p-6 flex items-center justify-center">
                  <Activity size={80} className="text-indigo-500/20 animate-pulse" />
               </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed italic relative z-10">
              Your "Truth Questions" have blocked <span className="text-white font-black">12 suspicious applicants</span> from entering the manual review stage today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
