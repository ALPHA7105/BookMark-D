import os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests

app = Flask(__name__, static_folder='.', template_folder='.')
CORS(app)

OLLAMA_API_KEY = os.environ.get("OLLAMA_API_KEY")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/ai', methods=['POST'])
def proxy_ai():
    data = request.json
    # The Server uses the hidden ENV variable here
    headers = {
        "Authorization": f"Bearer {OLLAMA_API_KEY}",
        "Content-Type": "application/json"
    }
    response = requests.post("https://ollama.com/v1/chat/completions", headers=headers, json=data)
    return jsonify(response.json())

if __name__ == "__main__":
    app.run()
