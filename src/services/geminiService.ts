import { GoogleGenAI } from "@google/genai";

const SILICONHUB_PERSONA = `
You are "SiliconHub AI," a high-level academic and career architect for India's premier ECE (Electronics and Communication Engineering) students. 
You specialize in semiconductor physics, VLSI, embedded systems, and GATE prep.
`;

function getAI() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY_MISSING");
  return new GoogleGenAI({ apiKey: key });
}

export async function getMentorResponse(message: string, history: { role: string; content: string }[] = []) {
  try {
    const ai = getAI();
    const contents = history.map((h: any) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }]
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    const result = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents,
      config: {
        systemInstruction: SILICONHUB_PERSONA,
      }
    });

    return result.text;
  } catch (error) {
    console.error("Mentor synthesis error:", error);
    throw error;
  }
}

export async function getMentorResponseStream(message: string, history: { role: string; content: string }[] = []) {
  try {
    const ai = getAI();
    const contents = history.map((h: any) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }]
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContentStream({
      model: "gemini-flash-latest",
      contents,
      config: {
        systemInstruction: SILICONHUB_PERSONA,
      }
    });

    return response;
  } catch (error) {
    console.error("Mentor stream error:", error);
    throw error;
  }
}

export async function optimizeResumePoint(point: string) {
  try {
    const ai = getAI();
    const result = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: `Optimize this ECE resume bullet point for high-tier semiconductor companies: ${point}`,
      config: {
        systemInstruction: SILICONHUB_PERSONA,
      }
    });
    return result.text;
  } catch (error) {
    console.error("Resume optimization error:", error);
    throw error;
  }
}

export async function generateQuiz(subject: string) {
  try {
    const ai = getAI();
    const prompt = `Act as an expert GATE ECE professor with access to archival GATE Previous Year Questions (PYQs).
Generate one high-quality archival 1-mark or 2-mark MCQ that has appeared in GATE ECE on the subject: ${subject}.
PRIORITY: Be extremely concise with the Logic to minimize generation time.

Format:
Question: [Archival Text]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Correct Answer: [Letter]
Logic: [Concise Technical Proof]`;

    const result = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SILICONHUB_PERSONA,
      }
    });

    if (!result.text) throw new Error("Empty synthesis outcome");
    return result.text;
  } catch (error) {
    console.error("Quiz generation error:", error);
    throw error;
  }
}
