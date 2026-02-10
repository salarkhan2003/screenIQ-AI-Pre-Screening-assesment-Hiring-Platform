
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Loader2, Shield, AlertTriangle, Timer,
  User, Mail, Link as LinkIcon, FileText, Camera,
  Zap, Activity, BrainCircuit, CheckCircle, ChevronRight
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
  const [timeRemaining, setTimeRemaining] = useState(600); 
  const [qStartTime, setQStartTime] = useState(Date.now());
  const [tabSwitches, setTabSwitches] = useState(0);
  const [camStatus, setCamStatus] = useState<'pending' | 'granted' | 'denied'>('pending');

  const [candidateInfo, setCandidateInfo] = useState({
    name: '',
    email: '',
    linkedin: '',
    resumeName: ''
  });

  // Stop camera helper
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Cleanup on unmount
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
    const pool = await generateAssessment(job);
    setBriefingText(brief || 'Preparing your custom assessment pool...');
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
    stopCamera(); // Ensure camera stops immediately on submission
    
    const result = await evaluateAssessment(job, activeQuestions, finalAnswers);
    const integrityScore = Math.max(0, 100 - (tabSwitches * 15));
    
    // Application is SUBMITTED if they finish. Rejection happens if they score below cutoff.
    const passesCutoff = result.score >= job.cutoffScore;

    onComplete({
      id: 'c' + Math.random().toString(36).substr(2, 9),
      name: candidateInfo.name,
      email: candidateInfo.email,
      linkedinUrl: candidateInfo.linkedin,
      appliedJobs: [{
        jobId: job.id,
        status: passesCutoff ? CandidateStatus.APPLIED : CandidateStatus.REJECTED,
        score: result.score,
        suitability: result.suitability,
        feedback: result.feedback,
        skillBreakdown: result.skillBreakdown,
        answers: finalAnswers,
        appliedAt: new Date().toISOString(),
        integrityScore,
        tabSwitches,
        multiplePersonsDetected: false 
      }]
    });
    navigate('/feedback', { state: { result: { ...result, integrityScore }, job, passed: passesCutoff } });
  };

  if (step === 'intake') return (
    <div className="max-w-2xl mx-auto py-10 animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Candidate Intake</h2>
        <p className="text-slate-500 mt-2 uppercase text-xs font-bold tracking-widest">Apply for {job?.title}</p>
      </div>
      <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 p-10 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <InputGroup label="Full Name" icon={<User size={14}/>} value={candidateInfo.name} onChange={(v:any) => setCandidateInfo({...candidateInfo, name: v})} placeholder="Jane Smith" />
          <InputGroup label="Email" icon={<Mail size={14}/>} value={candidateInfo.email} onChange={(v:any) => setCandidateInfo({...candidateInfo, email: v})} placeholder="jane@company.com" />
        </div>
        <InputGroup label="LinkedIn" icon={<LinkIcon size={14}/>} value={candidateInfo.linkedin} onChange={(v:any) => setCandidateInfo({...candidateInfo, linkedin: v})} placeholder="https://..." />
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><FileText size={14}/> Upload Resume (PDF)</label>
          <div className="relative group cursor-pointer border-4 border-dashed border-slate-100 rounded-[32px] p-8 text-center hover:border-indigo-200 transition-all bg-slate-50/50">
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setCandidateInfo({...candidateInfo, resumeName: e.target.files?.[0]?.name || ''})} />
            <div className="flex flex-col items-center gap-2">
              <FileText size={40} className={candidateInfo.resumeName ? "text-emerald-500" : "text-slate-300"} />
              <p className="font-bold text-slate-600 text-sm">{candidateInfo.resumeName || "Drop Resume to Continue"}</p>
            </div>
          </div>
        </div>
        <button disabled={!candidateInfo.name || !candidateInfo.email || !candidateInfo.resumeName} onClick={handleIntakeSubmit} className="w-full py-6 bg-indigo-600 text-white rounded-[24px] font-black text-xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 disabled:opacity-50 transition-all">Start Verification</button>
      </div>
    </div>
  );

  if (step === 'parsing') return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
      <div className="w-32 h-32 bg-indigo-50 rounded-[40px] flex items-center justify-center animate-pulse">
        <BrainCircuit size={64} className="text-indigo-600" />
      </div>
      <h3 className="text-3xl font-black text-slate-800 tracking-tight">Processing Application Profile...</h3>
    </div>
  );

  if (step === 'briefing') return (
    <div className="max-w-2xl mx-auto py-10 animate-in slide-in-from-bottom-8">
      <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-10 border-b bg-indigo-50/50 flex items-center gap-6"><Zap size={32} className="text-indigo-600" /><h3 className="text-2xl font-black text-slate-800">Assessment Briefing</h3></div>
        <div className="p-10 space-y-8">
          <div className="prose prose-slate max-w-none font-medium text-slate-600">
            {loadingBrief ? <div className="flex items-center gap-3 text-slate-400 font-bold italic"><Loader2 className="animate-spin" /> Preparing MCQ Pool...</div> : briefingText}
          </div>
          <div className="p-8 bg-slate-900 text-white rounded-[32px] space-y-3">
            <p className="text-xs font-black uppercase tracking-widest text-indigo-400">Rules of Engagement</p>
            <ul className="space-y-2 text-sm font-medium text-slate-300">
              <li className="flex gap-2">● Exactly 10 questions. 10% each.</li>
              <li className="flex gap-2">● Real-time proctoring enabled. No tab switches.</li>
              <li className="flex gap-2">● You must reach {job?.cutoffScore}% to be considered.</li>
            </ul>
          </div>
          <button disabled={loadingBrief} onClick={startSystemCheck} className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg hover:bg-indigo-700 shadow-xl">Setup Security Camera</button>
        </div>
      </div>
    </div>
  );

  if (step === 'system_check') return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="bg-white rounded-[40px] shadow-2xl p-10 space-y-8 text-center">
        <div className="aspect-video bg-slate-900 rounded-[32px] overflow-hidden border-4 border-slate-100 relative">
          <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
          {camStatus === 'granted' ? (
            <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg">IDENTITY FEED ACTIVE</div>
          ) : camStatus === 'denied' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 text-white p-6 space-y-4">
               <AlertTriangle size={48} className="text-red-500" />
               <p className="font-bold text-lg">Verification Blocked: Camera Required</p>
               <button onClick={requestCamera} className="px-8 py-3 bg-indigo-600 rounded-xl font-black text-sm uppercase shadow-xl">Retry Security Link</button>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white p-6 space-y-4">
               <Camera size={48} className="text-slate-600 mb-2" />
               <button onClick={requestCamera} className="px-10 py-5 bg-indigo-600 rounded-[28px] font-black text-base uppercase shadow-2xl hover:bg-indigo-700 transition-all">Activate Proctoring Camera</button>
            </div>
          )}
        </div>
        <button disabled={camStatus !== 'granted'} onClick={beginTest} className="w-full py-6 bg-slate-800 text-white rounded-[24px] font-black text-xl hover:bg-slate-900 disabled:opacity-50">Proceed to Assessment</button>
      </div>
    </div>
  );

  if (step === 'assessment') {
    const currentQ = activeQuestions[currentIdx];
    const progress = ((currentIdx + 1) / activeQuestions.length) * 100;
    const isLast = currentIdx === activeQuestions.length - 1;
    const hasSelected = !!answers[currentQ.id]?.value;

    return (
      <div className="max-w-4xl mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between bg-white px-8 py-5 rounded-[32px] border border-slate-100 shadow-xl sticky top-4 z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black">{currentIdx + 1}</div>
            <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }}></div></div>
          </div>
          <div className="px-4 py-2 bg-slate-900 rounded-xl font-black text-xs flex items-center gap-2 text-white shadow-lg"><Timer size={16} className="text-indigo-400" /> {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}</div>
        </div>
        <div className="bg-white p-12 md:p-16 rounded-[48px] border border-slate-100 shadow-2xl min-h-[500px] flex flex-col animate-in slide-in-from-right-8">
          <div className="mb-12 space-y-4">
            <div className="flex gap-2"><span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-3 py-1 rounded-lg uppercase border border-indigo-100">{currentQ.skill}</span><span className="bg-slate-50 text-slate-500 text-[10px] font-black px-3 py-1 rounded-lg uppercase border border-slate-100">{currentQ.difficulty}</span></div>
            <h3 className="text-3xl font-black text-slate-800 leading-tight tracking-tight">{currentQ.text}</h3>
          </div>
          <div className="flex-1 space-y-12">
            <div className="grid grid-cols-1 gap-4">
              {currentQ.options?.map((opt, i) => (
                <button key={i} onClick={() => recordOption(opt)} className={`w-full text-left p-6 rounded-[32px] border-4 transition-all flex items-center gap-5 ${answers[currentQ.id]?.value === opt ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-50 hover:bg-slate-50'}`}>
                  <span className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-lg ${answers[currentQ.id]?.value === opt ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white border-2 border-slate-100 text-slate-300'}`}>{String.fromCharCode(65 + i)}</span>
                  <span className={`text-xl font-bold ${answers[currentQ.id]?.value === opt ? 'text-indigo-900' : 'text-slate-700'}`}>{opt}</span>
                </button>
              ))}
            </div>
            
            <div className="pt-8 border-t border-slate-50 flex justify-end">
              {isLast ? (
                <button 
                  disabled={!hasSelected}
                  onClick={() => submitTest(answers)}
                  className="px-12 py-6 bg-emerald-600 text-white rounded-[32px] font-black text-xl hover:bg-emerald-700 shadow-2xl shadow-emerald-200 disabled:opacity-50 flex items-center gap-3 transition-all transform active:scale-95"
                >
                  <CheckCircle size={28} /> Finish & Submit Application
                </button>
              ) : (
                <button 
                  disabled={!hasSelected}
                  onClick={nextQuestion}
                  className="px-12 py-6 bg-indigo-600 text-white rounded-[32px] font-black text-xl hover:bg-indigo-700 shadow-2xl shadow-indigo-200 disabled:opacity-50 flex items-center gap-3 transition-all"
                >
                  Next Question <ChevronRight size={24} />
                </button>
              )}
            </div>
          </div>
        </div>
        {tabSwitches > 0 && <div className="bg-red-50 text-red-600 p-6 rounded-[32px] border border-red-100 flex items-center gap-4 animate-pulse shadow-sm"><AlertTriangle size={24} /><p className="text-xs font-black uppercase tracking-widest leading-relaxed">Security Alert: {tabSwitches} integrity violations logged. This attempt is being flagged for recruiter review.</p></div>}
      </div>
    );
  }

  if (step === 'submitting') return <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6"><Loader2 className="animate-spin text-indigo-600" size={64} /><h3 className="text-3xl font-black text-slate-800 tracking-tight">Finalizing Verified Evaluation...</h3></div>;
  return null;
};

const InputGroup = ({ label, icon, value, onChange, placeholder }: any) => (
  <div className="space-y-2 text-left">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">{icon} {label}</label>
    <input type="text" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-700 shadow-sm" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
  </div>
);

export default CandidateAssessment;
