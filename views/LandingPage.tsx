
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Zap, ShieldCheck, BrainCircuit, Target, ArrowRight, 
  Globe, Sparkles, CheckCircle2, 
  BarChart3, Shield, Play, MessageSquareText,
  Cpu, Layers, ChevronDown, Terminal, Network, Fingerprint, Activity,
  Lock, MousePointer2, Eye
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const yBackground = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 selection:bg-indigo-500/30 overflow-x-hidden font-sans">
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div style={{ y: yBackground }} className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-indigo-900/20 rounded-full blur-[120px]" />
        <motion.div style={{ y: yBackground }} className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between border border-white/10 bg-white/5 backdrop-blur-2xl px-8 py-4 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/40">
              <Terminal size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">RoleScreen <span className="text-indigo-400">AI</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            {['Infrastructure', 'Intersection Engine', 'Integrity Shield', 'Enterprise'].map(link => (
              <a key={link} href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">
                {link}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-white text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-indigo-500/10"
            >
              Recruiter Dashboard
            </button>
          </div>
        </div>
      </nav>

      <section className="relative pt-64 pb-40 px-6 overflow-hidden z-10 text-center">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-12">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-6 py-2.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 backdrop-blur-md">
              <ShieldCheck size={16} className="text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">The 2026 Hiring Infrastructure is Live</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] max-w-5xl mx-auto italic">
              ZERO-KNOWLEDGE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">PROOF</span> FOR TALENT.
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
              Stop parsing resumes. Start verifying claims. 
              RoleScreen AI uses the <b>Intersection Engine</b> to cross-reference resume claims against JD requirements in real-time.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 pt-4 w-full justify-center">
              <button onClick={() => navigate('/dashboard')} className="px-12 py-8 bg-indigo-600 text-white rounded-[40px] font-black text-xl shadow-2xl hover:bg-indigo-500 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                Deploy 10-Bit Screen <ArrowRight size={24} />
              </button>
              <button className="px-12 py-8 bg-white/5 border border-white/10 text-white rounded-[40px] font-black text-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                <Play size={20} fill="currentColor" /> See Truth Questions
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-20">
              <div className="flex justify-center -space-x-5">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-14 h-14 rounded-2xl border-2 border-[#020617] bg-slate-800 overflow-hidden shadow-2xl">
                    <img src={`https://i.pravatar.cc/100?img=${i+30}`} alt="avatar" className="opacity-80" />
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-6">
                Verified by <span className="text-white">600+</span> Tier-1 Enterprises
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="py-40 px-6 z-10 relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-8 auto-rows-[300px]">
          <div className="md:col-span-8 bg-gradient-to-br from-indigo-600 to-purple-800 rounded-[64px] p-12 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-all">
              <Cpu size={240} />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between max-w-md">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20">
                  <Fingerprint size={32} />
                </div>
                <h3 className="text-4xl font-black tracking-tight leading-none italic">The Intersection Engine.</h3>
              </div>
              <p className="text-indigo-100/70 font-medium text-lg">
                Automatically detects "Resume BS" by generating Truth Questions that verify specific accomplishments. 
                "You optimized SQL by 40%? Explain your specific execution plan."
              </p>
            </div>
          </div>

          <div className="md:col-span-4 bg-slate-900 border border-white/10 rounded-[64px] p-10 flex flex-col justify-between group">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500 transition-colors">
              <Shield size={28} />
            </div>
            <div className="space-y-3">
              <h4 className="text-2xl font-black text-white tracking-tight leading-none">Integrity <br /> Shield.</h4>
              <p className="text-slate-500 text-sm font-medium">Gaze-tracking and browser-lock sensors detect if a candidate is reading from AI scripts.</p>
            </div>
          </div>

          <div className="md:col-span-4 bg-slate-900 border border-white/10 rounded-[64px] p-10 flex flex-col justify-between group">
            <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-500/20">
              <Activity size={28} />
            </div>
            <div className="space-y-3">
              <h4 className="text-2xl font-black text-white tracking-tight leading-none">Adaptive <br /> Guardrails.</h4>
              <p className="text-slate-500 text-sm font-medium">Difficulty scales instantly for high-performers, cutting 10-bit screens down to 6 minutes for elite talent.</p>
            </div>
          </div>

          <div className="md:col-span-8 bg-slate-950 border border-white/5 rounded-[64px] p-12 flex items-center gap-10 relative overflow-hidden group">
             <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
             <div className="relative z-10 w-1/3">
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
                  <div className="h-2 bg-indigo-500 w-full rounded-full" />
                  <div className="h-2 bg-indigo-500 w-2/3 rounded-full opacity-50" />
                  <div className="h-2 bg-indigo-500 w-1/2 rounded-full opacity-30" />
                </div>
             </div>
             <div className="relative z-10 flex-1 space-y-4">
                <h3 className="text-3xl font-black text-white tracking-tight leading-none italic">One-Sentence Verdicts.</h3>
                <p className="text-slate-500 text-lg font-medium">Eliminate review fatigue. See exactly why they match or fail in a single, AI-synthesized line.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-40 px-6 relative z-10 border-t border-white/5 bg-slate-950/30">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-4">
             <h2 className="text-5xl font-black text-white tracking-tighter">THE VERIFICATION ROADMAP.</h2>
             <p className="text-slate-500 text-lg">Infrastructure phases for 2026 global deployment.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
             <RoadmapCard phase="Phase I" title="Resume BS Detector" desc="Viral B2C tool for candidates to test their own resume claims before applying." icon={<Eye />} />
             <RoadmapCard phase="Phase II" title="The Magic Gate" desc="One-click recruiter links for LinkedIn/Indeed. 10-Bit screens replace the first call." icon={<Zap />} />
             <RoadmapCard phase="Phase III" title="ATS Overlay" desc="Direct score injection on Ashby/Greenhouse using our Chrome Infrastructure." icon={<Layers />} />
          </div>
        </div>
      </section>

      {/* Revenue Section */}
      <section className="py-40 px-6 z-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto bg-indigo-600/5 border border-indigo-500/20 rounded-[80px] p-20 md:p-32 text-center space-y-16">
          <h2 className="text-6xl font-black text-white tracking-tighter italic">REVENUE ARCHITECTURE.</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-10 bg-slate-900/50 rounded-[48px] border border-white/5 text-left space-y-6">
               <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest">Micro-Transactions</h4>
               <p className="text-4xl font-black text-white">$2 <span className="text-sm opacity-50">/ screen</span></p>
               <p className="text-xs text-slate-500">1/15th the cost of manual review. Pure ROI for volume hiring.</p>
            </div>
            <div className="p-10 bg-white text-slate-950 rounded-[48px] text-left space-y-6 transform scale-105 shadow-2xl">
               <h4 className="text-indigo-600 font-black text-xs uppercase tracking-widest">Enterprise Tier</h4>
               <p className="text-4xl font-black">Unlimited</p>
               <p className="text-xs text-slate-600 font-bold">Standardized verification for high-volume campus and retail pipelines.</p>
            </div>
            <div className="p-10 bg-slate-900/50 rounded-[48px] border border-white/5 text-left space-y-6">
               <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest">Candidate Premium</h4>
               <p className="text-4xl font-black">$10 <span className="text-sm opacity-50">/ mo</span></p>
               <p className="text-xs text-slate-500">"RoleScreen Verified" badge for LinkedIn. High integrity signal.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-20 px-6 border-t border-white/5 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">© 2026 RoleScreen AI Infrastructure. Verified Verity Platform.</p>
      </footer>
    </div>
  );
};

const RoadmapCard = ({ phase, title, desc, icon }: any) => (
  <div className="space-y-6 p-10 bg-white/5 border border-white/10 rounded-[48px] hover:bg-white/10 transition-all group">
    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">{icon}</div>
    <div className="space-y-2">
      <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">{phase}</h4>
      <h3 className="text-2xl font-black text-white">{title}</h3>
      <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default LandingPage;
