
import { GoogleGenAI, Type } from "@google/genai";
import { Job, Question, CandidateAnswer } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Utility to strip Markdown symbols like #, *, and ` for a cleaner UI.
 */
const cleanAIResponse = (text: string) => {
  return text.replace(/[#*`]/g, '').trim();
};

export const optimizeJobDescription = async (job: Partial<Job>) => {
  const prompt = `Optimize the following job description to be more professional and clear. 
    Detect unrealistic skill combinations and suggest improvements.
    Title: ${job.title}
    Skills: ${job.skills?.join(', ')}
    Description: ${job.description}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return cleanAIResponse(response.text || '');
};

export const getAssessmentBriefing = async (job: Job) => {
  const prompt = `Based on this job description:
    Title: ${job.title}
    Skills: ${job.skills.join(', ')}
    Description: ${job.description}
    
    Provide a concise "Pre-Flight Briefing" for a candidate. 
    List exactly 3-4 specific technical topics the assessment will cover and mention that the test is adaptive.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return cleanAIResponse(response.text || '');
};

export const generateAssessment = async (job: Job): Promise<Question[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a role-based assessment question pool for:
      Job Title: ${job.title}
      Required Skills: ${job.skills.join(', ')}
      
      CRITICAL: ONLY multiple_choice questions are allowed.
      
      Generate EXACTLY 10 questions:
      - 3 Easy
      - 4 Medium
      - 3 Hard
      
      Return a JSON array of objects.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            text: { type: Type.STRING },
            type: { type: Type.STRING, description: "must be 'multiple_choice'" },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING },
            difficulty: { type: Type.STRING, description: "easy, medium, or hard" },
            skill: { type: Type.STRING }
          },
          required: ["id", "text", "type", "options", "correctAnswer", "difficulty", "skill"]
        }
      }
    }
  });

  try {
    const raw = JSON.parse(response.text || '[]');
    return raw.map((q: any) => ({
      ...q,
      text: cleanAIResponse(q.text)
    }));
  } catch (e) {
    console.error("Failed to parse assessment JSON", e);
    return [];
  }
};

export const evaluateAssessment = async (
  job: Job, 
  questions: Question[], 
  answers: Record<string, CandidateAnswer>
) => {
  const qaString = questions.map(q => {
    const ans = answers[q.id];
    const isCorrect = ans?.value === q.correctAnswer;
    return `Q (${q.difficulty}, ${q.skill}): ${q.text}
    Correct Answer: ${q.correctAnswer}
    Candidate Answer: ${ans?.value || 'N/A'}
    Correct: ${isCorrect}
    Time: ${ans?.timeTaken || 0}s`;
  }).join('\n\n');

  const prompt = `Evaluate the candidate's performance for the ${job.title} position based on 10 MCQ questions.
    Each correct answer is worth 10 points. Maximum score is 100.
    
    Data:
    ${qaString}
    
    Return the evaluation in JSON format. Calculate 'score' as number of correct answers * 10.
    Suitability should be a weighted score (score * 0.8 + speed_factor * 0.2).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          suitability: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
          skillBreakdown: {
            type: Type.OBJECT,
            properties: {
              technical: { type: Type.NUMBER },
              logic: { type: Type.NUMBER },
              domain: { type: Type.NUMBER }
            }
          },
          studySuggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["score", "suitability", "feedback", "studySuggestions"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return {
      ...data,
      feedback: cleanAIResponse(data.feedback),
      studySuggestions: data.studySuggestions.map((s: string) => cleanAIResponse(s))
    };
  } catch (e) {
    return { 
      score: 0, 
      suitability: 0, 
      feedback: "Error evaluating assessment", 
      studySuggestions: ["Review job fundamentals", "Practice speed", "Analyze mistakes"]
    };
  }
};

export const generateInterviewScript = async (job: Job, feedback: string, skills: string[]) => {
  const prompt = `Based on the candidate's assessment for ${job.title}, create 5 high-impact interview questions.
    Candidate traits: ${feedback}.
    Focus on gaps in ${skills.join(', ')}.
    Return exactly 5 questions. No markdown.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return cleanAIResponse(response.text || '');
};
