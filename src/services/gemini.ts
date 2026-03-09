import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyA_olhDzdtlSyCJ_Ebd0_JEbsQ82c1fI6M" });

export async function getChatResponse(message: string, history: { role: "user" | "model"; parts: { text: string }[] }[]) {
  const model = ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: "You are AtmaMitra, a friendly and wise spiritual companion. Your goal is to help users find peace and guidance through the Bhagavad Gita. If the user expresses emotional distress (depression, low, sad, etc.), you MUST provide a relevant Bhagavad Gita sloka, its definition, and a 2-line explanation. Otherwise, be friendly and conversational. Keep responses concise." }]
      },
      ...history.map(h => ({ role: h.role, parts: h.parts })),
      { role: "user", parts: [{ text: message }] }
    ],
    config: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
    }
  });

  const result = await model;
  return result.text;
}

export async function getDiaryFeedback(content: string) {
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [{ 
          text: `Analyze the following diary entry. Determine if the actions or thoughts described align with 'Dharma' (righteousness) or 'Adharma' (unrighteousness) according to Bhagavad Gita principles. Provide appreciation or suggestions in 4-5 lines. 
          
          Entry: ${content}` 
        }]
      }
    ],
    config: {
      temperature: 0.7,
    }
  });

  const result = await model;
  return result.text;
}

export async function getDailySloka() {
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [{ text: "Provide a random Bhagavad Gita sloka for today. Return it in JSON format with fields: 'sanskrit', 'english', 'chapter', 'verse', 'explanation' (2 lines)." }]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sanskrit: { type: Type.STRING },
          english: { type: Type.STRING },
          chapter: { type: Type.NUMBER },
          verse: { type: Type.NUMBER },
          explanation: { type: Type.STRING }
        },
        required: ["sanskrit", "english", "chapter", "verse", "explanation"]
      }
    }
  });

  const result = await model;
  return JSON.parse(result.text);
}

export async function getFlashcards() {
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [{ text: "Generate 3 random Bhagavad Gita flashcards. Each should have a sanskrit sloka on the front and on the back: a 1-line English meaning and a 3-4 line example of how it applies to daily life. Return as a JSON array." }]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            sanskrit: { type: Type.STRING },
            meaning: { type: Type.STRING },
            example: { type: Type.STRING }
          },
          required: ["sanskrit", "meaning", "example"]
        }
      }
    }
  });

  const result = await model;
  return JSON.parse(result.text);
}

export async function getAudioBookContent(topic: string) {
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [{ text: `Deeply explain the topic '${topic}' in the context of Bhagavad Gita. Include relevant slokas, meanings, and examples. Structure it into 3-4 short pages. Return as a JSON array of strings (one for each page).` }]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  const result = await model;
  return JSON.parse(result.text);
}

export async function generateSpeech(text: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Read this in a calm, deep male voice: ${text}` }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Charon' }, // Deep male voice
        },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
}
