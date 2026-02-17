
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
    { label: 'Screens Active', val: totalApplications || 412, icon: <Zap className="text-indigo-500" />, trend: '+14%', up: true },
    { label: 'Verity Rate', val: '92%', icon: <ShieldCheck className="text-indigo-500" />, trend: '2.4%', up: true },
    { label: 'Latency', val: '0.4h', icon: <Clock className="text-indigo-500" />, trend: '-0.2h', up: true },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h2 className="text-5xl font-[900] text-white tracking-tighter uppercase italic leading-none">RoleScreen <span className="text-indigo-600">Leaderboard</span></h2>
          <p className="text-zinc-500 font-bold text-lg mt-2">Verification Infrastructure Status: <span className="text-emerald-500">Active</span></p>
        </div>
        <button 
          onClick={() => navigate('/jobs/create')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-6 rounded-[32px] font-black text-xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] transition-all flex items-center gap-4 active:scale-95"
        >
          <PlusCircle size={28} /> Deploy Gate
        </button>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(s => (
          <div key={s.label} className="glass-ios-dark p-10 rounded-[48px] border border-white/5 flex flex-col gap-8 group hover:border-indigo-500/30 transition-all ios-3d-card">
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 bg-white/5 rounded-[20px] flex items-center justify-center group-hover:scale-110 transition-transform">{s.icon}</div>
              <span className={`text-[10px] font-black ${s.up ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'} px-3 py-1.5 rounded-full flex items-center gap-1`}>
                <ArrowUpRight size={12} /> {s.trend}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-2">{s.label}</p>
              <p className="text-4xl font-[900] text-white tracking-tighter italic">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-4 italic">
              <Zap className="text-indigo-600" /> Active Pipelines
            </h3>
          </div>
          
          <div className="glass-ios-dark rounded-[56px] border border-white/5 overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-10 py-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Gate</th>
                  <th className="px-10 py-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Threshold</th>
                  <th className="px-10 py-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Talent Count</th>
                  <th className="px-10 py-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest"></th>
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
                      <td className="px-10 py-8">
                        <p className="font-black text-white text-xl group-hover:text-indigo-500 leading-tight italic uppercase tracking-tighter">{job.title}</p>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] mt-2">{job.company}</p>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase">
                          <Target size={14} /> Gating: {job.cutoffScore}%
                        </div>
                      </td>
                      <td className="px-10 py-8 text-center">
                         <span className="bg-indigo-600 text-white text-xs px-5 py-2 rounded-full font-black shadow-lg">
                            {jobCount}
                          </span>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <ChevronRight size={24} className="text-zinc-700 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-indigo-600 text-white p-12 rounded-[56px] shadow-2xl space-y-12 relative overflow-hidden group ios-3d-card h-full">
            <Globe className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-all" size={200} />
            <div className="relative z-10 space-y-4">
              <h4 className="text-3xl font-[900] tracking-tighter italic uppercase leading-none">Intelligence Engine Status</h4>
              <p className="text-indigo-200 text-sm font-bold">Verified proof for every candidate claim in real-time.</p>
            </div>
            <div className="relative z-10 h-48 bg-white/10 rounded-[40px] border border-white/10 flex items-center justify-center backdrop-blur-md">
               <Activity size={80} className="text-white opacity-20 animate-pulse" />
            </div>
            <p className="text-[11px] text-indigo-100 leading-relaxed italic relative z-10 font-bold tracking-widest uppercase">
              Verified Gating has blocked <span className="text-white font-black underline underline-offset-4 decoration-2">12 Suspicious Entities</span> today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
