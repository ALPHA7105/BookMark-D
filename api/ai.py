import os
import json
import requests

OLLAMA_API_KEY = os.environ.get("OLLAMA_API_KEY")
OLLAMA_URL = "https://ollama.com/v1/chat/completions"

def handler(request):
    # CORS preflight
    if request.method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            "body": ""
        }

    headers_out = {"Access-Control-Allow-Origin": "*"}

    if request.method == "GET":
        return {
            "statusCode": 200,
            "headers": headers_out,
            "body": json.dumps({"status": "AI endpoint is live"})
        }

    if request.method != "POST":
        return {
            "statusCode": 405,
            "headers": headers_out,
            "body": json.dumps({"error": "Method Not Allowed"})
        }

    if not OLLAMA_API_KEY:
        return {
            "statusCode": 500,
            "headers": headers_out,
            "body": json.dumps({"error": "OLLAMA_API_KEY not set"})
        }

    try:
        # Vercel request.body is bytes → decode
        body = json.loads(request.body.decode("utf-8"))
        user_prompt = body.get("prompt", "")

        headers_in = {
            "Authorization": f"Bearer {OLLAMA_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "llama3.2:1b",
            "messages": [
                {"role": "system", "content": "You are a JSON-only assistant. Respond ONLY with valid JSON."},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.7
        }

        response = requests.post(OLLAMA_URL, headers=headers_in, json=payload, timeout=20)

        return {
            "statusCode": response.status_code,
            "headers": {**headers_out, "Content-Type": "application/json"},
            "body": response.text
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": headers_out,
            "body": json.dumps({"error": str(e)})
        }
