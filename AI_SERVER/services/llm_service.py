import os
from groq import Groq
from dotenv import load_dotenv
from services.medication_context import build_full_context

load_dotenv(override=True)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = (
    "You are a helpful Medication Assistant for the MediCare app. "
    "Help patients with their medication schedules, dosage timing, side effects, "
    "drug interactions and refill reminders. "
    "Be friendly, clear and concise. "
    "Never diagnose medical conditions. "
    "Always end your response with: Please consult your doctor for medical advice."
)

def get_chat_response(message: str, medications: list) -> str:
    context = build_full_context(medications)
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT + "\n\nPatient's current medications:\n" + str(context)
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            max_tokens=500
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"=== GROQ API ERROR: {e} ===")
        return "Sorry, I'm having trouble connecting right now. Please try again in a moment."