# ScreenIQ | AI-Powered Recruitment Infrastructure

![ScreenIQ Banner](https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=2000)

**ScreenIQ** is a next-generation, automated hiring infrastructure that eliminates manual screening. By leveraging the **Google Gemini 3.0 API**, it generates role-specific technical assessments, monitors candidate integrity in real-time, and provides recruiters with a prioritized, verified talent pipeline.

## 🚀 The Vision
In the modern talent market, resumes are often unreliable and manual screening is a massive bottleneck. ScreenIQ shifts the paradigm from "trust-based applications" to **"verification-first hiring"**. Every candidate who reaches your dashboard has already proven their technical mastery through an adaptive, proctored AI gate.

---

## ✨ Key Features

### For Recruiters
- **Generative Assessment Engine:** Instantly build custom 10-question MCQ assessments based on any Job Description.
- **Biometric Proctoring:** Real-time monitoring of tab-switching and identity verification using computer vision (camera).
- **Global Talent Benchmarking:** Compare your candidate pool against real-time industry data from Silicon Valley to Bengaluru.
- **AI Interview Scripts:** Automatically generate high-impact interview questions tailored to each candidate's specific assessment gaps.
- **Infrastructure Dashboard:** Manage multiple pipelines with automated pass/fail gating and "ghosting prevention" logic.

### For Candidates
- **Verified Skill Passport:** Earn portable certifications for technical skills that can be shared with other ScreenIQ-partnered employers.
- **Adaptive Evaluation:** Testing difficulty scales in real-time based on logic patterns and solving speed.
- **Growth Insights:** Receive a "Personalized Learning Path" based on missed assessment topics to help you improve.

---

## 🛠 Tech Stack

- **Framework:** React 19 (ES6 Modules)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI Engine:** Google Gemini SDK (`@google/genai`)
- **Animations:** Framer Motion
- **Data Visualization:** Recharts
- **Icons:** Lucide React

---

## 🚦 Getting Started

### Prerequisites
- Node.js installed
- A Google AI Studio API Key (Gemini)

### Environment Variables
The application requires a valid Gemini API key to function. This key is accessed via `process.env.API_KEY`. 

### Installation
1. Clone the repository.
2. Ensure you have the dependencies listed in the `importmap` within `index.html`.
3. Set up your environment variable:
   ```bash
   # Conceptually for your execution environment
   API_KEY=your_gemini_api_key_here
   ```

---

## 🏗 System Architecture

The project follows a clean, view-based architecture:
- `views/`: Contains the primary pages (Landing, Dashboard, Job Detail, Assessment, etc.).
- `services/`: Handles all interactions with the Google Gemini API.
- `types.ts`: Centralized TypeScript definitions for the entire platform.
- `App.tsx`: Main router and state orchestration layer.

---

## 🛡 Security & Integrity
ScreenIQ is built with a "Trustless Recruitment" philosophy. 
- **Integrity Pulse:** Logs tab-switches and camera interruptions.
- **Anonymization Mode:** Recruiters can toggle an "Elite Talent" view to eliminate unconscious bias until the interview stage.

---

## 📄 License
This project is for conceptual demonstration purposes. Distributed under the MIT License.

---

*Built by World-Class Frontend Engineers using Google Gemini AI.*