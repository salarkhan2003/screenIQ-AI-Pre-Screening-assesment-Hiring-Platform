
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Zap, ShieldCheck, BrainCircuit, Target, ArrowRight, 
  Users, Briefcase, Globe, Sparkles, CheckCircle2, 
  BarChart3, Shield, Star, Play, MessageSquareText,
  Lock, Cpu, Layers, MousePointer2, ChevronDown,
  Mail, Terminal, Network, Fingerprint, Activity
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
    <div className="min-h-screen bg-[#020617] text-slate-300 selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div style={{ y: yBackground }} className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-indigo-900/20 rounded-full blur-[120px]" />
        <motion.div style={{ y: yBackground }} className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between border border-white/10 bg-white/5 backdrop-blur-2xl px-8 py-4 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/40">
              <CheckCircle2 size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">ScreenIQ</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            {['Product', 'Infrastructure', 'Global Benchmark', 'Enterprise'].map(link => (
              <a key={link} href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">
                {link}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors hidden sm:block"
            >
              Recruiter Login
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-white text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-indigo-500/10"
            >
              Launch System
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-64 pb-40 px-6 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center text-center space-y-12"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-6 py-2.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 backdrop-blur-md">
              <Sparkles size={16} className="text-indigo-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">The Recruitment Singularity is Here</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] max-w-5xl italic drop-shadow-2xl">
              HIRE WITH <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">ABSOLUTE</span> VERITY.
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl">
              Replace the "Resume Lottery" with high-fidelity AI assessments. 
              Verified technical proof for every candidate, delivered instantly.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 pt-4 w-full justify-center">
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-12 py-8 bg-indigo-600 text-white rounded-[40px] font-black text-xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
              >
                Scale Your Talent Pipeline <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="px-12 py-8 bg-white/5 border border-white/10 text-white rounded-[40px] font-black text-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 group backdrop-blur-xl">
                <Play size={20} fill="currentColor" className="group-hover:scale-110 transition-transform" /> System Intel
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col items-center gap-6 pt-16">
              <div className="flex -space-x-5">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-14 h-14 rounded-2xl border-2 border-[#020617] bg-slate-800 overflow-hidden shadow-2xl">
                    <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="avatar" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">
                Verified by <span className="text-white">40,000+</span> Elite Engineers
              </p>
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="pt-10 text-slate-600"
              >
                <ChevronDown size={32} />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3D Dashboard Preview (Bento Section) */}
      <section className="py-20 px-6 z-10 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 rounded-[64px] p-2 md:p-8 backdrop-blur-3xl shadow-inner relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
            <div className="relative aspect-[16/9] bg-slate-950 rounded-[48px] border border-white/5 overflow-hidden shadow-2xl">
              {/* Mock UI Overlay */}
              <div className="absolute inset-0 flex flex-col p-10 space-y-10">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="w-40 h-8 bg-white/5 rounded-2xl animate-pulse" />
                    <div className="w-20 h-8 bg-white/5 rounded-2xl" />
                  </div>
                  <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                    <BrainCircuit className="text-indigo-400" />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-10 flex-1">
                  <div className="col-span-2 space-y-10">
                     <div className="h-64 bg-white/5 rounded-[40px] border border-white/5 p-10 flex items-center justify-center">
                        <Activity size={100} className="text-indigo-500/20 animate-pulse" />
                     </div>
                     <div className="grid grid-cols-2 gap-10">
                        <div className="h-40 bg-white/5 rounded-[40px] border border-white/5" />
                        <div className="h-40 bg-white/5 rounded-[40px] border border-white/5" />
                     </div>
                  </div>
                  <div className="bg-white/5 rounded-[40px] border border-white/5 p-10 space-y-6">
                    <div className="w-full h-10 bg-white/5 rounded-2xl" />
                    <div className="w-full h-10 bg-white/5 rounded-2xl" />
                    <div className="w-full h-10 bg-white/5 rounded-2xl" />
                    <div className="w-full h-10 bg-white/5 rounded-2xl mt-auto" />
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Signal Section */}
      <section className="py-20 px-6 border-y border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col items-center space-y-16">
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Integrating with Industry Titans</h3>
          <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-20 grayscale hover:grayscale-0 transition-all duration-1000">
            {['GOOGLE', 'AIRBNB', 'NETFLIX', 'TESLA', 'AMAZON', 'STRIPE', 'META'].map(brand => (
              <span key={brand} className="text-2xl md:text-4xl font-black text-white tracking-tighter hover:text-indigo-500 cursor-default transition-colors">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Feature Hub */}
      <section className="py-40 px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight italic">
              ENGINEERED FOR <br /> ELITE INFRASTRUCTURE.
            </h2>
            <p className="text-slate-500 font-medium text-xl leading-relaxed">
              We built the world's first AI recruiter that doesn't just scan—it verifies. 
              Automate the technical validation of your entire funnel.
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-8 auto-rows-[300px]">
            {/* Main Feature */}
            <div className="md:col-span-8 bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[56px] p-12 text-white relative overflow-hidden group shadow-2xl shadow-indigo-500/10">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
                <Cpu size={240} strokeWidth={1} />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between max-w-md">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-lg">
                    <Zap size={32} />
                  </div>
                  <h3 className="text-4xl font-black tracking-tight leading-none italic">Adaptive Generative Assessments.</h3>
                </div>
                <p className="text-indigo-100/70 font-medium text-lg">
                  Proprietary LLM-driven testing that adjusts difficulty in real-time based on candidate latency and logic patterns. No two tests are ever identical.
                </p>
              </div>
            </div>

            {/* Small Card */}
            <div className="md:col-span-4 bg-slate-900 border border-white/10 rounded-[56px] p-10 flex flex-col justify-between hover:bg-slate-800 transition-colors shadow-2xl">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                <Shield size={28} />
              </div>
              <div className="space-y-3">
                <h4 className="text-2xl font-black text-white tracking-tight leading-none">Biometric <br /> Integrity.</h4>
                <p className="text-slate-500 text-sm font-medium">Proctoring that monitors tab switches, secondary persons, and AI assistance in real-time.</p>
              </div>
            </div>

            {/* Another Small Card */}
            <div className="md:col-span-4 bg-slate-900 border border-white/10 rounded-[56px] p-10 flex flex-col justify-between hover:bg-slate-800 transition-colors shadow-2xl">
              <div className="w-14 h-14 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center border border-purple-500/20">
                <Layers size={28} />
              </div>
              <div className="space-y-3">
                <h4 className="text-2xl font-black text-white tracking-tight leading-none">Passport <br /> Ecosystem.</h4>
                <p className="text-slate-500 text-sm font-medium">Verified candidates carry their verified scores across your entire partner network.</p>
              </div>
            </div>

            {/* Medium Vertical */}
            <div className="md:col-span-4 bg-[#0a101f] border border-indigo-500/20 rounded-[56px] p-10 relative overflow-hidden group shadow-2xl shadow-indigo-500/5">
              <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors" />
              <div className="relative z-10 flex flex-col h-full space-y-6">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                  <Globe size={28} className="text-indigo-400" />
                </div>
                <h4 className="text-2xl font-black text-white tracking-tight leading-none">Global <br /> Benchmarking.</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  Every candidate is ranked against real-time data from Silicon Valley, London, and Bengaluru's top tech firms.
                </p>
                <div className="mt-auto space-y-3">
                   <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full w-[88%] bg-indigo-500" /></div>
                   <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full w-[62%] bg-indigo-500/50" /></div>
                </div>
              </div>
            </div>

             {/* Small Card */}
             <div className="md:col-span-4 bg-slate-900 border border-white/10 rounded-[56px] p-10 flex flex-col justify-between hover:bg-slate-800 transition-colors shadow-2xl">
              <div className="w-14 h-14 bg-orange-500/10 text-orange-400 rounded-2xl flex items-center justify-center border border-orange-500/20">
                <MessageSquareText size={28} />
              </div>
              <div className="space-y-3">
                <h4 className="text-2xl font-black text-white tracking-tight leading-none">Smart <br /> Interviewer.</h4>
                <p className="text-slate-500 text-sm font-medium">Automatically generates tailored interview questions based on unique assessment gaps.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - Deep Dive */}
      <section className="py-40 px-6 bg-white/[0.02] backdrop-blur-3xl relative z-10 border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-32 items-center">
          <div className="space-y-16">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic">PLUG AND PLAY <br /> RECRUITMENT.</h2>
              <p className="text-slate-400 text-xl font-medium max-w-md">Your entire hiring logic, from JD optimization to candidate shortlist, automated.</p>
            </div>
            
            <div className="space-y-12">
              <StepRow num="01" title="Define the Avatar" desc="Upload a JD or use our AI to optimize role requirements and skill weightings." icon={<Fingerprint className="text-indigo-400" />} />
              <StepRow num="02" title="Launch the Gate" desc="System generates a custom 10-question MCQ assessment specific to the role." icon={<Network className="text-purple-400" />} />
              <StepRow num="03" title="Verify Identity" desc="Secure camera proctoring ensures the candidate behind the screen is who they say they are." icon={<ShieldCheck className="text-emerald-400" />} />
              <StepRow num="04" title="Deep Analysis" desc="Recruiters get a radar map, logic scores, and adaptive speed metrics for every applicant." icon={<BarChart3 className="text-orange-400" />} />
            </div>
          </div>

          <div className="relative h-[800px] hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-transparent blur-[120px] rounded-full" />
            <div className="relative h-full flex items-center justify-center">
              {/* Floating UI Elements Parallax */}
              <motion.div 
                animate={{ y: [0, -30, 0], rotate: [2, -2, 2] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-0 w-80 p-8 bg-slate-900 border border-white/10 rounded-[40px] shadow-2xl rotate-3 z-30"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black">88%</div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-white uppercase tracking-widest">Candidate IQ</p>
                    <p className="text-[10px] text-slate-500 font-bold">Elite Tier Verified</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-1.5 bg-indigo-500/20 rounded-full w-full" />
                  <div className="h-1.5 bg-indigo-500/20 rounded-full w-2/3" />
                  <div className="h-1.5 bg-indigo-500/20 rounded-full w-3/4" />
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 40, 0], rotate: [-4, 4, -4] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-40 left-0 w-96 p-10 bg-[#0a0a1a] border border-emerald-500/30 rounded-[56px] shadow-[0_40px_100px_rgba(16,185,129,0.1)] -rotate-6 z-20"
              >
                <div className="flex justify-between items-center mb-8">
                   <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-slate-800" />
                   </div>
                   <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2 py-1 rounded">Secured Link</span>
                </div>
                <div className="aspect-video bg-slate-950 rounded-3xl mb-6 flex items-center justify-center">
                   <Activity size={40} className="text-slate-800 animate-pulse" />
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Biometric Tracking Active</p>
              </motion.div>

              <div className="w-[1px] h-[500px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Proof Focus */}
      <section className="py-40 px-6 z-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto bg-slate-900/50 border border-white/5 rounded-[80px] p-16 md:p-32 text-center space-y-20 shadow-2xl relative">
          <div className="absolute top-0 left-0 p-10 opacity-5">
             <Target size={300} />
          </div>
          
          <div className="space-y-6 max-w-4xl mx-auto relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.6em] text-indigo-400">Validated Outcomes</h3>
            <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter italic drop-shadow-lg">
              NUMBERS THAT <br /> SHATTER THE NORM.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-16 relative z-10">
            <StatColumn label="Efficiency Gain" val="3.2x" sub="Faster Time-to-Shortlist" />
            <StatColumn label="Fraud Reduction" val="99%" sub="Verified Identity Rates" />
            <StatColumn label="Hiring Accuracy" val="84%" sub="Probation Success Rate" />
          </div>

          <div className="pt-10 relative z-10">
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-10 py-6 bg-white text-slate-950 rounded-[32px] font-black text-lg uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-2xl shadow-white/5"
            >
              Get The ROI Report
            </button>
          </div>
        </div>
      </section>

      {/* Pricing - Enterprise Grade */}
      <section className="py-40 px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-6">
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic">INFRASTRUCTURE TIERS.</h2>
            <p className="text-slate-500 font-medium text-xl">From high-growth startups to planetary-scale enterprises.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
             <PricingCard tier="Pioneer" price="0" desc="For early founders and small dev shops." features={['Unlimited Assessments', 'Basic Proctoring', 'Passport Verified Talent Pool']} />
             <PricingCard tier="Growth" price="499" desc="For scale-ups hiring multiple roles monthly." features={['Priority Support', 'Custom Skill Sets', 'Ghosting Prevention Logic', 'AI Interview Scripts']} featured={true} />
             <PricingCard tier="Empire" price="Custom" desc="For global enterprises and agencies." features={['Whitelabel Portal', 'Advanced Biometrics', 'Custom Benchmark API', 'Dedicated Talent Partner']} />
          </div>
        </div>
      </section>

      {/* Final CTA / Footer Ecosystem */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 rounded-[80px] p-20 md:p-40 text-center relative overflow-hidden shadow-[0_50px_100px_rgba(79,70,229,0.4)]">
          <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:40px_40px]" />
          <div className="absolute top-0 right-0 p-20 opacity-10 blur-xl">
            <Cpu size={500} className="text-white" />
          </div>
          
          <div className="relative z-10 space-y-12">
            <h2 className="text-6xl md:text-9xl font-black text-white tracking-tighter italic leading-[0.85]">
              QUIT GUESSING. <br /> START VERIFYING.
            </h2>
            <p className="text-indigo-100 text-xl md:text-2xl font-medium max-w-2xl mx-auto">
              The age of manual screening is over. Secure your seat in the recruitment future today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-16 py-10 bg-white text-indigo-600 rounded-[48px] font-black text-2xl uppercase tracking-widest hover:scale-105 hover:rotate-2 transition-all shadow-2xl active:scale-95"
              >
                Launch Now
              </button>
            </div>
            <p className="text-indigo-200/50 text-[10px] font-black uppercase tracking-[0.4em]">No credit card required. Verify your first 10 candidates free.</p>
          </div>
        </div>
      </section>

      {/* Footer System */}
      <footer className="py-32 px-6 border-t border-white/5 bg-[#01030d]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-20 pb-20">
            <div className="md:col-span-4 space-y-8">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={32} className="text-indigo-600" />
                <span className="text-3xl font-black tracking-tighter text-white uppercase italic">ScreenIQ</span>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed max-w-xs">
                Planetary-scale recruitment infrastructure. Verified skills for a trustless talent market.
              </p>
              <div className="flex gap-6">
                {['TW', 'LI', 'GH', 'DC'].map(s => (
                  <div key={s} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-slate-400 hover:text-white transition-colors cursor-pointer">{s}</div>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-12">
               <FooterCol title="Systems" links={['Assessments', 'Proctoring', 'Benchmark', 'Integration']} />
               <FooterCol title="Infrastructure" links={['API Specs', 'Status', 'Security', 'GDPR']} />
               <FooterCol title="Talent" links={['Browse Jobs', 'Passport', 'Verified Skills', 'Rewards']} />
               <FooterCol title="Company" links={['Intelligence Hub', 'About', 'Contact', 'Hiring']} />
            </div>
          </div>
          
          <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">© 2025 ScreenIQ Intelligence Hub. System Version 4.12.2</p>
            <div className="flex gap-10">
              {['Privacy Protocol', 'Service Terms', 'Security Policy'].map(l => (
                <a key={l} href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-indigo-400 transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const StepRow = ({ num, title, desc, icon }: any) => (
  <div className="flex gap-8 group">
    <div className="flex flex-col items-center gap-2">
      <div className="text-[10px] font-black text-indigo-500 tracking-widest">{num}</div>
      <div className="w-[1px] flex-1 bg-white/10" />
    </div>
    <div className="pb-12 space-y-3">
       <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-indigo-500 transition-colors">{icon}</div>
          <h4 className="text-2xl font-black text-white tracking-tight leading-none italic">{title}</h4>
       </div>
       <p className="text-slate-500 text-base font-medium leading-relaxed max-w-sm">{desc}</p>
    </div>
  </div>
);

const StatColumn = ({ label, val, sub }: any) => (
  <div className="space-y-2 group">
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] group-hover:text-indigo-400 transition-colors">{label}</p>
    <p className="text-7xl font-black text-white tracking-tighter">{val}</p>
    <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">{sub}</p>
  </div>
);

const PricingCard = ({ tier, price, desc, features, featured = false }: any) => (
  <div className={`p-12 rounded-[56px] flex flex-col space-y-10 transition-all hover:-translate-y-4 ${featured ? 'bg-indigo-600 text-white shadow-[0_40px_80px_rgba(79,70,229,0.3)] border-indigo-500 scale-[1.05]' : 'bg-slate-900 border border-white/10 text-slate-300'}`}>
     <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${featured ? 'text-indigo-200' : 'text-indigo-400'}`}>{tier}</span>
          {featured && <span className="bg-white/20 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Most Deployed</span>}
        </div>
        <div className="flex items-end gap-2">
          <span className="text-6xl font-black tracking-tighter text-white">${price}</span>
          {price !== 'Custom' && <span className="text-xs font-black uppercase opacity-50 mb-2">/ month</span>}
        </div>
        <p className={`text-sm font-medium leading-relaxed ${featured ? 'text-indigo-100' : 'text-slate-500'}`}>{desc}</p>
     </div>
     
     <ul className="space-y-4 flex-1">
        {features.map((f: string) => (
          <li key={f} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
            <CheckCircle2 size={16} className={featured ? 'text-indigo-200' : 'text-indigo-500'} /> {f}
          </li>
        ))}
     </ul>

     <button className={`w-full py-5 rounded-[28px] font-black text-xs uppercase tracking-widest transition-all ${featured ? 'bg-white text-indigo-600 hover:bg-indigo-50' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}>
        {price === 'Custom' ? 'Initiate Enterprise Protocol' : 'Deploy Tier'}
     </button>
  </div>
);

const FooterCol = ({ title, links }: any) => (
  <div className="space-y-8">
    <h5 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">{title}</h5>
    <ul className="space-y-4">
      {links.map((l: string) => (
        <li key={l}><a href="#" className="text-xs font-bold text-slate-500 hover:text-indigo-400 transition-colors">{l}</a></li>
      ))}
    </ul>
  </div>
);

export default LandingPage;
