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
        "model": "gemini-3-flash-preview",
        "messages": [
            {"role": "system", "content": system_content},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.7,
        "response_format": { "type": "json_object" }
    }

    headers = {
        "Authorization": f"Bearer {OLLAMA_API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(OLLAMA_URL, headers=headers, json=payload)
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
