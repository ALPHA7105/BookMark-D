async function callAI(prompt, systemInstruction = null) {
    const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, system_instruction: systemInstruction })
    });

    const data = await response.json();
    console.log("Full AI Response:", data); // This lets you see the error in the console

    // Handle the Ollama/OpenAI format: data.choices[0].message.content
    if (data.choices && data.choices[0] && data.choices[0].message) {
        try {
            return JSON.parse(data.choices[0].message.content);
        } catch (e) {
            // If it's already a JSON object (not a string), return it directly
            return typeof data.choices[0].message.content === 'object' 
                ? data.choices[0].message.content 
                : JSON.parse(data.choices[0].message.content);
        }
    }
    
    // If the backend sent a direct error
    if (data.error) {
        throw new Error(data.error);
    }

    throw new Error("Unexpected response format from AI");
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
