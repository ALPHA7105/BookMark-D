async function callAI(prompt, systemInstruction = null) {
    const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, system_instruction: systemInstruction })
    });

    // 1. Check if the server returned a 2xx success code [MDN Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
    if (!response.ok) {
        const errorText = await response.text(); // Get raw text to see if it's an HTML error page
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    // 2. Safely parse the JSON
    let data;
    try {
        data = await response.json();
    } catch (e) {
        throw new Error("Server returned non-JSON content. Check the Network tab.");
    }

    console.log("Full AI Response:", data);

    // 3. Handle OpenAI/Ollama nested format
    const content = data.choices?.[0]?.message?.content;
    if (content) {
        if (typeof content === 'object') return content;
        try {
            return JSON.parse(content);
        } catch (e) {
            console.warn("Content wasn't valid JSON string, returning as-is:", content);
            return content;
        }
    }
    
    if (data.error) throw new Error(data.error);
    throw new Error("Unexpected response format from AI");
}
