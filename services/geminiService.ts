
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { StoryResponse, StoryChapter, ReadingLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const CLASSIC_INSTRUCTION = `
STRICT FIDELITY FOR CLASSIC ABRIDGMENTS:
- For books marked "Abridged" or under the "Inspired By Classics" theme:
- ADHERE TO THE ORIGINAL PLOT OF THE SOURCE MATERIAL.
- Use the original character names, settings, and major plot beats from authors like Jane Austen, Arthur Conan Doyle, F. Scott Fitzgerald, etc.
- Do not add sci-fi or fantasy elements unless the original story already has them.
- Focus on maintaining the author's original voice while condensing the narrative for an interactive digital experience.
- "A Scandal in Bohemia": Holmes must be outwitted by Irene Adler after her wedding to Godfrey Norton.
- "Pride and Prejudice": Focus on the tension between Elizabeth Bennet and Mr. Darcy at Meryton and Pemberley.
`;

export async function generateStoryPreview(title: string, author: string, vibe: string): Promise<StoryResponse> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate an interactive preview for the book "${title}" by ${author}. Vibe: "${vibe}". Provide a snappy summary, a shocking potential plot twist, and a Gen-Z style vibe rating. ${CLASSIC_INSTRUCTION}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            plotTwist: { type: Type.STRING },
            vibeRating: { type: Type.STRING }
          },
          required: ["summary", "plotTwist", "vibeRating"]
        }
      }
    });

    return JSON.parse(response.text.trim()) as StoryResponse;
  } catch (error) {
    console.error("Gemini Preview Error:", error);
    return {
      summary: "This story is so secret, even the AI is keeping quiet. Dive in to find out!",
      plotTwist: "Wait... the protagonist was the antagonist all along?!",
      vibeRating: "Vibe Check: Immaculate ✨"
    };
  }
}

export async function generateInteractiveChapter(
  title: string, 
  context: string, 
  isLastChapter: boolean, 
  readingLevel: ReadingLevel = 'Standard',
  choice?: string
): Promise<StoryChapter> {
  let styleInstruction = "";
  if (readingLevel === 'Chill') styleInstruction = "Use simple, snappy vocabulary and short sentences. Direct and high energy.";
  if (readingLevel === 'Academic') styleInstruction = "Use sophisticated, evocative vocabulary, complex sentence structures, and literary depth.";
  if (readingLevel === 'Standard') styleInstruction = "Use engaging, modern prose suitable for a general teen audience.";

  let prompt = "";
  if (isLastChapter) {
    prompt = `Conclude the story for "${title}". ${CLASSIC_INSTRUCTION}
    The reader chose: "${choice || 'to witness the resolution'}". 
    Write a final, climactic resolution of approx 300 words. ${styleInstruction}
    Provide an "unlockedBadge" name (string). Set isEnding to true.`;
  } else if (choice) {
    prompt = `Continue the story for "${title}". ${CLASSIC_INSTRUCTION}
    Reader choice: "${choice}". Write a detailed chapter segment of approx 300 words. ${styleInstruction}
    Provide two distinct, high-impact choices for the next move that align with the original plot.
    Context summary: ${context.slice(-1500)}`;
  } else {
    prompt = `Start the immersive story for "${title}". ${CLASSIC_INSTRUCTION}
    Describe the opening scene with rich detail (approx 300 words). ${styleInstruction}
    Provide two enticing choices to begin that fit the original narrative flow.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            choices: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  impact: { type: Type.STRING }
                },
                required: ["text", "impact"]
              }
            },
            isEnding: { type: Type.BOOLEAN },
            unlockedBadge: { type: Type.STRING }
          },
          required: ["content", "choices"]
        }
      }
    });
    return JSON.parse(response.text.trim()) as StoryChapter;
  } catch (error) {
    return {
      content: "The system encountered a logic loop... The story continues in your imagination.",
      choices: isLastChapter ? [] : [
        { text: "Retry the connection", impact: "Persistence" },
        { text: "Walk into the digital mist", impact: "Adventure" }
      ],
      isEnding: isLastChapter
    };
  }
}

export async function generateChapterAudio(text: string): Promise<string | undefined> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: `Read this story segment with cinematic narration: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Generation Error:", error);
    return undefined;
  }
}

export async function getWordDefinition(word: string, context: string, level: ReadingLevel): Promise<{ definition: string; example: string } | null> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a concise, teen-friendly definition for the word "${word}" as used in this context: "${context}". 
      Tailor the tone for a ${level} reading level. Keep it under 25 words.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            definition: { type: Type.STRING },
            example: { type: Type.STRING }
          },
          required: ["definition", "example"]
        }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Definition fetch error:", error);
    return null;
  }
}
