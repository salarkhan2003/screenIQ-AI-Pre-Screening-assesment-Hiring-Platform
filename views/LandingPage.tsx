
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Zap, ShieldCheck, ArrowRight, Play, ChevronDown, Terminal, 
  Fingerprint, Scan, Sun, Moon, Menu, X, CheckCircle2, 
  Cpu, LayoutGrid, Activity, ShieldAlert, Target, Sparkles,
  Eye, Lock, Globe, Database, Layers, Search, TrendingUp, 
  ZapOff, Trophy, FileText, Shield, Calendar, Share2
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.98]);

  const toggleTheme = () => setIsDark(!isDark);

  const colors = {
    bg: isDark ? 'bg-black' : 'bg-[#F2F2F7]',
    text: isDark ? 'text-white' : 'text-[#1C1C1E]',
    secondary: isDark ? 'text-zinc-500' : 'text-zinc-400',
    glass: isDark ? 'glass-ios-dark' : 'glass-ios',
    border: isDark ? 'border-white/10' : 'border-black/5',
    accent: 'bg-indigo-600',
  };

  return (
    <div ref={containerRef} className={`relative min-h-screen ${colors.bg} ${colors.text} transition-colors duration-700 overflow-x-hidden selection:bg-indigo-500/30 font-sans`}>
      
      {/* Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] p-6 flex justify-center">
        <motion.div 
          animate={{ width: isScrolled ? '95%' : '100%', maxWidth: '1200px' }}
          className={`flex items-center justify-between rounded-[32px] p-4 ${colors.glass} border ${colors.border} shadow-2xl transition-all duration-500`}
        >
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className={`w-10 h-10 ${colors.accent} rounded-xl flex items-center justify-center text-white`}>
              <Terminal size={20} strokeWidth={3} />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">RoleScreen</span>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {['Infrastructure', 'Integrity', 'Passport', 'Stack'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-indigo-500 transition-colors">
                {link}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-amber-500 transition-all active:scale-90">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-indigo-600 text-white rounded-[20px] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">
              Recruiter Portal
            </button>
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 z-10 pt-20">
        <motion.div style={{ scale: heroScale }} className="max-w-4xl mx-auto text-center space-y-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400">Next-Gen Verification Infrastructure</span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] italic uppercase">
            Proof is <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-400 to-indigo-600">The New Reality.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl md:text-2xl font-semibold leading-relaxed text-zinc-400">
            RoleScreen AI is the world's first <span className="text-white">Zero-Knowledge</span> hiring infrastructure. Verify talent via situational logic, not keyword parsing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button onClick={() => navigate('/dashboard')} className="px-10 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-500 active:scale-95 transition-all flex items-center justify-center gap-3">
              Deploy Gating <ArrowRight size={20} />
            </button>
            <button className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-[24px] font-black text-sm uppercase tracking-[0.2em] hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-3">
              <Play size={18} fill="currentColor" /> System Intel
            </button>
          </div>
        </motion.div>

        <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-30 animate-bounce">
          <span className="text-[8px] font-black uppercase tracking-[0.6em]">Scroll to Inspect</span>
          <ChevronDown size={24} />
        </div>
      </section>

      {/* Brand Cloud */}
      <section className="py-20 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-12 md:gap-24 items-center opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
          {['Google', 'Netflix', 'Tesla', 'Airbnb', 'Stripe', 'Spotify'].map(b => (
            <span key={b} className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">{b}</span>
          ))}
        </div>
      </section>

      {/* Protocol 01: Engine */}
      <section id="infrastructure" className="py-32 md:py-48 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <h3 className="text-indigo-500 font-black text-xs uppercase tracking-[0.5em] flex items-center gap-3">
                <Terminal size={14} /> Protocol 01 / Infrastructure
              </h3>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase leading-tight">
                Intersection <br /> Logic Engine.
              </h2>
              <p className="text-lg md:text-xl font-medium text-zinc-500 leading-relaxed max-w-xl">
                We don't "read" resumes—we verify them. RoleScreen generates <span className="text-white">Truth Queries</span> that cross-reference specific claims against situational mastery.
              </p>
            </div>
            <div className="grid gap-6">
              <FeatureItem 
                icon={<Fingerprint size={20} />} 
                title="Claim Extraction" 
                desc="Our AI identifies high-impact proof points in candidate resumes automatically." 
              />
              <FeatureItem 
                icon={<Target size={20} />} 
                title="Verification Gating" 
                desc="Eliminates 98% of noise by forcing proof of competence before the first interview." 
              />
              <FeatureItem 
                icon={<Database size={20} />} 
                title="Distributed Scaling" 
                desc="Built to handle 10,000 concurrent screens with sub-second latency." 
              />
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[48px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-zinc-900 border border-white/10 rounded-[48px] p-8 md:p-12 shadow-3xl">
              <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                  <Activity size={14} /> LIVE_PROCTOR_SYNC
                </span>
                <span className="text-[10px] font-black uppercase text-zinc-500">v4.12.0</span>
              </div>
              <div className="space-y-8">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                  <p className="text-[9px] font-black uppercase opacity-30 tracking-widest">Input Claim</p>
                  <p className="text-lg font-bold italic">"Architected the migration of Stripe's ledger system."</p>
                </div>
                <div className="p-6 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 space-y-3">
                  <p className="text-[9px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-2">
                    <Sparkles size={12} /> Truth Intersection
                  </p>
                  <p className="text-xl font-black italic text-white">"During that migration, how did you handle partial failure of dual-writes?"</p>
                </div>
                <div className="pt-6 space-y-3">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-40">
                    <span>Authenticity Factor</span>
                    <span>94%</span>
                   </div>
                   <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: '94%' }} transition={{ duration: 2 }} className="h-full bg-indigo-600" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol 02: Integrity */}
      <section id="integrity" className="py-32 md:py-48 px-6 bg-zinc-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20 items-center">
          <div className="md:w-1/2 flex justify-center">
            <div className="w-full max-w-sm aspect-square bg-zinc-950 rounded-[64px] border border-white/10 flex items-center justify-center relative overflow-hidden group">
              <Scan size={180} className="text-indigo-500/10 absolute animate-pulse" />
              <motion.div animate={{ y: ['-100%', '100%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="absolute top-0 left-0 right-0 h-1 bg-indigo-500/40 blur-sm" />
              <ShieldAlert size={100} className="text-indigo-500 relative z-10 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute bottom-10 px-6 py-2 bg-red-600 text-white rounded-full font-black text-[9px] uppercase tracking-widest">Anti-Cheat Protocol Active</div>
            </div>
          </div>
          <div className="md:w-1/2 space-y-10">
            <div className="space-y-4">
              <h3 className="text-red-500 font-black text-xs uppercase tracking-[0.5em] flex items-center gap-3">
                <Shield size={14} /> Protocol 02 / Security
              </h3>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase leading-tight">
                Integrity <br /> Guardrail.
              </h2>
              <p className="text-lg md:text-xl font-medium text-zinc-500 leading-relaxed max-w-xl">
                Legacy tests are broken by AI. We use <span className="text-white">gaze vectoring</span> and OS-level locking to ensure zero-knowledge proof of individual mastery.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <StatItem icon={<Eye size={18} />} title="Gaze Vectoring" desc="Tracks focal points." />
              <StatItem icon={<Lock size={18} />} title="State Locking" desc="Prevents tab-switching." />
              <StatItem icon={<Activity size={18} />} title="Biometric Sync" desc="Typing rhythm analysis." />
              <StatItem icon={<ZapOff size={18} />} title="AI Masking" desc="Detects script-reading." />
            </div>
          </div>
        </div>
      </section>

      {/* Protocol 03: Passport */}
      <section id="passport" className="py-32 md:py-48 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-20">
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="text-emerald-500 font-black text-xs uppercase tracking-[0.5em] flex justify-center items-center gap-3">
              <Globe size={14} /> Protocol 03 / Talent
            </h3>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase">Verity Passport.</h2>
            <p className="text-lg md:text-xl font-medium text-zinc-500 leading-relaxed">
              Elite talent earns a Skill Passport that bypasses future screenings. A persistent, portable reputation layer for the global economy.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <PassportFeature title="Skip the Line" desc="Verified candidates skip HR screens at 400+ partner companies." />
            <PassportFeature title="Truth Signaling" desc="A public, verifiable badge for LinkedIn and resumes." />
            <PassportFeature title="Skill Decay" desc="Automated re-verification ensures expertise is current." />
          </div>
          <div className="pt-10">
            <button onClick={() => navigate('/dashboard')} className="px-12 py-6 bg-white text-black rounded-[28px] font-black text-xs uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all shadow-2xl">Create Your Passport</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-white/5 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><Terminal size={16} strokeWidth={3} /></div>
              <span className="text-lg font-black tracking-tighter uppercase italic">RoleScreen</span>
            </div>
            <p className="text-xs font-medium text-zinc-500 leading-relaxed">Infrastructure for the trustless hiring era. Built for the 2026 talent market.</p>
          </div>
          <FooterLinks title="Protocols" links={['Engine', 'Integrity', 'Passport', 'Economics']} />
          <FooterLinks title="Resources" links={['API Docs', 'Status', 'Security', 'Research']} />
          <FooterLinks title="Company" links={['Protocol', 'Ethics', 'Contact', 'Hiring']} />
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-20 mt-20 border-t border-white/5 flex justify-between opacity-30">
          <p className="text-[10px] font-black uppercase tracking-widest">© 2026 INFRASTRUCTURE v4.12.0</p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Sub-components ---

const FeatureItem = ({ icon, title, desc }: any) => (
  <div className="flex gap-5 group">
    <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-500 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
      {icon}
    </div>
    <div>
      <h4 className="text-lg font-black italic uppercase tracking-tight">{title}</h4>
      <p className="text-xs font-bold text-zinc-500 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const StatItem = ({ icon, title, desc }: any) => (
  <div className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all">
    <div className="text-indigo-500 mb-3">{icon}</div>
    <h5 className="text-[10px] font-black uppercase tracking-widest text-white mb-1">{title}</h5>
    <p className="text-[9px] font-bold text-zinc-500 uppercase">{desc}</p>
  </div>
);

const PassportFeature = ({ title, desc }: any) => (
  <div className="p-10 bg-zinc-900 border border-white/5 rounded-[40px] space-y-4 hover:border-emerald-500/30 transition-all text-left">
    <h4 className="text-2xl font-black italic uppercase tracking-tight text-emerald-500">{title}</h4>
    <p className="text-sm font-medium text-zinc-500 leading-relaxed">{desc}</p>
  </div>
);

const FooterLinks = ({ title, links }: any) => (
  <div className="space-y-6">
    <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{title}</h4>
    <ul className="space-y-3">
      {links.map((l: string) => (
        <li key={l}><a href="#" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">{l}</a></li>
      ))}
    </ul>
  </div>
);

export default LandingPage;
