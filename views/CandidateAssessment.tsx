
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Loader2, ShieldCheck, Timer, User, Mail, FileText, 
  Zap, Activity, Fingerprint, ChevronRight, Terminal, Scan
} from 'lucide-react';
import { Job, Candidate, Question, CandidateStatus, CandidateAnswer } from '../types';
import { generateAssessment, evaluateAssessment, getAssessmentBriefing } from '../services/geminiService';

type FlowStep = 'intake' | 'parsing' | 'briefing' | 'system_check' | 'assessment' | 'submitting';

const CandidateAssessment: React.FC<{ jobs: Job[], onComplete: (c: Candidate) => void }> = ({ jobs, onComplete }) => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const job = jobs.find(j => j.id === jobId);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [step, setStep] = useState<FlowStep>('intake');
  const [briefingText, setBriefingText] = useState('');
  const [questionPool, setQuestionPool] = useState<Question[]>([]);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, CandidateAnswer>>({});
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [qStartTime, setQStartTime] = useState(Date.now());
  const [camStatus, setCamStatus] = useState<'pending' | 'granted' | 'denied'>('pending');

  const [candidateInfo, setCandidateInfo] = useState({ name: '', email: '', resumeText: '' });

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleIntakeSubmit = () => {
    setStep('parsing');
    setTimeout(() => { setStep('briefing'); handleParsingComplete(); }, 2000);
  };

  const handleParsingComplete = async () => {
    if (!job) return;
    const [brief, pool] = await Promise.all([
      getAssessmentBriefing(job),
      generateAssessment(job, "Candidate claims high SQL optimization and React expertise.")
    ]);
    setBriefingText(brief || 'Initializing Verification Flow...');
    setQuestionPool(pool);
  };

  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCamStatus('granted');
      }
    } catch (err) { setCamStatus('denied'); }
  };

  const beginTest = () => {
    setActiveQuestions(questionPool.slice(0, 10));
    setStep('assessment');
    setQStartTime(Date.now());
  };

  const recordOption = (value: string) => {
    const timeTaken = Math.floor((Date.now() - qStartTime) / 1000);
    setAnswers(prev => ({ ...prev, [activeQuestions[currentIdx].id]: { value, timeTaken } }));
    if (currentIdx < activeQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setQStartTime(Date.now());
    } else {
      submitTest({ ...answers, [activeQuestions[currentIdx].id]: { value, timeTaken } });
    }
  };

  const submitTest = async (finalAnswers: Record<string, CandidateAnswer>) => {
    if (!job) return;
    setStep('submitting');
    stopCamera();
    const result = await evaluateAssessment(job, activeQuestions, finalAnswers);
    onComplete({
      id: 'c' + Math.random().toString(36).substr(2, 9),
      name: candidateInfo.name,
      email: candidateInfo.email,
      appliedJobs: [{
        jobId: job.id,
        status: result.suitability >= 85 ? CandidateStatus.SHORTLISTED : result.suitability >= 70 ? CandidateStatus.POTENTIAL : CandidateStatus.REJECTED,
        score: result.score,
        suitability: result.suitability,
        feedback: result.feedback,
        oneSentenceVerdict: result.oneSentenceVerdict,
        skillBreakdown: result.skillBreakdown,
        answers: finalAnswers,
        appliedAt: new Date().toISOString(),
        integrityScore: 100,
      }]
    });
    navigate('/feedback', { state: { result, job, passed: result.suitability >= 70 } });
  };

  if (step === 'intake') return (
    <div className="max-w-xl mx-auto py-20 animate-in fade-in zoom-in-95 font-sans">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-6xl font-[900] text-white tracking-tighter italic uppercase leading-none">RoleScreen <br /> <span className="text-indigo-500">Intake</span></h2>
        <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.5em]">Verification Gate for {job?.title}</p>
      </div>
      <div className="glass-ios-dark rounded-[56px] border border-white/5 p-12 space-y-10 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
        <div className="space-y-6">
           <InputGroup label="Full Name" icon={<User size={14}/>} value={candidateInfo.name} onChange={(v:any) => setCandidateInfo({...candidateInfo, name: v})} placeholder="Alex Verity" />
           <InputGroup label="Email" icon={<Mail size={14}/>} value={candidateInfo.email} onChange={(v:any) => setCandidateInfo({...candidateInfo, email: v})} placeholder="alex@tech.io" />
        </div>
        <div className="space-y-4">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2 italic"><Fingerprint size={14}/> Artifact Ingestion (PDF)</label>
          <div className="relative border-2 border-dashed border-white/10 rounded-[32px] p-10 text-center hover:border-indigo-500/50 transition-all bg-white/[0.02]">
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="flex flex-col items-center gap-4">
              <FileText size={48} className="text-indigo-500 opacity-50" />
              <p className="font-black text-white text-xs uppercase tracking-widest">Awaiting Resume Data</p>
            </div>
          </div>
        </div>
        <button onClick={handleIntakeSubmit} className="w-full py-8 bg-indigo-600 text-white rounded-[32px] font-black text-2xl uppercase tracking-widest shadow-2xl hover:bg-indigo-500 active:scale-95 transition-all">Launch Screen</button>
      </div>
    </div>
  );

  if (step === 'parsing') return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-8">
      <div className="w-32 h-32 bg-indigo-600/10 squircle flex items-center justify-center animate-pulse border border-indigo-600/20 shadow-[0_0_80px_rgba(79,70,229,0.2)]">
        <Fingerprint size={64} className="text-indigo-500" />
      </div>
      <h3 className="text-4xl font-black italic tracking-tighter uppercase">Initializing Engine...</h3>
      <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.5em]">Cross-Proof Logic Generation In Progress</p>
    </div>
  );

  if (step === 'briefing') return (
    <div className="max-w-2xl mx-auto py-20">
      <div className="glass-ios-dark rounded-[56px] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-12 border-b border-white/5 bg-white/[0.02] flex items-center gap-6"><Zap size={40} className="text-indigo-500" /><h3 className="text-3xl font-[900] text-white italic tracking-tighter uppercase">Intelligence Brief</h3></div>
        <div className="p-12 space-y-12">
          <div className="text-xl font-bold leading-relaxed text-zinc-300 italic">"{briefingText}"</div>
          <div className="p-10 bg-indigo-600 text-white rounded-[40px] space-y-6 shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">System Guardrails</p>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
              <li className="flex items-center gap-4"><CheckCircle2 size={16}/> 10-Bit Screen. 10m limit.</li>
              <li className="flex items-center gap-4"><CheckCircle2 size={16}/> Truth Logic Enabled.</li>
              <li className="flex items-center gap-4"><CheckCircle2 size={16}/> Identity Shield Sync.</li>
            </ul>
          </div>
          <button onClick={() => setStep('system_check')} className="w-full py-6 bg-white text-black rounded-[32px] font-black text-xl uppercase tracking-widest shadow-xl hover:bg-zinc-100 active:scale-95 transition-all">Calibrate Identity</button>
        </div>
      </div>
    </div>
  );

  if (step === 'system_check') return (
    <div className="max-w-2xl mx-auto py-20 text-center">
      <div className="glass-ios-dark p-12 rounded-[56px] border border-white/5 space-y-10 shadow-2xl">
         <h3 className="text-3xl font-[900] text-white italic tracking-tighter uppercase leading-none">Identity Calibration</h3>
         <div className="aspect-video bg-black rounded-[48px] overflow-hidden border border-white/10 relative group shadow-inner">
            <video ref={videoRef} autoPlay muted className="w-full h-full object-cover grayscale transition-all duration-1000" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-48 h-48 border-2 border-indigo-500/50 rounded-full animate-ping" />
            </div>
            {camStatus === 'pending' && <button onClick={requestCamera} className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4"><Scan size={64} className="text-indigo-500" /> <span className="text-[10px] font-black uppercase tracking-widest">Request Access</span></button>}
         </div>
         <div className="flex justify-center gap-8">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-emerald-500">
               <ShieldCheck size={18} /> Gaze Lock Ready
            </div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-emerald-500">
               <Activity size={18} /> Bio-Pulse Sync
            </div>
         </div>
         <button disabled={camStatus !== 'granted'} onClick={beginTest} className="w-full py-8 bg-indigo-600 text-white rounded-[40px] font-black text-2xl uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-indigo-500 active:scale-95 transition-all">Initialize Verification</button>
      </div>
    </div>
  );

  if (step === 'assessment') {
    const currentQ = activeQuestions[currentIdx];
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-10 font-sans">
        <div className="flex items-center justify-between glass-ios-dark px-10 py-6 rounded-[32px] border border-white/5 shadow-2xl">
          <div className="px-6 py-2 bg-white/5 rounded-full font-black text-[10px] text-indigo-400 uppercase tracking-widest">10-BIT STEP {currentIdx + 1}/10</div>
          <div className="px-6 py-2 bg-indigo-600 rounded-full font-black text-[10px] text-white shadow-lg flex items-center gap-3 uppercase tracking-widest"><Timer size={16} /> {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}</div>
        </div>
        
        <div className="glass-ios-dark p-16 md:p-24 rounded-[64px] border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden group min-h-[600px]">
          <div className="absolute top-0 right-0 bg-indigo-600 text-white px-10 py-4 rounded-bl-[40px] font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-3 shadow-2xl animate-pulse"><Fingerprint size={16} /> Identity Sync Active</div>
          
          <div className="mb-16 space-y-6">
            <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-indigo-500/20">{currentQ.difficulty} Tier Assessment</span>
            <h3 className="text-4xl md:text-5xl font-[900] text-white leading-[1.1] tracking-tight italic uppercase">"{currentQ.text}"</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {currentQ.options?.map((opt, i) => (
              <button key={i} onClick={() => recordOption(opt)} className="w-full text-left p-8 rounded-[40px] glass-ios-dark border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex items-center gap-8 group/opt active:scale-[0.98]">
                <span className="w-14 h-14 flex items-center justify-center rounded-[24px] font-black text-2xl bg-white/5 border border-white/10 text-zinc-500 group-hover/opt:bg-indigo-600 group-hover/opt:text-white transition-all shadow-lg">{String.fromCharCode(65 + i)}</span>
                <span className="text-2xl font-black italic tracking-tight text-white/80 group-hover/opt:text-white transition-all">{opt}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'submitting') return <div className="min-h-screen flex flex-col items-center justify-center space-y-10"><Loader2 className="animate-spin text-indigo-600" size={80} /><h3 className="text-5xl font-[900] text-white tracking-tighter italic uppercase animate-pulse">Encoding Verdict...</h3></div>;
  return null;
};

const InputGroup = ({ label, icon, value, onChange, placeholder }: any) => (
  <div className="space-y-4 text-left group">
    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-3 italic">{icon} {label}</label>
    <input type="text" className="w-full px-8 py-5 glass-ios-dark border border-white/10 rounded-[32px] focus:border-indigo-500/50 focus:bg-indigo-500/5 outline-none transition-all font-black text-white text-lg shadow-inner group-hover:border-white/20" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
  </div>
);

const CheckCircle2 = ({ size, className }: any) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>
  </svg>
);

export default CandidateAssessment;
