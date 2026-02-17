
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Zap, ShieldCheck, ArrowRight, Play, ChevronDown, Terminal, 
  Fingerprint, Scan, Sun, Moon, Menu, X, CheckCircle2, 
  Cpu, LayoutGrid, Activity, ShieldAlert, Target, Sparkles,
  Eye, Lock, Globe, Database, Layers, Search, TrendingUp, 
  ZapOff, Trophy, FileText, Share2, Shield, Calendar, Download
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -30]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.99]);

  const toggleTheme = () => setIsDark(!isDark);

  const colors = {
    bg: isDark ? 'bg-black' : 'bg-[#F2F2F7]',
    text: isDark ? 'text-white' : 'text-[#1C1C1E]',
    secondary: isDark ? 'text-zinc-400' : 'text-zinc-500',
    glass: isDark ? 'glass-ios-dark' : 'glass-ios',
    border: isDark ? 'border-white/10' : 'border-black/5',
    accent: 'bg-indigo-600',
  };

  return (
    <div ref={containerRef} className={`relative min-h-screen ${colors.bg} ${colors.text} transition-colors duration-1000 overflow-x-hidden selection:bg-indigo-500/30`}>
      
      {/* Ambient Lighting Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 100, 0], opacity: [0.15, 0.2, 0.15] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%] bg-indigo-600/20 blur-[200px] rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], x: [0, -100, 0], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[10%] w-[120%] h-[120%] bg-purple-600/20 blur-[200px] rounded-full" 
        />
      </div>

      {/* Dynamic Island Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] p-4 md:p-6 flex justify-center">
        <motion.div 
          animate={{ 
            width: isScrolled ? (mobileMenuOpen ? '92%' : 'auto') : '100%',
            padding: isScrolled ? '12px 24px' : '16px 32px'
          }}
          className={`max-w-7xl w-full flex items-center justify-between rounded-[32px] md:rounded-[48px] ${colors.glass} shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]`}
        >
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className={`w-8 h-8 md:w-10 md:h-10 ${colors.accent} rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg`}>
              <Terminal size={18} strokeWidth={3} />
            </div>
            <span className="text-xl md:text-2xl font-[900] tracking-tighter">RoleScreen <span className="text-indigo-500">AI</span></span>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {['Engine', 'Integrity', 'Passport', 'Economics', 'Stack'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className={`text-[10px] font-black uppercase tracking-[0.2em] ${colors.secondary} hover:text-indigo-500 transition-colors`}>
                {link}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-zinc-800' : 'bg-white shadow-sm'} text-amber-500 active:scale-90 transition-all`}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => navigate('/dashboard')} className="hidden sm:block px-6 py-3 bg-indigo-600 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
              Recruiter Portal
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden w-10 h-10 flex items-center justify-center">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} className={`absolute top-24 left-4 right-4 ${colors.glass} rounded-[32px] p-8 flex flex-col gap-6 shadow-3xl lg:hidden`}>
              {['Engine', 'Integrity', 'Passport', 'Economics', 'Stack'].map(link => (
                <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black uppercase tracking-tighter italic">{link}</a>
              ))}
              <hr className="border-white/10" />
              <button onClick={() => navigate('/dashboard')} className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black uppercase tracking-widest">Recruiter Portal</button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] md:min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 z-10">
        <motion.div style={{ y: heroY, scale: heroScale }} className="max-w-6xl mx-auto text-center space-y-12">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`inline-flex items-center gap-3 px-6 py-2 rounded-full ${colors.glass} border ${colors.border}`}>
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400">Verifying the Global Talent Stream</span>
          </motion.div>

          <h1 className="text-5xl sm:text-7xl md:text-[9rem] lg:text-[11rem] font-[900] tracking-tighter leading-[0.8] italic uppercase select-none">
            PROOF <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-400 to-indigo-600 animate-gradient-x">IS REALITY.</span>
          </h1>

          <p className={`max-w-2xl mx-auto text-lg md:text-3xl font-bold leading-tight ${colors.secondary} px-4`}>
            RoleScreen AI is the world's first <span className={colors.text}>Zero-Knowledge</span> hiring infrastructure. Verification via situational logic, not keyword parsing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button onClick={() => navigate('/dashboard')} className="px-10 py-6 md:px-14 md:py-8 bg-indigo-600 text-white rounded-[32px] font-black text-xl md:text-2xl uppercase tracking-[0.2em] shadow-[0_20px_60px_rgba(79,70,229,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4">
              Deploy Gating <ArrowRight size={28} />
            </button>
            <button className={`px-10 py-6 md:px-14 md:py-8 ${colors.glass} rounded-[32px] font-black text-xl md:text-2xl uppercase tracking-[0.2em] shadow-xl hover:bg-white/10 transition-all flex items-center justify-center gap-4`}>
              <Play size={24} fill="currentColor" /> System Intel
            </button>
          </div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <span className="text-[8px] font-black uppercase tracking-[0.6em]">Scroll to Inspect</span>
          <ChevronDown size={32} className="animate-bounce" />
        </div>
      </section>

      {/* Global Infrastructure Banner */}
      <section className="py-16 md:py-32 border-y border-white/5 bg-white/[0.02] px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-12 md:gap-24 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
          {['Google', 'Netflix', 'Tesla', 'Airbnb', 'Stripe', 'Spotify'].map(b => (
            <span key={b} className="text-2xl md:text-5xl font-[900] italic tracking-tighter uppercase">{b}</span>
          ))}
        </div>
      </section>

      {/* Intersection Engine Detail */}
      <RevealSection id="engine" className="py-24 md:py-64 px-6 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 md:gap-32 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <h3 className="text-indigo-500 font-black text-xs uppercase tracking-[0.5em] flex items-center gap-3">
                <Terminal size={14} /> Protocol 01 / Intersection
              </h3>
              <h2 className="text-5xl md:text-8xl font-[900] tracking-tighter leading-[0.9] italic uppercase">
                Cross-Proof <br /> Logic.
              </h2>
              <p className={`text-xl md:text-3xl font-bold leading-tight ${colors.secondary}`}>
                We don't "read" resumes. We build <span className={colors.text}>Logic Intersection Points</span> that cross-reference claims against situational truth.
              </p>
            </div>
            <div className="grid gap-10">
              <IOSCard icon={<Fingerprint />} title="Resume Ingestion" desc="Identifies quantifiable proof-points for verification." />
              <IOSCard icon={<Target />} title="Gating Accuracy" desc="Eliminates 98% of unqualified applicants before human review." />
              <IOSCard icon={<Database />} title="Planetary Scale" desc="Infrastructure designed to handle 10k screens per minute." />
            </div>
          </div>
          <motion.div initial={{ opacity: 0, rotateY: 20, scale: 0.9 }} whileInView={{ opacity: 1, rotateY: 0, scale: 1 }} className={`aspect-square relative ${colors.glass} rounded-[64px] shadow-3xl flex flex-col p-8 md:p-16 ios-3d-card border ${colors.border}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
            <div className="flex justify-between items-center border-b border-white/10 pb-8 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] font-black tracking-widest uppercase text-indigo-400">Verity Engine_v.4.2</span>
              </div>
              <Activity size={24} className="text-indigo-500/50" />
            </div>
            <div className="space-y-8 flex-1">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                <p className="text-[10px] font-black uppercase opacity-30 mb-2">Claim Detected</p>
                <p className="text-xl md:text-2xl font-black italic">"Lead architect for Netflix streaming API migration."</p>
              </div>
              <div className="p-8 bg-indigo-600/20 rounded-[40px] border border-indigo-500/30 space-y-4">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={12} /> Intersection Query
                </p>
                <p className="text-xl md:text-2xl font-[900] italic leading-tight">"In that migration, how did you maintain consistency during the dual-write period?"</p>
              </div>
              <div className="pt-8">
                <div className="flex justify-between items-end mb-4 font-black uppercase tracking-widest text-[10px] opacity-40">Authenticity Sync</div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: '92%' }} transition={{ duration: 2 }} className="h-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,1)]" /></div>
              </div>
            </div>
          </motion.div>
        </div>
      </RevealSection>

      {/* Integrity Guard Section */}
      <RevealSection id="integrity" className="py-24 md:py-64 px-6 bg-white/[0.01] border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
           <div className="relative order-2 lg:order-1 flex justify-center">
              <div className={`aspect-square w-full max-w-lg ${isDark ? 'bg-zinc-900' : 'bg-white'} rounded-[64px] border ${colors.border} flex items-center justify-center relative overflow-hidden shadow-3xl`}>
                 <Scan size={240} className="text-indigo-500/5 animate-pulse absolute" />
                 <motion.div animate={{ y: ['-100%', '100%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="absolute top-0 left-0 right-0 h-2 bg-indigo-500/50 blur-md z-20" />
                 <ShieldAlert size={120} className="text-indigo-500 relative z-10 drop-shadow-[0_0_30px_rgba(99,102,241,0.6)]" />
                 <div className="absolute bottom-10 flex items-center gap-3 bg-red-600 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest">
                   <ZapOff size={14} /> Anti-Cheat Protocol Active
                 </div>
              </div>
           </div>
           <div className="space-y-12 order-1 lg:order-2">
              <div className="space-y-8">
                <h3 className="text-red-500 font-black text-xs uppercase tracking-[0.5em] flex items-center gap-3">
                  <Shield size={14} /> Protocol 02 / Security
                </h3>
                <h2 className="text-5xl md:text-8xl font-[900] tracking-tighter leading-[0.9] italic uppercase">
                  Integrity <br /> Guard.
                </h2>
                <p className={`text-xl md:text-3xl font-bold leading-tight ${colors.secondary}`}>
                  We track <span className={colors.text}>gaze vectors</span> and browser state. Zero tolerance for AI copy-pasting or secondary devices.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <IconPill icon={<Eye />} title="Gaze Vectoring" desc="Tracks focal focus points." />
                <IconPill icon={<Lock />} title="OS-Level Lock" desc="Prevents tab-switching." />
                <IconPill icon={<Activity />} title="Latent Sync" desc="Monitors typing rhythm." />
                <IconPill icon={<Trophy />} title="Verity Status" desc="Elite candidate trust level." />
              </div>
           </div>
        </div>
      </RevealSection>

      {/* Passport & Global Networking */}
      <RevealSection id="passport" className="py-24 md:py-64 px-6 relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
           <div className="lg:w-1/2 space-y-12 text-left">
              <h3 className="text-emerald-500 font-black text-xs uppercase tracking-[0.5em] flex items-center gap-3">
                <Globe size={14} /> Protocol 03 / Talent
              </h3>
              <h2 className="text-5xl md:text-8xl font-[900] tracking-tighter leading-none italic uppercase">
                Verity <br /> Passport.
              </h2>
              <p className={`text-xl md:text-3xl font-bold leading-tight ${colors.secondary}`}>
                Elite talent earns a <span className={colors.text}>Skill Passport</span> that skips future screenings. A persistent reputation layer for the global economy.
              </p>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-6 p-8 bg-indigo-600/5 rounded-[40px] border border-indigo-500/20">
                  <CheckCircle2 className="text-indigo-500" size={32} />
                  <div>
                    <h4 className="text-xl font-black italic uppercase">Verified Status</h4>
                    <p className="text-sm opacity-50 font-bold uppercase tracking-widest">Valid for 6 months across 400+ partners.</p>
                  </div>
                </div>
              </div>
           </div>
           <div className="lg:w-1/2 flex justify-center">
              <div className="aspect-[3/4] w-full max-w-sm bg-zinc-900 rounded-[56px] border border-white/10 shadow-3xl p-10 flex flex-col space-y-10 relative overflow-hidden">
                <div className="flex justify-between items-center">
                  <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl"><Terminal size={24}/></div>
                  <div className="px-4 py-2 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 rounded-full text-[10px] font-black uppercase tracking-widest">Elite Tier</div>
                </div>
                <div className="space-y-2">
                  <p className="text-white text-5xl font-black tracking-tighter uppercase italic leading-none">Alex <br /> Rivera</p>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">ID: ROLE_7721_NX</p>
                </div>
                <div className="flex-1 space-y-6 pt-10">
                   <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase text-indigo-400"><span>System Design</span><span>98%</span></div>
                      <div className="h-1.5 bg-white/5 rounded-full"><div className="h-full bg-indigo-500 w-[98%]"/></div>
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase text-indigo-400"><span>Logical Depth</span><span>92%</span></div>
                      <div className="h-1.5 bg-white/5 rounded-full"><div className="h-full bg-indigo-500 w-[92%]"/></div>
                   </div>
                </div>
              </div>
           </div>
        </div>
      </RevealSection>

      {/* Unit Economics Section */}
      <RevealSection id="economics" className="py-24 md:py-64 px-6 bg-indigo-600/5">
        <div className="max-w-7xl mx-auto text-center space-y-24">
           <div className="space-y-8">
              <h2 className="text-6xl md:text-[10rem] font-[900] tracking-tighter italic uppercase leading-[0.8]">Unit <br /> Economics.</h2>
              <p className={`text-xl md:text-3xl font-bold ${colors.secondary} max-w-2xl mx-auto`}>Scalable infrastructure for high-growth talent acquisition.</p>
           </div>
           <div className="grid md:grid-cols-3 gap-10">
              <PricingCard title="Micro-Gate" price="2" per="screen" desc="For high-growth startups scaling pods." items={['Intersection Engine', 'Integrity Shield v1', 'Unlimited JD Sync']} />
              <PricingCard title="Enterprise" price="Elite" per="custom" desc="Planetary scale hiring infrastructure." items={['Full API Access', 'Custom White-labeling', 'Dedicated Node Deployment', 'ATS Integration']} featured={true} />
              <PricingCard title="Candidate" price="10" per="badge" desc="For talent signaling high integrity." items={['Verification Badge', 'Verified Skill Passport', 'Skip-the-line Access']} />
           </div>
        </div>
      </RevealSection>

      {/* Integration Stack (New Section) */}
      <RevealSection id="stack" className="py-24 md:py-64 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-8">
              <h3 className="text-indigo-500 font-black text-xs uppercase tracking-[0.5em] flex items-center gap-3"><Layers size={14}/> Protocol 04 / Connectivity</h3>
              <h2 className="text-5xl md:text-8xl font-[900] tracking-tighter leading-none italic uppercase">Native <br /> Flow.</h2>
              <p className={`text-xl md:text-2xl font-bold leading-tight ${colors.secondary}`}>Connect RoleScreen results directly to your existing talent stack via Native Extensions and API hooks.</p>
              <div className="flex flex-wrap gap-4 pt-4">
                 {['Greenhouse', 'Lever', 'Workday', 'Slack', 'LinkedIn'].map(t => (
                   <span key={t} className="px-6 py-2 glass-ios-dark border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest">{t}</span>
                 ))}
              </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="p-8 glass-ios-dark border border-white/5 rounded-[40px] space-y-4">
                 <Search className="text-indigo-500" size={24}/>
                 <h4 className="text-lg font-black italic">Magic Links</h4>
                 <p className="text-[10px] opacity-40 leading-relaxed font-bold">Inject gating directly into LinkedIn job posts.</p>
              </div>
              <div className="p-8 glass-ios-dark border border-white/5 rounded-[40px] space-y-4 translate-y-10">
                 <Calendar className="text-indigo-500" size={24}/>
                 <h4 className="text-lg font-black italic">Sync Logic</h4>
                 <p className="text-[10px] opacity-40 leading-relaxed font-bold">Automated interview booking for elite matches.</p>
              </div>
           </div>
        </div>
      </RevealSection>

      {/* Final Massive CTA */}
      <section className="py-48 px-6 text-center z-10 relative">
        <motion.div whileHover={{ scale: 1.01 }} className="max-w-6xl mx-auto p-12 md:p-32 rounded-[80px] bg-indigo-600 text-white shadow-3xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
          <Sparkles className="absolute top-0 right-0 p-20 opacity-10 group-hover:rotate-12 transition-transform" size={400} />
          <div className="relative z-10 space-y-16">
            <h2 className="text-5xl md:text-[10rem] font-[900] tracking-tighter leading-[0.8] italic uppercase">Quit <br /> Guessing. <br /> Start <br /> Gating.</h2>
            <button onClick={() => navigate('/dashboard')} className="px-16 py-8 md:px-24 md:py-10 bg-white text-indigo-600 rounded-[48px] font-black text-2xl md:text-4xl uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
              Access Platform
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={`py-32 px-6 border-t ${colors.border} bg-black relative z-20`}>
         <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-20">
            <div className="md:col-span-5 space-y-10">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><Terminal size={24} strokeWidth={3} /></div>
                  <span className="text-3xl font-[900] italic uppercase tracking-tighter">RoleScreen AI</span>
               </div>
               <p className={`text-xl font-bold leading-relaxed ${colors.secondary} max-w-sm`}>Planetary-scale recruitment infrastructure. Verified skills for a trustless global economy.</p>
            </div>
            <div className="md:col-span-7 grid grid-cols-2 lg:grid-cols-3 gap-12 text-left">
               <FooterColumn title="Systems" links={['Engine', 'Integrity', 'Passport', 'Leaderboard']} />
               <FooterColumn title="Infrastructure" links={['API Docs', 'Edge Nodes', 'Status', 'Security']} />
               <FooterColumn title="Company" links={['Protocol', 'Hiring', 'Ethics', 'Contact']} />
            </div>
         </div>
         <div className={`max-w-7xl mx-auto pt-20 mt-20 border-t ${colors.border} flex flex-col md:flex-row justify-between items-center gap-10 opacity-30`}>
            <p className="text-[10px] font-black uppercase tracking-widest">© 2026 INFRASTRUCTURE v4.12.0</p>
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest">
               <a href="#" className="hover:text-indigo-500 transition-colors">Service Protocol</a>
               <a href="#" className="hover:text-indigo-500 transition-colors">Privacy Shield</a>
               <a href="#" className="hover:text-indigo-500 transition-colors">Trust Policy</a>
            </div>
         </div>
      </footer>
    </div>
  );
};

// --- Sub-Components ---

const RevealSection: React.FC<{ children: React.ReactNode, className?: string, id?: string }> = ({ children, className, id }) => (
  <motion.section id={id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: "easeOut" }} className={className}>
    {children}
  </motion.section>
);

const IOSCard = ({ icon, title, desc }: any) => (
  <div className="flex gap-6 group cursor-default">
    <div className="w-16 h-16 rounded-[24px] bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center text-indigo-500 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg">
      {icon}
    </div>
    <div className="space-y-1">
      <h4 className="text-2xl font-black uppercase tracking-tight italic"> {title} </h4>
      <p className="text-sm font-bold opacity-40 leading-relaxed max-w-xs">{desc}</p>
    </div>
  </div>
);

const IconPill = ({ icon, title, desc }: any) => (
  <div className="p-8 glass-ios-dark border border-white/5 rounded-[40px] space-y-4 group hover:border-indigo-500/50 transition-all shadow-xl">
    <div className="text-indigo-500 group-hover:scale-110 transition-transform">{icon}</div>
    <div className="space-y-1">
      <h5 className="text-white font-black uppercase text-xs tracking-widest">{title}</h5>
      <p className="text-[11px] opacity-40 leading-relaxed font-bold">{desc}</p>
    </div>
  </div>
);

const PricingCard = ({ title, price, per, desc, items, featured = false }: any) => (
  <div className={`p-12 rounded-[56px] text-left flex flex-col space-y-10 border transition-all hover:scale-[1.02] ${featured ? 'bg-indigo-600 text-white border-indigo-500 shadow-3xl scale-105' : 'glass-ios-dark border-white/10 text-white'}`}>
     <div className="space-y-6">
        <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${featured ? 'text-indigo-200' : 'text-indigo-500'}`}>{title}</span>
        <div className="flex items-end gap-1">
           <span className="text-6xl md:text-7xl font-[900] italic tracking-tighter leading-none">${price}</span>
           <span className="text-[10px] font-black uppercase opacity-50 mb-3">/ {per}</span>
        </div>
        <p className={`text-sm font-bold opacity-60 leading-relaxed ${featured ? 'text-indigo-100' : ''}`}>{desc}</p>
     </div>
     <ul className="space-y-5 flex-1">
        {items.map((it: string) => (
          <li key={it} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
            <CheckCircle2 size={16} className={featured ? 'text-indigo-200' : 'text-indigo-500'} /> {it}
          </li>
        ))}
     </ul>
     <button className={`w-full py-6 rounded-[28px] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl ${featured ? 'bg-white text-indigo-600' : 'bg-white/10 text-white hover:bg-white/20'}`}>
        Launch Protocol
     </button>
  </div>
);

const FooterColumn = ({ title, links }: any) => (
  <div className="space-y-8">
     <h4 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">{title}</h4>
     <ul className="space-y-4">
        {links.map((l: string) => (
          <li key={l}><a href="#" className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-indigo-500 transition-all">{l}</a></li>
        ))}
     </ul>
  </div>
);

const UserCheck = ({ size, className }: any) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>
  </svg>
);

export default LandingPage;
