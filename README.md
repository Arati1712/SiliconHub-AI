# SiliconHub AI: ECE Academic & Career Architect

SiliconHub AI is a specialized platform designed for India's premier Electronics and Communication Engineering (ECE) students. It combines archival GATE prep logic with AI-driven career mentoring and resume optimization.

## 🚀 Key Features

- **AI Mentor (SiliconHub AI):** A high-level architect specializing in semiconductor physics, VLSI, and embedded systems.
- **GATE Archival Quiz:** Generates authentic Previous Year Question (PYQ) equivalents with precise technical proofs.
- **Resume Optimizer:** Tailors ECE-specific bullet points for top-tier semiconductor firms (Intel, NVIDIA, Qualcomm).
- **Industry Hub:** Real-time tracking of subject mastery and career readiness.

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Motion (Framer Motion).
- **Backend:** Node.js (Express) with Vite integration.
- **AI Engine:** Google Gemini (Generative AI SDK).
- **Database & Auth:** Firebase Firestore & Firebase Authentication.

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [Your-GitHub-URL]
   cd siliconhub-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the application:**
   ```bash
   npm run dev
   ```

## 🔒 Security & Rules
The project includes a robust `firestore.rules` configuration ensuring:
- **Zero-Trust Identity:** Users can only access their own chat history and quiz results.
- **Validation Blueprints:** Strict schema enforcement on all incoming data to prevent resource exhaustion.
- **Relational Integrity:** Syncing user profiles securely on every login.
