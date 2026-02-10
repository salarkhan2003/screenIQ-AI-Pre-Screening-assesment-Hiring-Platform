
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { 
  TrendingUp, Users, Target, Clock, Zap, Globe, 
  BrainCircuit, ShieldCheck, ArrowUpRight, ArrowDownRight,
  Filter, Download, Calendar
} from 'lucide-react';
import { Job, Candidate } from '../types';

interface Props {
  jobs: Job[];
  candidates: Candidate[];
}

const funnelData = [
  { name: 'Applied', value: 450, fill: '#4f46e5' },
  { name: 'Screened', value: 310, fill: '#6366f1' },
  { name: 'Qualified', value: 120, fill: '#818cf8' },
  { name: 'Interview', value: 45, fill: '#a5b4fc' },
  { name: 'Hired', value: 12, fill: '#c7d2fe' },
];

const volumeData = [
  { day: 'Mon', count: 12 },
  { day: 'Tue', count: 45 },
  { day: 'Wed', count: 32 },
  { day: 'Thu', count: 67 },
  { day: 'Fri', count: 89 },
  { day: 'Sat', count: 45 },
  { day: 'Sun', count: 21 },
];

const marketBenchmarkData = [
  { subject: 'Technical', A: 88, B: 62, fullMark: 100 },
  { subject: 'Logic', A: 82, B: 58, fullMark: 100 },
  { subject: 'Speed', A: 91, B: 45, fullMark: 100 },
  { subject: 'Integrity', A: 98, B: 92, fullMark: 100 },
  { subject: 'Consistency', A: 75, B: 60, fullMark: 100 },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Analytics: React.FC<Props> = ({ jobs, candidates }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Dynamic Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">Hiring Pulse</h2>
          <p className="text-slate-500 font-medium text-lg">Predictive intelligence for your talent infrastructure.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-200">
            <Calendar size={14} /> Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
            <Download size={14} /> Export Report
          </button>
        </div>
      </header>

      {/* Pulse KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          label="Active Postings" 
          value={jobs.length} 
          trend="+2" 
          up={true} 
          icon={<TrendingUp size={20} className="text-indigo-600" />} 
          color="bg-indigo-50" 
        />
        <KPICard 
          label="Total Screened" 
          value="452" 
          trend="+12%" 
          up={true} 
          icon={<Users size={20} className="text-emerald-600" />} 
          color="bg-emerald-50" 
        />
        <KPICard 
          label="Qualified Rate" 
          value="24%" 
          trend="-3%" 
          up={false} 
          icon={<Target size={20} className="text-orange-600" />} 
          color="bg-orange-50" 
        />
        <KPICard 
          label="Time-to-Shortlist" 
          value="1.8d" 
          trend="-0.4d" 
          up={true} 
          icon={<Clock size={20} className="text-pink-600" />} 
          color="bg-pink-50" 
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Main Funnel Analysis */}
        <div className="lg:col-span-8 bg-white rounded-[48px] border border-slate-100 shadow-xl overflow-hidden p-10 flex flex-col space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3">
              <Zap size={24} className="text-indigo-600" /> Conversion Pipeline
            </h3>
            <div className="flex gap-4">
              <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">+14.2% Effeciency</span>
            </div>
          </div>
          
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 40, right: 40 }}>
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 900 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }} 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[0, 20, 20, 0]} 
                  barSize={40}
                >
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-5 gap-4 pt-4">
            {funnelData.map(d => (
              <div key={d.name} className="text-center">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">{d.name}</p>
                <p className="text-lg font-black text-slate-800">{d.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Global Skill Benchmark */}
        <div className="lg:col-span-4 bg-slate-900 rounded-[48px] shadow-2xl overflow-hidden p-10 flex flex-col space-y-8 text-white relative">
          <Globe className="absolute top-0 right-0 p-8 opacity-10" size={120} />
          
          <div className="relative z-10 space-y-2">
            <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
              <BrainCircuit size={24} className="text-indigo-400" /> Market Benchmark
            </h3>
            <p className="text-slate-400 text-xs font-medium">Your elite pool vs. Global industry average.</p>
          </div>

          <div className="flex-1 h-64 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={marketBenchmarkData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Your Pool" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                <Radar name="Global Avg" dataKey="B" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 relative z-10 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase">Competitive ROI</span>
              <span className="text-emerald-400 font-black">+38%</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              Your candidates are scoring in the <span className="text-white font-black">top 12th percentile</span> globally for technical speed and integrity.
            </p>
          </div>
        </div>

        {/* Talent Volume & Origins */}
        <div className="lg:col-span-12 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-lg space-y-8">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3">
              <Activity className="text-indigo-600" /> Applicant Velocity
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volumeData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-lg space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3">
                <ShieldCheck className="text-emerald-600" /> Talent Origins
              </h3>
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <TalentOriginRow region="Silicon Valley" count={124} percent={45} />
              <TalentOriginRow region="London / Europe" count={89} percent={32} />
              <TalentOriginRow region="Bengaluru / APAC" count={56} percent={23} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ label, value, trend, up, icon, color }: any) => (
  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4 transition-transform hover:scale-[1.02] cursor-default">
    <div className="flex justify-between items-start">
      <div className={`p-4 rounded-2xl ${color}`}>{icon}</div>
      <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${up ? 'text-emerald-500' : 'text-red-500'}`}>
        {up ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {trend}
      </div>
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-4xl font-black text-slate-800 tracking-tighter">{value}</p>
    </div>
  </div>
);

const TalentOriginRow = ({ region, count, percent }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end">
      <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{region}</span>
      <span className="text-[10px] font-black text-slate-400 uppercase">{count} Applicants</span>
    </div>
    <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
      <div className="h-full bg-indigo-500" style={{ width: `${percent}%` }}></div>
    </div>
  </div>
);

const KPICardStyles = `
.kp-card:hover {
  transform: translateY(-5px);
}
`;

const Activity = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

export default Analytics;
