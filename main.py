import os
import requests
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__, static_folder='.', template_folder='.')
CORS(app)

# Fetch from Vercel Environment Variables
OLLAMA_API_KEY = os.environ.get("OLLAMA_API_KEY")
OLLAMA_URL = "https://ollama.com/v1/chat/completions"

CLASSIC_INSTRUCTION = """
STRICT FIDELITY FOR CLASSIC ABRIDGMENTS:
- For books marked "Abridged" or under the "Inspired By Classics" theme:
- ADHERE TO THE ORIGINAL PLOT OF THE SOURCE MATERIAL.
- Use original character names and major plot beats from authors like Jane Austen or Arthur Conan Doyle.
- Focus on maintaining the author's original voice while condensing for an interactive experience.
"""

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/ai', methods=['GET', 'POST']) # Allow both just in case
def ai_proxy():
    if request.method == 'GET':
        return jsonify({"status": "AI endpoint is live. Use POST to chat."})
    if not OLLAMA_API_KEY:
        return jsonify({"error": "API Key missing"}), 500

    data = request.json
    user_prompt = data.get("prompt", "")
    
    # 1. Define the headers correctly
    headers = {
        "Authorization": f"Bearer {OLLAMA_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama3.2:1b", 
        "messages": [
            {"role": "system", "content": "You are a JSON-only assistant. Respond ONLY with valid JSON."},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.7,
        "stream": False
    }

    try:
        # 2. Now 'headers' exists so this won't crash!
        response = requests.post(OLLAMA_URL, headers=headers, json=payload, timeout=20)
        return jsonify(response.json())
    except Exception as e:
        print(f"Error: {e}") # This helps you see the error in your terminal
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
