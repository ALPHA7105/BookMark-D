async function callAI(prompt, systemInstruction = null) {
    const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, system_instruction: systemInstruction })
    });
    const data = await response.json();
    // Return the content parsed from the Ollama response format
    return JSON.parse(data.choices[0].message.content);
}

export async function generateStoryPreview(title, author, vibe) {
    const prompt = `Generate an interactive preview for "${title}" by ${author}. Vibe: "${vibe}". Provide a snappy summary, a shocking potential plot twist, and a Gen-Z vibe rating.`;
    return await callAI(prompt);
}

export async function generateInteractiveChapter(title, context, isLastChapter, readingLevel, choice) {
    const prompt = isLastChapter 
        ? `Conclude "${title}". Reader choice: "${choice}".`
        : `Continue "${title}". Reader choice: "${choice}". Context: ${context.slice(-1000)}`;
    return await callAI(prompt);
}
