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
        "model": "deepseek-r1:8b",
        "messages": [
            {"role": "system", "content": system_content + " Respond ONLY with a valid JSON object. Do not include any text outside the JSON."},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.3, # Lower temperature is better for strict JSON
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_URL, headers=headers, json=payload)
        res_data = response.json()
        
        # 1. Get the raw text
        raw_content = res_data['choices'][0]['message']['content']
        
        # 2. REMOVE THE THINKING TAGS (The Fix!)
        # This regex deletes everything between <think> and </think>
        clean_content = re.sub(r'<think>.*?</think>', '', raw_content, flags=re.DOTALL).strip()
        
        # 3. Return the cleaned JSON text
        # We replace the content with our cleaned version before sending to JS
        res_data['choices'][0]['message']['content'] = clean_content
        return jsonify(res_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
