import os
import requests
import json

def handler(request):
    # This is the Vercel-native way without needing Flask overhead
    if request.method == 'OPTIONS': # Handle pre-flight for CORS
        return '', 200, {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST'}

    if request.method != 'POST':
        return 'Method Not Allowed', 405

    data = request.get_json()
    api_key = os.environ.get("OLLAMA_API_KEY")
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "llama3.2:1b",
        "messages": [
            {"role": "system", "content": "You are a JSON assistant. Respond only in JSON."},
            {"role": "user", "content": data.get("prompt", "")}
        ],
        "stream": False
    }

    try:
        response = requests.post("https://ollama.com/v1/chat/completions", headers=headers, json=payload)
        return response.text, 200, {'Content-Type': 'application/json'}
    except Exception as e:
        return json.dumps({"error": str(e)}), 500, {'Content-Type': 'application/json'}



"""
import os
import requests
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__, static_folder='.', template_folder='.')
CORS(app)

# Fetch from Vercel Environment Variables
OLLAMA_API_KEY = os.environ.get("OLLAMA_API_KEY")
OLLAMA_URL = "https://ollama.com/v1/chat/completions"

CLASSIC_INSTRUCTION = ""
STRICT FIDELITY FOR CLASSIC ABRIDGMENTS:
- For books marked "Abridged" or under the "Inspired By Classics" theme:
- ADHERE TO THE ORIGINAL PLOT OF THE SOURCE MATERIAL.
- Use original character names and major plot beats from authors like Jane Austen or Arthur Conan Doyle.
- Focus on maintaining the author's original voice while condensing for an interactive experience.
""

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
        response = requests.post(OLLAMA_URL, headers=headers, json=payload, timeout=20)
        
        # If the API returns an error (like 401 or 404), this will catch it
        if response.status_code != 200:
            return jsonify({
                "error": "API Provider Error",
                "status_code": response.status_code,
                "details": response.text  # This will tell us the EXACT reason
            }), response.status_code
            
        return jsonify(response.json())

if __name__ == "__main__":
    app.run(debug=True)
