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

@app.route('/api/ai', methods=['POST'])
def ai_proxy():
    if not OLLAMA_API_KEY:
        return jsonify({"error": "API Key missing"}), 500

    data = request.json
    user_prompt = data.get("prompt", "")
    system_content = data.get("system_instruction", CLASSIC_INSTRUCTION)

    payload = {
        "model": "llama3.2:1b", # Switch to Llama 3 for 5x faster speed
        "messages": [
            {"role": "system", "content": "You are a JSON-only assistant for a book app. Respond ONLY with valid JSON."},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.7,
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_URL, headers=headers, json=payload, timeout=20)
        res_data = response.json()
        
        # Llama 3 won't have <think> tags, so we just send it straight
        return jsonify(res_data)
    except Exception as e:
        return jsonify({"error": "AI took too long. Try a shorter prompt!"}), 500

if __name__ == "__main__":
    app.run(debug=True)
