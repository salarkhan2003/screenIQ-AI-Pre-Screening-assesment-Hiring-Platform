
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, XCircle, BarChart3, ArrowRight, Star, ExternalLink, 
  Trophy, BrainCircuit, Activity, ShieldCheck, BookOpen, ChevronRight,
  Sparkles
} from 'lucide-react';

const CandidateFeedback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, job, passed } = location.state || {};

  if (!result) return <div className="p-20 text-center">No results to display.</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 animate-in zoom-in-95 duration-700 pb-20">
      <div className="text-center mb-10 space-y-4">
        <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-2xl transition-transform hover:scale-110 ${passed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
          {passed ? <Trophy size={48} /> : <XCircle size={48} />}
        </div>
        <h2 className="text-4xl font-black text-slate-800 tracking-tighter">
          {passed ? 'Verification Success!' : 'Assessment Complete'}
        </h2>
        <p className="text-slate-500 text-lg max-w-lg mx-auto font-medium">
          {passed 
            ? `Excellent performance. You beat the ${job.cutoffScore}% threshold and your profile is now prioritized in the recruiter dashboard.` 
            : `You didn't reach the ${job.cutoffScore}% threshold for this specific role, but you've earned a Verified Skill Report to help you grow.`}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Report */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-10 space-y-10">
              <div className="grid grid-cols-2 gap-6">
                <ReportCard label="Accuracy Score" value={`${result.score}%`} icon={<CheckCircle size={16} className="text-indigo-600" />} />
                <ReportCard label="Integrity Rating" value={`${result.integrityScore}%`} icon={<ShieldCheck size={16} className="text-emerald-600" />} />
              </div>

              <div className="space-y-6">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <BarChart3 size={18} className="text-indigo-600" /> Professional Skill Radar
                </h4>
                <div className="space-y-5">
                  {Object.entries(result.skillBreakdown || { Technical: 85, Logic: 75, Domain: 80 }).map(([name, val]: [string, any]) => (
                    <div key={name} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{name}</span>
                        <span className="text-xs font-black text-indigo-600">{val}%</span>
                      </div>
                      <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                        <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${val}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                  {/* Fixed: Added missing Sparkles icon component */}
                  <Sparkles size={80} className="text-indigo-900" />
                </div>
                <h4 className="font-black text-indigo-900 mb-3 flex items-center gap-2 uppercase text-xs tracking-widest">
                  <Star size={16} /> AI Performance Insight
                </h4>
                <p className="text-indigo-800 leading-relaxed text-sm font-medium italic relative z-10">
                  "{result.feedback}"
                </p>
              </div>
            </div>
          </div>

          {/* Study Suggestions (Candidate Value) */}
          <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 p-10 space-y-6">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <BookOpen size={18} className="text-emerald-600" /> Personalized Learning Path
            </h4>
            <div className="grid gap-4">
              {result.studySuggestions?.map((topic: string, i: number) => (
                <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:border-emerald-300 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-white border-2 border-slate-100 rounded-lg flex items-center justify-center font-black text-slate-400 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all">
                      {i + 1}
                    </div>
                    <span className="font-bold text-slate-700">{topic}</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">Topics generated by ScreenIQ AI based on your session gaps.</p>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-slate-800 text-white p-8 rounded-[40px] shadow-2xl space-y-6">
            <h4 className="text-xl font-black tracking-tight leading-tight">Your ScreenIQ Skill Passport</h4>
            <p className="text-slate-300 text-xs font-medium leading-relaxed">This verification score is valid for 6 months. Add it to your resume to skip screenings at other verified partners.</p>
            <button className="w-full py-4 bg-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
              Add to Passport <ExternalLink size={16} />
            </button>
          </div>

          <div className="bg-indigo-50 p-8 rounded-[40px] border border-indigo-100 space-y-6">
             <div className="flex flex-col items-center text-center gap-3">
               <Activity size={32} className="text-indigo-600" />
               <p className="text-sm font-bold text-indigo-900">Adaptive Efficiency</p>
               <p className="text-xs text-indigo-700 font-medium">You solved questions 22% faster than the median applicant in this pipeline.</p>
             </div>
          </div>

          <button 
            onClick={() => navigate('/')}
            className="w-full py-5 border-4 border-slate-100 rounded-[28px] font-black text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
          >
            Browse More Jobs <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ReportCard = ({ label, value, icon }: any) => (
  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center flex flex-col items-center justify-center group hover:bg-white hover:border-indigo-100 transition-all">
    <div className="p-2 bg-white rounded-xl shadow-sm mb-3 group-hover:scale-110 transition-transform">{icon}</div>
    <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">{label}</p>
    <p className="text-3xl font-black text-slate-800">{value}</p>
  </div>
);

export default CandidateFeedback;
