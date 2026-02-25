import os
import requests

def handler(request):
    if request.method == "GET":
        return {
            "statusCode": 200,
            "body": '{"status":"AI endpoint is live. Use POST."}',
            "headers": {"Content-Type": "application/json"}
        }

    if request.method != "POST":
        return {
            "statusCode": 405,
            "body": '{"error":"Method Not Allowed"}',
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

        response = requests.post(OLLAMA_URL, headers=headers, json=payload, timeout=20)

        return {
            "statusCode": response.status_code,
            "body": response.text,
            "headers": {"Content-Type": "application/json"}
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": f'{{"error":"Server exception","details":"{str(e)}"}}',
            "headers": {"Content-Type": "application/json"}
        }
