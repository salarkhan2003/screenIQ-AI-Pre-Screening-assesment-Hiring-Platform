
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, Filter, ArrowRight, Target, Shield, Zap } from 'lucide-react';
import { Job } from '../types';

interface Props {
  jobs: Job[];
}

const CandidateBrowse: React.FC<Props> = ({ jobs }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         j.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         j.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'All' || j.department === filterDept;
    return matchesSearch && matchesDept;
  });

  const departments = ['All', ...Array.from(new Set(jobs.map(j => j.department)))];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="space-y-6">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-black text-slate-800 tracking-tighter leading-tight">
            Find Your Next <span className="text-indigo-600">Verified</span> Move.
          </h2>
          <p className="text-slate-500 text-xl font-medium mt-4">
            Skip the resume black hole. Apply through role-based assessments and let your skills speak.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-[32px] shadow-xl border border-slate-100">
          <div className="flex-1 flex items-center gap-4 px-4 py-2 border-r border-slate-100">
            <Search className="text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by role, company, or keyword..."
              className="w-full bg-transparent outline-none font-bold text-slate-800 placeholder:text-slate-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 px-4 py-2">
            <Filter className="text-slate-400" size={18} />
            <select 
              className="bg-transparent outline-none font-black text-xs uppercase tracking-widest text-slate-600 appearance-none cursor-pointer"
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
            >
              {departments.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredJobs.map(job => (
          <div key={job.id} className="bg-white p-8 rounded-[48px] shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
               <Building2 size={120} />
            </div>
            
            <div className="relative z-10 flex-1 space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border border-indigo-100">{job.department}</span>
                  <span className="bg-slate-50 text-slate-500 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest">{job.experienceLevel}</span>
                </div>
              </div>

              <div>
                <p className="text-indigo-600 font-black text-sm uppercase tracking-widest mb-1">{job.company}</p>
                <h3 className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight mb-2">{job.title}</h3>
                <p className="text-slate-400 text-sm font-medium line-clamp-3 leading-relaxed">{job.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {job.skills.map(s => (
                  <span key={s} className="px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-tighter">● {s}</span>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Target size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gate Cutoff</p>
                    <p className="text-sm font-black text-slate-800">{job.cutoffScore}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Shield size={16} className="text-indigo-400" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Verified Only</span>
                </div>
              </div>

              <button 
                onClick={() => navigate(`/assessment/${job.id}`)}
                className="w-full py-5 bg-slate-900 text-white rounded-[28px] font-black text-lg hover:bg-indigo-600 shadow-xl transition-all flex items-center justify-center gap-3 group/btn"
              >
                Start Verification <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <Search size={48} className="mx-auto text-slate-200" />
          <p className="text-slate-400 font-bold uppercase text-sm tracking-widest">No roles matching your criteria were found.</p>
        </div>
      )}
    </div>
  );
};

export default CandidateBrowse;
