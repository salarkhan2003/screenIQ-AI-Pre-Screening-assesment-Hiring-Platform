
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Save, ArrowLeft, Loader2, Info, Target, 
  Briefcase, Shield, Share2, Wand2, Plus, Trash2, 
  Eye, Clock, Bell, CheckCircle2, Zap, AlertCircle, X
} from 'lucide-react';
import { Job, ExperienceLevel, KnockoutQuestion, Question } from '../types';
import { optimizeJobDescription, generateAssessment } from '../services/geminiService';

interface Props {
  onSave: (job: Job) => void;
}

const CreateJob: React.FC<Props> = ({ onSave }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewQs, setPreviewQs] = useState<Question[]>([]);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const [formData, setFormData] = useState<Partial<Job>>({
    title: '',
    department: 'Engineering',
    experienceLevel: 'Mid',
    skills: [],
    description: '',
    status: 'active',
    cutoffScore: 75,
    isProctoringEnabled: true,
    difficultySetting: 'Mid',
    knockoutQuestions: [],
    rejectionDelay: '24 Hours',
    autoNotify: true
  });

  const [skillInput, setSkillInput] = useState('');
  const [knockoutInput, setKnockoutInput] = useState('');

  const handleOptimize = async () => {
    if (!formData.title || !formData.description) return alert("Fill title and description first!");
    setLoading(true);
    const optimized = await optimizeJobDescription(formData);
    setFormData(prev => ({ ...prev, description: optimized }));
    setLoading(false);
  };

  const addKnockout = () => {
    if (!knockoutInput) return;
    const newK: KnockoutQuestion = {
      id: Math.random().toString(36).substr(2, 9),
      text: knockoutInput,
      requiredAnswer: true
    };
    setFormData(prev => ({
      ...prev,
      knockoutQuestions: [...(prev.knockoutQuestions || []), newK]
    }));
    setKnockoutInput('');
  };

  const removeKnockout = (id: string) => {
    setFormData(prev => ({
      ...prev,
      knockoutQuestions: prev.knockoutQuestions?.filter(k => k.id !== id)
    }));
  };

  const handlePreviewAssessment = async () => {
    if (!formData.title || !formData.skills?.length) return alert("Add a title and at least one skill to preview.");
    setLoadingPreview(true);
    setIsPreviewing(true);
    const sample = await generateAssessment({ ...formData, skills: formData.skills } as Job);
    setPreviewQs(sample.slice(0, 3));
    setLoadingPreview(false);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) return alert("Please fill in basic details.");
    setLoading(true);
    const newJob: Job = {
      ...formData as Job,
      id: 'j' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      marketBenchmarkScore: 62,
      idealSkillProfile: {
        'Technical': 80,
        'Logic': 80,
        'Domain': 80
      }
    };
    
    onSave(newJob);
    setLoading(false);
    navigate('/');
  };

  const addSkill = () => {
    if (skillInput && !formData.skills?.includes(skillInput)) {
      setFormData({ ...formData, skills: [...(formData.skills || []), skillInput] });
      setSkillInput('');
    }
  };

  const expLevels: ExperienceLevel[] = ['Intern', 'Fresher', 'Junior', 'Mid', 'Senior', 'Expert', 'Lead'];

  return (
    <div className="max-w-7xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-40">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="p-4 hover:bg-white rounded-[24px] transition-all border border-slate-100 shadow-sm bg-slate-50 text-slate-400 hover:text-indigo-600">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Infrastructure Setup</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-1">Configuring AI Recruitment Gates</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Card 1: Identity & Strategy */}
        <div className="space-y-8">
          <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 p-10 space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Briefcase size={20} />
              </div>
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Role Identity</h3>
            </div>

            <div className="space-y-6">
              <Input label="Role Title" value={formData.title} onChange={v => setFormData({...formData, title: v})} placeholder="e.g. Lead Backend Architect" />
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience Tier</label>
                <div className="grid grid-cols-2 gap-2">
                  {expLevels.map(lvl => (
                    <button 
                      key={lvl}
                      onClick={() => setFormData({...formData, experienceLevel: lvl})}
                      className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border-2 ${formData.experienceLevel === lvl ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-200'}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role Vision</label>
                  <button onClick={handleOptimize} disabled={loading} className="text-[9px] font-black text-indigo-600 uppercase flex items-center gap-1 hover:underline disabled:opacity-50">
                    <Wand2 size={12} /> Optimize with AI
                  </button>
                </div>
                <textarea 
                  rows={6}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the core impact of this role..."
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-3xl focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium text-slate-600 text-sm leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Assessment Logic */}
        <div className="space-y-8">
          <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 p-10 space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <Zap size={20} />
              </div>
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Assessment Intelligence</h3>
            </div>

            <div className="space-y-8">
              {/* Skill Gating */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Skill Focus (AI targets these)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && addSkill()}
                    className="flex-1 px-4 py-3 bg-slate-50 rounded-xl font-bold text-sm outline-none border-2 border-transparent focus:border-indigo-100"
                    placeholder="e.g. Docker"
                  />
                  <button onClick={addSkill} className="p-3 bg-slate-900 text-white rounded-xl"><Plus size={18} /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills?.map(s => (
                    <span key={s} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase rounded-lg border border-indigo-100 flex items-center gap-2">
                      {s} <button onClick={() => setFormData({...formData, skills: formData.skills?.filter(sk => sk !== s)})}><X size={12}/></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Threshold Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Passing Gating</label>
                  <span className="text-xl font-black text-indigo-600">{formData.cutoffScore}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="5"
                  value={formData.cutoffScore}
                  onChange={e => setFormData({...formData, cutoffScore: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Knockout Questions */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Knock-out Gates (Binary Rejection)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={knockoutInput}
                    onChange={e => setKnockoutInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && addKnockout()}
                    className="flex-1 px-4 py-3 bg-slate-50 rounded-xl font-bold text-sm outline-none border-2 border-transparent focus:border-indigo-100"
                    placeholder="e.g. Willing to relocate?"
                  />
                  <button onClick={addKnockout} className="p-3 bg-slate-900 text-white rounded-xl"><Plus size={18} /></button>
                </div>
                <div className="space-y-2">
                  {formData.knockoutQuestions?.map(k => (
                    <div key={k.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-xs font-bold text-slate-700">{k.text}</span>
                      <button onClick={() => removeKnockout(k.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Automation & Trust */}
        <div className="space-y-8">
          <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 p-10 space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                <Zap size={20} />
              </div>
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Workflow Automation</h3>
            </div>

            <div className="space-y-8">
              {/* Ghosting Prevention */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ghosting Prevention (Rejection Delay)</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Instant', '24 Hours', '3 Days', '7 Days'].map(d => (
                    <button 
                      key={d}
                      onClick={() => setFormData({...formData, rejectionDelay: d as any})}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.rejectionDelay === d ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-slate-400 font-medium italic">Rejection emails will be held to ensure a human feel.</p>
              </div>

              {/* Integrity Monitor */}
              <div className="flex items-center justify-between p-5 bg-indigo-50/50 rounded-3xl border border-indigo-100">
                <div className="space-y-0.5">
                  <p className="text-[11px] font-black text-indigo-900 uppercase">Integrity Monitor</p>
                  <p className="text-[9px] text-indigo-500 font-bold uppercase">Tab & Camera Tracking</p>
                </div>
                <button 
                  onClick={() => setFormData({...formData, isProctoringEnabled: !formData.isProctoringEnabled})}
                  className={`w-12 h-6 rounded-full relative transition-all ${formData.isProctoringEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isProctoringEnabled ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {/* Assessment Preview */}
              <button 
                onClick={handlePreviewAssessment}
                className="w-full py-4 bg-white border-2 border-indigo-100 text-indigo-600 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
              >
                <Eye size={16} /> Preview AI Question Pool
              </button>
            </div>
          </div>

          {/* Health Check & Launch */}
          <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl space-y-6">
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Pipeline Health Check</h4>
              <div className="space-y-2">
                <CheckItem label="JD Analysis Complete" active={!!formData.description} />
                <CheckItem label="15-Quest Pool Ready" active={!!formData.skills?.length} />
                <CheckItem label="Knock-out Logic Set" active={!!formData.knockoutQuestions?.length} />
              </div>
            </div>

            <button 
              onClick={handleSave}
              disabled={loading}
              className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[24px] font-black text-xl shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Zap size={24} />} Launch Infrastructure
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewing && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-8">
          <div className="bg-white rounded-[48px] max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Eye className="text-indigo-600" />
                <h4 className="text-2xl font-black text-slate-800 tracking-tight">AI Assessment Preview</h4>
              </div>
              <button onClick={() => setIsPreviewing(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={24}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              {loadingPreview ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <Loader2 className="animate-spin text-indigo-600" size={40} />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Generating Sample Pool...</p>
                </div>
              ) : (
                previewQs.map((q, i) => (
                  <div key={q.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Sample #{i+1} • {q.difficulty}</span>
                    </div>
                    <p className="font-bold text-slate-800 leading-relaxed">{q.text}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options?.map(opt => (
                        <div key={opt} className={`px-4 py-2 rounded-xl text-[10px] font-bold border ${opt === q.correctAnswer ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-white border-slate-100 text-slate-400'}`}>
                          {opt} {opt === q.correctAnswer && " (Correct)"}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-10 border-t border-slate-50 bg-slate-50/50">
              <button 
                onClick={() => setIsPreviewing(false)} 
                className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black uppercase tracking-widest text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <input 
      type="text" 
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-[20px] focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-800"
      placeholder={placeholder}
    />
  </div>
);

const CheckItem = ({ label, active }: { label: string, active: boolean }) => (
  <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-tight transition-all ${active ? 'text-emerald-400' : 'text-slate-600'}`}>
    {active ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
    {label}
  </div>
);

export default CreateJob;
