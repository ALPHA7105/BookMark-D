@app.route('/api/ai', methods=['POST'])
def ai_proxy():
    # 1. Check for API Key
    if not OLLAMA_API_KEY:
        return jsonify({"error": "API Key missing"}), 500

    # 2. Get data safely
    data = request.get_json(silent=True) or {}
    user_prompt = data.get("prompt", "")
    
    headers = {
        "Authorization": f"Bearer {OLLAMA_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama3.2:1b", 
        "messages": [
            {"role": "system", "content": "You are a JSON assistant. Respond ONLY in valid JSON."},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.7,
        "stream": False
    }

    try:
        # Use the correct Cloud or Local URL
        response = requests.post(OLLAMA_URL, headers=headers, json=payload, timeout=20)
        
        if response.status_code != 200:
            return jsonify({"error": "API Error", "details": response.text}), response.status_code
            
        # IMPORTANT: You must RETURN the response
        return jsonify(response.json())
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
