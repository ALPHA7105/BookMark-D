// geminiService.js
import fetch from "node-fetch";
async function callAI(prompt) {
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      console.error("API error:", await response.text());
      return null;
    }

    const data = await response.json();

    // Ollama-style response format safety
    if (data.message?.content) {
      try {
        return JSON.parse(data.message.content);
      } catch (e) {
        console.warn("AI did not return valid JSON. Raw:", data.message.content);
        return null;
      }
    }

    return data;
  } catch (err) {
    console.error("Fetch failed:", err);
    return null;
  }
}

export async function generateStoryPreview(title, author, vibe) {
  const prompt = `
Return ONLY valid JSON.

{
  "summary": "Short engaging hook",
  "plotTwist": "Unexpected twist",
  "vibeRating": "Fun short vibe phrase"
}

Book Title: ${title}
Author: ${author}
Vibe: ${vibe}
`;

  return await callAI(prompt);
}

export async function generateInteractiveChapter(
  title,
  context,
  isEnding,
  level,
  userChoice = ""
) {
  const prompt = `
Return ONLY valid JSON.

{
  "content": "Chapter text",
  "choices": [
    { "text": "Choice 1", "impact": "What happens" },
    { "text": "Choice 2", "impact": "What happens" }
  ],
  "isEnding": ${isEnding},
  "unlockedBadge": "Badge Name if ending"
}

Story: ${title}
Previous Context: ${context}
Reading Level: ${level}
User Choice: ${userChoice}
`;

  return await callAI(prompt);
}
