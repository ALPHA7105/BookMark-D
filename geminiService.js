// geminiService.js

async function callBackend(endpoint, payload) {
    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("Backend failed");
    return await response.json();
}

export async function generateStoryPreview(title, author, vibe) {
    const prompt = `Generate an interactive preview for the book "${title}" by ${author}. Vibe: "${vibe}". Provide a snappy summary, a shocking potential plot twist, and a Gen-Z style vibe rating.`;
    
    return await callBackend("/api/preview", { prompt });
}

export async function generateInteractiveChapter(title, context, isLastChapter, readingLevel = 'Standard', choice) {
    // Keep your style logic here
    let styleInstruction = `Use ${readingLevel} vocabulary.`; 
    
    const prompt = isLastChapter 
        ? `Conclude the story for "${title}". Choice: ${choice}.` 
        : `Continue the story for "${title}". Choice: ${choice}. Context: ${context.slice(-1000)}`;

    return await callBackend("/api/chapter", { prompt, style: styleInstruction });
}

// Note: Audio (TTS) is harder on Ollama. 
// I suggest skipping generateChapterAudio for the prototype 
// unless your Ollama provider specifically supports it.
