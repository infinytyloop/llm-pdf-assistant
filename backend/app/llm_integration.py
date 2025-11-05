from openai import OpenAI
from dotenv import load_dotenv
import json
import os

load_dotenv('secrets.env')
key = os.getenv('api_key')
client = OpenAI(api_key=key, base_url="https://api.deepseek.com")

# Use a single, clear system prompt template.
SYSTEM_PROMPT_TEMPLATE = """
You are a helpful AI teaching assistant. Your goal is to explain a highlighted term from a student's notes.
The text to explain is: "{highlighted_text}"

Provide clear, concise explanations in simple language a high school student can understand.
Focus on key concepts and relationships between ideas.
Do not use markdown, asterisks, external images, or links.
Use newlines for clarity.
"""

async def get_explanation(request_data: dict):  # Receive direct JSON now
    print("Received request:", request_data)
    
    try:
        history = request_data.get("history", [])
        highlighted_text = request_data.get("highlightedText", "")
        print(request_data)
        
        # Format the system prompt with the highlighted text
        system_prompt_content = SYSTEM_PROMPT_TEMPLATE.format(highlighted_text=highlighted_text)

        messages = [{"role": "system", "content": system_prompt_content}]
        
        # Process history directly - ensure content is string, not object
        for msg in history:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            
            # Convert content to string if it's not already
            if not isinstance(content, str):
                content = str(content)
            
            # Map to valid roles (system already handled)
            if role in ["user", "assistant"]:
                messages.append({"role": role, "content": content})

        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=messages,
            stream=False
        )
        print("API response:", response.choices[0].message.content.strip())
        
        return {"explanation": response.choices[0].message.content.strip()}
    except Exception as e:
        print(f"API Error: {str(e)}")
        print(f"Error type: {type(e)}")
        return {"explanation": "I couldn't generate an explanation. Please try again later."}