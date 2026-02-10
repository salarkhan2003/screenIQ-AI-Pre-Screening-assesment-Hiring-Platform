
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, User, Briefcase, ChevronRight, LogIn, CheckCircle, XCircle, Search, BarChart2, LogOut } from 'lucide-react';
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
  },
  {
    id: 'j4',
    title: 'Systems Architect',
    company: 'Tesla',
    description: 'Architecting the software backbone for autonomous driving and energy systems.',
    department: 'Engineering',
    experienceLevel: 'Lead',
    skills: ['C++', 'Python', 'RTOS'],
    status: 'active',
    createdAt: new Date().toISOString(),
    cutoffScore: 85,
    isProctoringEnabled: true,
    difficultySetting: 'Senior',
    marketBenchmarkScore: 90,
    idealSkillProfile: { 'Systems': 98, 'Math': 95, 'Logic': 90 },
    knockoutQuestions: [],
    rejectionDelay: '7 Days',
    autoNotify: true
  },
  {
    id: 'j5',
    title: 'Growth Marketing Lead',
    company: 'Spotify',
    description: 'Scale our user acquisition channels across global markets. Data-driven mindset is essential.',
    department: 'Marketing',
    experienceLevel: 'Senior',
    skills: ['SEO', 'Performance Marketing', 'SQL'],
    status: 'active',
    createdAt: new Date().toISOString(),
    cutoffScore: 70,
    isProctoringEnabled: true,
    difficultySetting: 'Mid',
    marketBenchmarkScore: 78,
    idealSkillProfile: { 'Growth': 90, 'Analytics': 85, 'Domain': 80 },
    knockoutQuestions: [],
    rejectionDelay: '24 Hours',
    autoNotify: true
  },
  {
    id: 'j6',
    title: 'Fullstack Engineer',
    company: 'Stripe',
    description: 'Build the economic infrastructure for the internet. Work across the stack to deliver elegant payment experiences.',
    department: 'Engineering',
    experienceLevel: 'Mid',
    skills: ['Ruby', 'React', 'API Design'],
    status: 'active',
    createdAt: new Date().toISOString(),
    cutoffScore: 80,
    isProctoringEnabled: true,
    difficultySetting: 'Mid',
    marketBenchmarkScore: 88,
    idealSkillProfile: { 'Engineering': 95, 'Product': 80, 'Logic': 90 },
    knockoutQuestions: [],
    rejectionDelay: 'Instant',
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

const DashboardLayout: React.FC<{ 
  role: 'recruiter' | 'candidate', 
  setRole: (r: 'recruiter' | 'candidate') => void,
  children: React.ReactNode 
}> = ({ role, setRole, children }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-50">
        <span className="font-bold text-xl text-indigo-600">ScreenIQ</span>
        <button onClick={() => setRole(role === 'recruiter' ? 'candidate' : 'recruiter')} className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
          Switch to {role === 'recruiter' ? 'Candidate' : 'Recruiter'}
        </button>
      </div>

      <aside className="hidden md:flex flex-col w-64 bg-white border-r fixed h-full overflow-y-auto z-40">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <CheckCircle className="w-8 h-8" /> ScreenIQ
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">AI Pre-Screening</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          {role === 'recruiter' ? (
            <>
              <SidebarLink to="/jobs/create" icon={<PlusCircle size={20} />} label="Post a Job" />
              <SidebarLink to="/analytics" icon={<BarChart2 size={20} />} label="Analytics" />
            </>
          ) : (
            <>
              <SidebarLink to="/browse" icon={<Search size={20} />} label="Find Jobs" />
              <SidebarLink to="/applications" icon={<Briefcase size={20} />} label="My Applications" />
            </>
          )}
        </nav>

        <div className="p-4 border-t mt-auto space-y-2">
          <button 
            onClick={() => setRole(role === 'recruiter' ? 'candidate' : 'recruiter')}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-xs font-medium"
          >
            <LogIn size={16} /> Switch to {role === 'recruiter' ? 'Candidate' : 'Recruiter'}
          </button>
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-xs font-black uppercase tracking-widest"
          >
            <LogOut size={16} /> Exit Platform
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
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

const SidebarLink: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}`}
    >
      {icon}
      <span>{label}</span>
      {isActive && <ChevronRight size={16} className="ml-auto" />}
    </Link>
  );
};

export default App;
