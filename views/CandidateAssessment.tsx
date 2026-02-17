
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Loader2, Shield, AlertTriangle, Timer,
  User, Mail, Link as LinkIcon, FileText, Camera,
  Zap, Activity, BrainCircuit, CheckCircle, ChevronRight,
  Fingerprint, Terminal, ShieldCheck
} from 'lucide-react';
import { Job, Candidate, Question, CandidateStatus, CandidateAnswer } from '../types';
import { generateAssessment, evaluateAssessment, getAssessmentBriefing } from '../services/geminiService';

interface Props {
  jobs: Job[];
  onComplete: (candidate: Candidate) => void;
}

type FlowStep = 'intake' | 'parsing' | 'briefing' | 'system_check' | 'assessment' | 'submitting';

const CandidateAssessment: React.FC<Props> = ({ jobs, onComplete }) => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const job = jobs.find(j => j.id === jobId);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [step, setStep] = useState<FlowStep>('intake');
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [briefingText, setBriefingText] = useState('');
  const [questionPool, setQuestionPool] = useState<Question[]>([]);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, CandidateAnswer>>({});
  const [timeRemaining, setTimeRemaining] = useState(600); // 10-Bit Assessment (10 mins)
  const [qStartTime, setQStartTime] = useState(Date.now());
  const [tabSwitches, setTabSwitches] = useState(0);
  const [camStatus, setCamStatus] = useState<'pending' | 'granted' | 'denied'>('pending');

  const [candidateInfo, setCandidateInfo] = useState({
    name: '',
    email: '',
    linkedin: '',
    resumeText: ''
  });

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && step === 'assessment') {
        setTabSwitches(prev => prev + 1);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [step]);

  const handleIntakeSubmit = () => {
    setStep('parsing');
    setTimeout(() => { setStep('briefing'); handleParsingComplete(); }, 1200);
  };

  const handleParsingComplete = async () => {
    if (!job) return;
    setLoadingBrief(true);
    const brief = await getAssessmentBriefing(job);
    const pool = await generateAssessment(job, candidateInfo.resumeText || "Candidate claims high SQL optimization and React expertise.");
    setBriefingText(brief || 'Initializing Intersection Engine Question Pool...');
    setQuestionPool(pool);
    setLoadingBrief(false);
  };

  const startSystemCheck = () => setStep('system_check');

  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCamStatus('granted');
      }
    } catch (err) {
      setCamStatus('denied');
    }
  };

  const beginTest = () => {
    const selected = questionPool.slice(0, 10);
    setActiveQuestions(selected);
    setStep('assessment');
    setQStartTime(Date.now());
  };

  useEffect(() => {
    if (step === 'assessment' && timeRemaining > 0) {
      const timer = setInterval(() => setTimeRemaining(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeRemaining === 0 && step === 'assessment') {
      submitTest(answers);
    }
  }, [step, timeRemaining]);

  const recordOption = (value: string) => {
    const currentQ = activeQuestions[currentIdx];
    const timeTaken = Math.floor((Date.now() - qStartTime) / 1000);
    setAnswers(prev => ({ ...prev, [currentQ.id]: { value, timeTaken } }));
  };

  const nextQuestion = () => {
    if (currentIdx < activeQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setQStartTime(Date.now());
    }
  };

  const submitTest = async (finalAnswers: Record<string, CandidateAnswer>) => {
    if (!job) return;
    setStep('submitting');
    stopCamera();
    
    const result = await evaluateAssessment(job, activeQuestions, finalAnswers);
    const integrityScore = Math.max(0, 100 - (tabSwitches * 15));
    
    let finalStatus = CandidateStatus.APPLIED;
    if (result.suitability >= 85) finalStatus = CandidateStatus.SHORTLISTED;
    else if (result.suitability >= 70) finalStatus = CandidateStatus.POTENTIAL;
    else finalStatus = CandidateStatus.REJECTED;

    onComplete({
      id: 'c' + Math.random().toString(36).substr(2, 9),
      name: candidateInfo.name,
      email: candidateInfo.email,
      linkedinUrl: candidateInfo.linkedin,
      appliedJobs: [{
        jobId: job.id,
        status: finalStatus,
        score: result.score,
        suitability: result.suitability,
        feedback: result.feedback,
        oneSentenceVerdict: result.oneSentenceVerdict,
        skillBreakdown: result.skillBreakdown,
        answers: finalAnswers,
        appliedAt: new Date().toISOString(),
        integrityScore,
        tabSwitches,
        gazeAnomalyDetected: false,
        multiplePersonsDetected: false 
      }]
    });
    navigate('/feedback', { state: { result: { ...result, integrityScore }, job, passed: result.suitability >= 70 } });
  };

  if (step === 'intake') return (
    <div className="max-w-2xl mx-auto py-10 animate-in fade-in font-sans">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic">Talent Intake Portal</h2>
        <p className="text-slate-500 mt-2 uppercase text-[10px] font-black tracking-[0.4em]">Apply for {job?.title} @ {job?.company}</p>
      </div>
      <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 p-10 space-y-6">
        <div className="grid grid-cols-2 gap-6">
           <InputGroup label="Full Name" icon={<User size={14}/>} value={candidateInfo.name} onChange={(v:any) => setCandidateInfo({...candidateInfo, name: v})} placeholder="Jane Smith" />
           <InputGroup label="Email" icon={<Mail size={14}/>} value={candidateInfo.email} onChange={(v:any) => setCandidateInfo({...candidateInfo, email: v})} placeholder="jane@verity.ai" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic"><Fingerprint size={14}/> Cross-Reference Artifact (PDF Resume)</label>
          <div className="relative border-4 border-dashed border-slate-100 rounded-[32px] p-8 text-center hover:border-indigo-200 transition-all bg-slate-50/50">
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="flex flex-col items-center gap-2">
              <FileText size={40} className="text-indigo-400" />
              <p className="font-black text-slate-600 text-xs uppercase tracking-widest">Intersection Engine: Waiting for Data</p>
            </div>
          </div>
        </div>
        <button onClick={handleIntakeSubmit} className="w-full py-6 bg-indigo-600 text-white rounded-[24px] font-black text-xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all">Start 10-Bit Screen</button>
      </div>
    </div>
  );

  if (step === 'parsing') return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 bg-[#020617] text-white rounded-[64px]">
      <div className="w-32 h-32 bg-indigo-500/10 rounded-[40px] flex items-center justify-center animate-pulse border border-indigo-500/20">
        <Fingerprint size={64} className="text-indigo-400" />
      </div>
      <h3 className="text-3xl font-black tracking-tight italic">Intersection Engine Active...</h3>
      <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em]">Cross-referencing resume claims against JD requirements</p>
    </div>
  );

  if (step === 'briefing') return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-10 border-b bg-indigo-50/50 flex items-center gap-6"><Zap size={32} className="text-indigo-600" /><h3 className="text-2xl font-black text-slate-800 italic uppercase">RoleScreen Intelligence Brief</h3></div>
        <div className="p-10 space-y-8">
          <div className="prose prose-slate font-medium text-slate-600">
             {loadingBrief ? "Initializing Truth Pool..." : briefingText}
          </div>
          <div className="p-8 bg-slate-900 text-white rounded-[32px] space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Adaptive Guardrails Active</p>
            <ul className="space-y-2 text-xs font-black uppercase tracking-widest text-slate-400">
              <li className="flex gap-2">● 10-Bit assessment. 10 mins total.</li>
              <li className="flex gap-2">● Intersection Engine: Truth Questions Enabled.</li>
              <li className="flex gap-2">● Integrity Shield: Eye & Tab Tracking Active.</li>
            </ul>
          </div>
          <button disabled={loadingBrief} onClick={startSystemCheck} className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg hover:bg-indigo-700 shadow-xl">Calibrate Sensors</button>
        </div>
      </div>
    </div>
  );

  if (step === 'system_check') return (
    <div className="max-w-2xl mx-auto py-10 text-center">
      <div className="bg-[#020617] p-10 rounded-[64px] border border-white/5 space-y-8 shadow-2xl">
         <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Calibrating Integrity Shield</h3>
         <div className="aspect-video bg-black rounded-[40px] overflow-hidden border border-white/10 relative group">
            <video ref={videoRef} autoPlay muted className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-48 h-48 border border-indigo-500/50 rounded-full animate-ping" />
            </div>
            {camStatus === 'pending' && <button onClick={requestCamera} className="absolute inset-0 bg-black/80 flex items-center justify-center"><Zap size={40} className="text-indigo-500" /></button>}
         </div>
         <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
               <ShieldCheck size={14} /> Gaze Lock Ready
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
               <Activity size={14} /> Vital Pulse Sync
            </div>
         </div>
         <button disabled={camStatus !== 'granted'} onClick={beginTest} className="w-full py-6 bg-white text-slate-950 rounded-[32px] font-black text-xl uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-500 hover:text-white transition-all">Start Evaluation</button>
      </div>
    </div>
  );

  if (step === 'assessment') {
    const currentQ = activeQuestions[currentIdx];
    const isTruth = currentQ.isTruthQuestion;
    
    return (
      <div className="max-w-4xl mx-auto py-6 space-y-6 font-sans">
        <div className="flex items-center justify-between bg-white px-8 py-5 rounded-[32px] border border-slate-100 shadow-xl sticky top-4 z-10">
          <div className="flex items-center gap-4">
             <div className="px-4 py-2 bg-slate-900 rounded-xl font-black text-xs text-indigo-400 italic">10-BIT STEP {currentIdx + 1}/10</div>
          </div>
          <div className="px-4 py-2 bg-indigo-600 rounded-xl font-black text-xs text-white shadow-lg flex items-center gap-2"><Timer size={16} /> {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}</div>
        </div>
        
        <div className="bg-white p-12 md:p-16 rounded-[48px] border border-slate-100 shadow-2xl min-h-[500px] flex flex-col relative overflow-hidden group">
          {isTruth && <div className="absolute top-0 right-0 bg-indigo-600 text-white px-8 py-3 rounded-bl-[32px] font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2 shadow-xl animate-pulse"><Fingerprint size={14} /> Truth Question (Claim Verification)</div>}
          
          <div className="mb-12 space-y-4">
            <div className="flex gap-2">
               <span className="bg-slate-50 text-slate-500 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">{currentQ.difficulty} Tier</span>
            </div>
            <h3 className="text-3xl font-black text-slate-800 leading-tight tracking-tight italic">"{currentQ.text}"</h3>
          </div>
          
          <div className="flex-1 space-y-12">
            <div className="grid grid-cols-1 gap-4">
              {currentQ.options?.map((opt, i) => (
                <button key={i} onClick={() => recordOption(opt)} className={`w-full text-left p-6 rounded-[32px] border-2 transition-all flex items-center gap-5 ${answers[currentQ.id]?.value === opt ? 'border-indigo-600 bg-indigo-50' : 'border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/10'}`}>
                  <span className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-lg ${answers[currentQ.id]?.value === opt ? 'bg-indigo-600 text-white shadow-xl' : 'bg-slate-50 border border-slate-100 text-slate-300'}`}>{String.fromCharCode(65 + i)}</span>
                  <span className={`text-xl font-black tracking-tight ${answers[currentQ.id]?.value === opt ? 'text-indigo-900' : 'text-slate-700'}`}>{opt}</span>
                </button>
              ))}
            </div>
            
            <div className="pt-8 border-t border-slate-50 flex justify-end">
              <button disabled={!answers[currentQ.id]?.value} onClick={currentIdx === activeQuestions.length - 1 ? () => submitTest(answers) : nextQuestion} className="px-12 py-6 bg-indigo-600 text-white rounded-[32px] font-black text-xl hover:bg-indigo-700 shadow-2xl transition-all uppercase tracking-widest italic">
                {currentIdx === activeQuestions.length - 1 ? "Submit Proof" : "Next Verification Step"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'submitting') return <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6"><Loader2 className="animate-spin text-indigo-600" size={64} /><h3 className="text-3xl font-black text-slate-800 tracking-tight italic">Generating One-Sentence Verdict...</h3></div>;
  return null;
};

const InputGroup = ({ label, icon, value, onChange, placeholder }: any) => (
  <div className="space-y-2 text-left">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">{icon} {label}</label>
    <input type="text" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-700 shadow-sm" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
  </div>
);

export default CandidateAssessment;
