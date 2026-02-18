
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, ChevronRight, Zap, ArrowUpRight, Clock, Target, 
  ShieldCheck, Activity, Terminal, LayoutGrid, Sparkles, Globe
} from 'lucide-react';
import { Job, Candidate } from '../types';

interface Props {
  jobs: Job[];
  candidates: Candidate[];
  role: 'recruiter' | 'candidate';
}

const RecruiterDashboard: React.FC<Props> = ({ jobs, candidates }) => {
  const navigate = useNavigate();

  const totalApplications = candidates.reduce((acc, c) => acc + c.appliedJobs.length, 0);

  const stats = [
    { label: 'Infrastructure', val: jobs.length, icon: <Terminal className="text-indigo-500" />, trend: '+1', up: true },
    { label: 'Screens Active', val: totalApplications, icon: <Zap className="text-indigo-500" />, trend: '+14%', up: true },
    { label: 'Verity Rate', val: '92%', icon: <ShieldCheck className="text-indigo-500" />, trend: '2.4%', up: true },
    { label: 'Latency', val: '0.4h', icon: <Clock className="text-indigo-500" />, trend: '-0.2h', up: true },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 font-sans">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500">Infrastructure Status: Active</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">RoleScreen <span className="text-indigo-600">Leaderboard</span></h2>
        </div>
        <button 
          onClick={() => navigate('/jobs/create')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center gap-3 active:scale-95"
        >
          <PlusCircle size={18} /> Deploy Gate
        </button>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-zinc-900/50 p-8 rounded-[32px] border border-white/5 flex flex-col gap-6 hover:border-indigo-500/30 transition-all">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">{s.icon}</div>
              <span className={`text-[9px] font-black ${s.up ? 'text-emerald-500' : 'text-red-500'} px-2 py-1 bg-white/5 rounded-lg`}>
                {s.trend}
              </span>
            </div>
            <div>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">{s.label}</p>
              <p className="text-3xl font-black text-white tracking-tighter italic">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3 italic">
              <Activity size={16} className="text-indigo-600" /> Live Pipelines
            </h3>
          </div>
          
          <div className="bg-zinc-900 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/5">
                <tr>
                  <th className="px-8 py-6 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Active Gate</th>
                  <th className="px-8 py-6 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Threshold</th>
                  <th className="px-8 py-6 text-[9px] font-black text-zinc-500 uppercase tracking-widest text-center">Talent</th>
                  <th className="px-8 py-6 text-[9px] font-black text-zinc-500 uppercase tracking-widest"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {jobs.map(job => {
                  const jobCount = candidates.filter(c => c.appliedJobs.some(aj => aj.jobId === job.id)).length;
                  return (
                    <tr 
                      key={job.id} 
                      className="hover:bg-white/[0.03] transition-all cursor-pointer group" 
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      <td className="px-8 py-6">
                        <p className="font-black text-white text-lg group-hover:text-indigo-500 leading-tight italic uppercase tracking-tighter">{job.title}</p>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{job.company}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-indigo-400 font-black text-[9px] uppercase tracking-widest">
                          <Target size={12} /> Cutoff: {job.cutoffScore}%
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <span className="bg-indigo-600 text-white text-[10px] px-3 py-1 rounded-full font-black">
                            {jobCount}
                          </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <ChevronRight size={18} className="text-zinc-700 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-indigo-600 text-white p-10 rounded-[40px] shadow-2xl space-y-10 relative overflow-hidden group">
            <Globe className="absolute top-0 right-0 p-8 opacity-10" size={150} />
            <div className="relative z-10 space-y-2">
              <h4 className="text-2xl font-black tracking-tighter italic uppercase leading-tight">Intelligence Engine</h4>
              <p className="text-indigo-200 text-xs font-bold leading-relaxed">Cross-proof verification active across 12 nodes globally.</p>
            </div>
            <div className="relative z-10 p-6 bg-white/10 rounded-3xl border border-white/10 flex items-center justify-center">
               <Activity size={40} className="text-white opacity-40 animate-pulse" />
            </div>
            <p className="text-[10px] text-indigo-100 leading-relaxed italic relative z-10 font-bold tracking-widest uppercase">
              The system blocked <span className="text-white font-black underline underline-offset-4 decoration-2">12 Suspicious Entities</span> today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
