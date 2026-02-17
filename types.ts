
export enum CandidateStatus {
  DRAFT = 'DRAFT',
  APPLIED = 'APPLIED',
  ASSESSMENT_PENDING = 'ASSESSMENT_PENDING',
  ASSESSMENT_COMPLETED = 'ASSESSMENT_COMPLETED',
  SHORTLISTED = 'SHORTLISTED', // GREEN
  POTENTIAL = 'POTENTIAL',     // YELLOW
  REJECTED = 'REJECTED',       // RED
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  INVITED_TO_ASSESSMENT = 'INVITED_TO_ASSESSMENT',
  ON_HOLD = 'ON_HOLD'
}

export type ConfidenceLevel = 'unsure' | 'somewhat' | 'certain';

export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'short_answer' | 'truth_check';
  options?: string[];
  correctAnswer?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'elite';
  skill: string;
  isTruthQuestion?: boolean; // Intersection Engine generated
}

export interface KnockoutQuestion {
  id: string;
  text: string;
  requiredAnswer: boolean;
}

export interface Assessment {
  id: string;
  jobId: string;
  questions: Question[];
  passingScore: number;
}

export type ExperienceLevel = 'Intern' | 'Fresher' | 'Junior' | 'Mid' | 'Senior' | 'Expert' | 'Lead';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  description: string;
  department: string;
  experienceLevel: ExperienceLevel; 
  skills: string[];
  status: 'active' | 'closed';
  createdAt: string;
  assessmentId?: string;
  cutoffScore: number;
  isProctoringEnabled: boolean;
  difficultySetting: 'Junior' | 'Mid' | 'Senior';
  idealSkillProfile: Record<string, number>;
  marketBenchmarkScore: number;
  knockoutQuestions: KnockoutQuestion[];
  rejectionDelay: 'Instant' | '24 Hours' | '3 Days' | '7 Days';
  autoNotify: boolean;
}

export interface CandidateAnswer {
  value: string;
  confidence?: ConfidenceLevel;
  timeTaken: number;
}

export interface ResumeSection {
  title: string;
  company: string;
  period: string;
  description: string;
  aiNote?: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  parsedResume?: {
    summary: string;
    timeline: ResumeSection[];
    heatmapKeywords: string[];
    proofPoints: string[];
  };
  appliedJobs: {
    jobId: string;
    status: CandidateStatus;
    score?: number; 
    suitability?: number; 
    feedback?: string;
    oneSentenceVerdict?: string; // RoleScreen AI feature
    answers?: Record<string, CandidateAnswer>;
    skillBreakdown?: Record<string, number>;
    appliedAt: string;
    confidenceScore?: number;
    integrityScore?: number; // Integrity Shield score
    tabSwitches?: number;
    multiplePersonsDetected?: boolean;
    gazeAnomalyDetected?: boolean; // Eye tracking
    isStarred?: boolean;
    integrityFlag?: boolean;
    notified?: boolean;
    internalNotes?: string[];
  }[];
}

export interface AppState {
  jobs: Job[];
  candidates: Candidate[];
  assessments: Assessment[];
  currentUser: {
    role: 'recruiter' | 'candidate';
    id: string;
  };
}
