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
    data = request.json
    user_prompt = data.get("prompt", "")
    
    # FORCE the model to behave by giving it a template in the prompt
    rich_prompt = f"""
    {user_prompt}
    
    IMPORTANT: You are a JSON-only assistant. 
    Respond ONLY with a valid JSON object. No thinking, no markdown tags.
    Format:
    {{
      "summary": "string",
      "plotTwist": "string",
      "vibeRating": "string",
      "content": "string",
      "choices": [ {{"text": "string", "impact": "string"}} ],
      "isEnding": false
    }}
    """

    payload = {
        "model": "deepseek-r1:8b",
        "messages": [{"role": "user", "content": rich_prompt}],
        "temperature": 0.2, # Lower = more predictable JSON
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_URL, 
                                 headers={"Authorization": f"Bearer {OLLAMA_API_KEY}"}, 
                                 json=payload, 
                                 timeout=30)
        
        full_res = response.json()
        raw_content = full_res['choices'][0]['message']['content']
        
        # 1. Strip <think> tags
        clean_content = re.sub(r'<think>.*?</think>', '', raw_content, flags=re.DOTALL).strip()
        
        # 2. Strip Markdown code blocks (```json ... ```) if the AI added them
        clean_content = re.sub(r'```json|```', '', clean_content).strip()

        # 3. Try to parse it to ensure it's valid JSON for the frontend
        try:
            parsed_json = json.loads(clean_content)
            # Re-wrap in the format your app.js expects
            return jsonify({"choices": [{"message": {"content": json.dumps(parsed_json)}}]})
        except:
            # Fallback if AI output is garbage
            return jsonify({"choices": [{"message": {"content": '{"summary": "Error parsing AI response.", "vibeRating": "Vibe: Broken 💀"}'}}]})

    except Exception as e:
        print(f"Backend Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
