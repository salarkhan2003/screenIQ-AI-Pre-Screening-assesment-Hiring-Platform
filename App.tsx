
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, PlusCircle, User, Briefcase, ChevronRight, 
  LogIn, CheckCircle, XCircle, Search, BarChart2, LogOut,
  Menu, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Job, Candidate, Assessment, CandidateStatus } from './types';
import RecruiterDashboard from './views/RecruiterDashboard';
import CreateJob from './views/CreateJob';
import JobDetail from './views/JobDetail';
import CandidateAssessment from './views/CandidateAssessment';
import CandidateFeedback from './views/CandidateFeedback';
import Analytics from './views/Analytics';
import CandidateBrowse from './views/CandidateBrowse';
import CandidateApplications from './views/CandidateApplications';
import CandidateHome from './views/CandidateHome';
import LandingPage from './views/LandingPage';

// Mock Initial Data with Well-Known Companies
const INITIAL_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Senior Frontend Engineer',
    company: 'Google',
    description: 'Lead our next-generation dashboard initiatives. Proficiency in React, TypeScript, and high-performance rendering is mandatory.',
    department: 'Engineering',
    experienceLevel: 'Senior',
    skills: ['React', 'TypeScript', 'Tailwind'],
    status: 'active',
    createdAt: new Date().toISOString(),
    assessmentId: 'a1',
    cutoffScore: 75,
    isProctoringEnabled: true,
    difficultySetting: 'Senior',
    marketBenchmarkScore: 82,
    idealSkillProfile: { 'Technical': 95, 'Logic': 85, 'Domain': 80 },
    knockoutQuestions: [],
    rejectionDelay: '24 Hours',
    autoNotify: true
  },
  {
    id: 'j2',
    title: 'Product Designer',
    company: 'Airbnb',
    description: 'Crafting meaningful experiences for global travelers. Focus on mobile-first design and accessibility.',
    department: 'Design',
    experienceLevel: 'Mid',
    skills: ['Figma', 'UI/UX', 'Prototyping'],
    status: 'active',
    createdAt: new Date().toISOString(),
    cutoffScore: 65,
    isProctoringEnabled: true,
    difficultySetting: 'Mid',
    marketBenchmarkScore: 75,
    idealSkillProfile: { 'Design': 90, 'Interaction': 80, 'Logic': 70 },
    knockoutQuestions: [],
    rejectionDelay: 'Instant',
    autoNotify: false
  },
  {
    id: 'j3',
    title: 'Backend Engineer (Go/Node)',
    company: 'Netflix',
    description: 'Scaling services that handle millions of concurrent streams. Deep knowledge of microservices and Go is required.',
    department: 'Engineering',
    experienceLevel: 'Senior',
    skills: ['Go', 'Node.js', 'Distributed Systems'],
    status: 'active',
    createdAt: new Date().toISOString(),
    cutoffScore: 80,
    isProctoringEnabled: true,
    difficultySetting: 'Senior',
    marketBenchmarkScore: 85,
    idealSkillProfile: { 'Backend': 95, 'Systems': 90, 'Logic': 85 },
    knockoutQuestions: [],
    rejectionDelay: '3 Days',
    autoNotify: true
  }
];

const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'c-demo-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@tech.io',
    linkedinUrl: 'https://linkedin.com/in/alexrivera',
    parsedResume: {
      summary: "Senior Frontend Engineer with 8+ years experience. Expert in React and performance optimization.",
      heatmapKeywords: ['React', 'TypeScript', 'Tailwind'],
      timeline: [
        {
          title: "Senior Dev",
          company: "Meta",
          period: "2020 - 2024",
          description: "Optimized feed rendering performance by 40%."
        }
      ],
      proofPoints: ['Optimized Meta Feed']
    },
    appliedJobs: [
      {
        jobId: 'j1',
        status: CandidateStatus.APPLIED, 
        score: 88,
        suitability: 91,
        confidenceScore: 94,
        integrityScore: 100,
        appliedAt: new Date().toISOString(),
        feedback: "Exceptional performance in technical screening.",
        skillBreakdown: { 'Technical': 95, 'Logic': 85, 'Domain': 80 },
        tabSwitches: 0,
        multiplePersonsDetected: false
      }
    ]
  }
];

