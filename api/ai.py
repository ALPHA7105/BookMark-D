import os
import json
import requests

OLLAMA_API_KEY = os.environ.get("OLLAMA_API_KEY")
OLLAMA_URL = "https://ollama.com/v1/chat/completions"

def handler(request):
    if request.method == "GET":
        return {
            "statusCode": 200,
            "body": json.dumps({"status": "AI endpoint is live. Use POST to chat."})
        }

    if request.method != "POST":
        return {
            "statusCode": 405,
            "body": json.dumps({"error": "Method Not Allowed"})
        }

    if not OLLAMA_API_KEY:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "API Key missing"})
        }

    try:
        data = json.loads(request.body)
        user_prompt = data.get("prompt", "")

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

        response = requests.post(OLLAMA_URL, headers=headers, json=payload, timeout=20)

        return {
            "statusCode": response.status_code,
            "body": response.text
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }











"""
import os
import requests
import json

def handler(request):
    if request.method != "POST":
        return {
            "statusCode": 405,
            "body": json.dumps({"error": "Method Not Allowed"}),
            "headers": {"Content-Type": "application/json"}
        }

    try:
        data = request.json()
        user_prompt = data.get("prompt", "")

        OLLAMA_API_KEY = os.environ.get("OLLAMA_API_KEY")
        OLLAMA_URL = "https://ollama.com/v1/chat/completions"

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OLLAMA_API_KEY}"
        }

        payload = {
            "model": "llama3",
            "messages": [
                {"role": "system", "content": "You are a JSON-only assistant. Respond ONLY with valid JSON."},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.7
        }

        response = requests.post(OLLAMA_URL, headers=headers, json=payload)

        return {
            "statusCode": response.status_code,
            "body": response.text,
            "headers": {"Content-Type": "application/json"}
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {"Content-Type": "application/json"}
        }
