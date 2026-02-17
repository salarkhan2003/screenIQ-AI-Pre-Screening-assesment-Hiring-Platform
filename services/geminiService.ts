
import { GoogleGenAI, Type } from "@google/genai";
import { Job, Question, CandidateAnswer } from "../types";

// Always use named parameters for initialization and exclusively use process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const cleanAIResponse = (text: string) => {
  return text.replace(/[#*`]/g, '').trim();
};

export const optimizeJobDescription = async (job: Partial<Job>) => {
  const prompt = `Optimize this JD for RoleScreen AI (2026 hiring landscape). 
    Detect unrealistic skill combinations.
    Title: ${job.title}
    Skills: ${job.skills?.join(', ')}
    Description: ${job.description}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  // Accessing text as a property, not a method, as per guidelines.
  return cleanAIResponse(response.text || '');
};

export const getAssessmentBriefing = async (job: Job) => {
  const prompt = `Provide a concise 10-Bit Assessment Briefing for:
    Title: ${job.title}
    Skills: ${job.skills.join(', ')}
    
    Mention that the test uses our Intersection Engine to verify specific resume claims and is adaptive.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return cleanAIResponse(response.text || '');
};

// Use gemini-3-pro-preview for complex reasoning task: generating an assessment based on JD and resume context.
export const generateAssessment = async (job: Job, candidateResume?: string): Promise<Question[]> => {
  const context = candidateResume ? `Candidate Resume Context: ${candidateResume}` : "No resume provided yet.";
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a RoleScreen AI "Intersection Engine" assessment (10-Bit) for:
      Job Title: ${job.title}
      Required Skills: ${job.skills.join(', ')}
      ${context}
      
      CRITICAL: 
      - Include 3 "Truth Questions" that specifically cross-reference claims in the resume vs JD requirements.
      - Total EXACTLY 10 multiple_choice questions.
      - Use 'elite' difficulty for high-performers.
      
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
            difficulty: { type: Type.STRING, description: "easy, medium, hard, or elite" },
            skill: { type: Type.STRING },
            isTruthQuestion: { type: Type.BOOLEAN }
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

// Use gemini-3-pro-preview for complex reasoning task: evaluating assessment performance and providing feedback.
export const evaluateAssessment = async (
  job: Job, 
  questions: Question[], 
  answers: Record<string, CandidateAnswer>
) => {
  const qaString = questions.map(q => {
    const ans = answers[q.id];
    const isCorrect = ans?.value === q.correctAnswer;
    return `Q (${q.difficulty}, ${q.skill}, TruthQuestion: ${q.isTruthQuestion}): ${q.text}
    Candidate Answer: ${ans?.value || 'N/A'}
    Correct: ${isCorrect}
    Time: ${ans?.timeTaken || 0}s`;
  }).join('\n\n');

  const prompt = `Evaluate the candidate for the ${job.title} role using RoleScreen AI metrics.
    Data:
    ${qaString}
    
    Return JSON. 
    'oneSentenceVerdict' must be a punchy summary like: "Expert logic, but Truth Questions revealed shallow SQL experience."
    'suitability' is a 0-100 score.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          suitability: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
          oneSentenceVerdict: { type: Type.STRING },
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
        required: ["score", "suitability", "feedback", "oneSentenceVerdict", "studySuggestions"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return {
      ...data,
      feedback: cleanAIResponse(data.feedback),
      oneSentenceVerdict: cleanAIResponse(data.oneSentenceVerdict)
    };
  } catch (e) {
    return { 
      score: 0, 
      suitability: 0, 
      feedback: "Error evaluating", 
      oneSentenceVerdict: "System processing error during verdict generation.",
      studySuggestions: ["Review job fundamentals"]
    };
  }
};

// Use gemini-3-pro-preview for complex reasoning task: generating deep-dive interview questions.
export const generateInterviewScript = async (job: Job, feedback: string, skills: string[]) => {
  const prompt = `Generate 5 deep-dive interview questions for ${job.title}.
    Focus on gaps: ${feedback}.
    Target skills: ${skills.join(', ')}.
    No markdown.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
  });

  return cleanAIResponse(response.text || '');
};