// Helper to render shared sidebar content
const SidebarContent: React.FC<{ 
  role: 'recruiter' | 'candidate', 
  setRole: (r: 'recruiter' | 'candidate') => void,
  onNav?: () => void 
}> = ({ role, setRole, onNav }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-black text-indigo-600 flex items-center gap-2 italic tracking-tighter">
          <CheckCircle className="w-8 h-8" /> ScreenIQ
        </h1>
        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-[0.3em] font-black">AI Infrastructure</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Leaderboard" onClick={onNav} />
        {role === 'recruiter' ? (
          <>
            <SidebarLink to="/jobs/create" icon={<PlusCircle size={20} />} label="Deploy Gate" onClick={onNav} />
            <SidebarLink to="/analytics" icon={<BarChart2 size={20} />} label="Analytics" onClick={onNav} />
          </>
        ) : (
          <>
            <SidebarLink to="/browse" icon={<Search size={20} />} label="Find Jobs" onClick={onNav} />
            <SidebarLink to="/applications" icon={<Briefcase size={20} />} label="Applications" onClick={onNav} />
          </>
        )}
      </nav>

      <div className="p-4 border-t mt-auto space-y-2">
        <button 
          onClick={() => {
            setRole(role === 'recruiter' ? 'candidate' : 'recruiter');
            onNav?.();
          }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <LogIn size={16} /> Switch to {role === 'recruiter' ? 'Candidate' : 'Recruiter'}
        </button>
        <button 
          onClick={() => {
            navigate('/');
            onNav?.();
          }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <LogOut size={16} /> Exit Platform
        </button>
      </div>
    </>
  );
};

const DashboardLayout: React.FC<{ 
  role: 'recruiter' | 'candidate', 
  setRole: (r: 'recruiter' | 'candidate') => void,
  children: React.ReactNode 
}> = ({ role, setRole, children }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all"
          >
            <Menu size={24} className="text-slate-600" />
          </button>
          <span className="font-black text-xl text-indigo-600 italic tracking-tighter">ScreenIQ</span>
        </div>
        <button 
          onClick={() => setRole(role === 'recruiter' ? 'candidate' : 'recruiter')} 
          className="text-[9px] bg-indigo-600 text-white px-3 py-1.5 rounded-full font-black uppercase tracking-widest shadow-md"
        >
          {role === 'recruiter' ? 'Candidate' : 'Recruiter'}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-[70] md:hidden shadow-2xl flex flex-col border-r border-slate-100"
            >
              <div className="absolute top-6 right-6">
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <SidebarContent role={role} setRole={setRole} onNav={() => setIsSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r fixed h-full overflow-y-auto z-40">
        <SidebarContent role={role} setRole={setRole} />
      </aside>

      <main className="flex-1 md:ml-64 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [role, setRole] = useState<'recruiter' | 'candidate'>('candidate');
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('alex.rivera@tech.io');

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/dashboard" element={
          <DashboardLayout role={role} setRole={setRole}>
            {role === 'recruiter' 
              ? <RecruiterDashboard jobs={jobs} candidates={candidates} role={role} /> 
              : <CandidateHome jobs={jobs} candidates={candidates} currentUserEmail={currentUserEmail} />
            }
          </DashboardLayout>
        } />
        
        <Route path="/browse" element={<DashboardLayout role={role} setRole={setRole}><CandidateBrowse jobs={jobs} /></DashboardLayout>} />
        <Route path="/applications" element={<DashboardLayout role={role} setRole={setRole}><CandidateApplications jobs={jobs} candidates={candidates} currentUserEmail={currentUserEmail} /></DashboardLayout>} />
        <Route path="/jobs/create" element={<DashboardLayout role={role} setRole={setRole}><CreateJob onSave={(job) => setJobs([job, ...jobs])} /></DashboardLayout>} />
        <Route path="/jobs/:id" element={<DashboardLayout role={role} setRole={setRole}><JobDetail jobs={jobs} candidates={candidates} setCandidates={setCandidates} /></DashboardLayout>} />
        <Route path="/analytics" element={<DashboardLayout role={role} setRole={setRole}><Analytics jobs={jobs} candidates={candidates} /></DashboardLayout>} />
        
        <Route path="/assessment/:jobId" element={
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <CandidateAssessment jobs={jobs} onComplete={(cand) => {
              setCandidates(prev => {
                const existingIdx = prev.findIndex(c => c.email === cand.email);
                if (existingIdx !== -1) {
                  const updated = [...prev];
                  const existingAppIdx = updated[existingIdx].appliedJobs.findIndex(aj => aj.jobId === cand.appliedJobs[0].jobId);
                  if (existingAppIdx !== -1) {
                    updated[existingIdx].appliedJobs[existingAppIdx] = cand.appliedJobs[0];
                  } else {
                    updated[existingIdx].appliedJobs.push(cand.appliedJobs[0]);
                  }
                  return updated;
                }
                return [...prev, cand];
              });
              setCurrentUserEmail(cand.email);
            }} />
          </div>
        } />
        <Route path="/feedback" element={<div className="max-w-7xl mx-auto p-4 md:p-8"><CandidateFeedback /></div>} />
      </Routes>
    </HashRouter>
  );
};

const SidebarLink: React.FC<{ to: string, icon: React.ReactNode, label: string, onClick?: () => void }> = ({ to, icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-indigo-600 text-white font-black shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600'}`}
    >
      <div className={isActive ? 'text-white' : 'text-slate-300 group-hover:text-indigo-600 transition-colors'}>{icon}</div>
      <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
      {isActive && <ChevronRight size={14} className="ml-auto opacity-40" />}
    </Link>
  );
};

export default App;
