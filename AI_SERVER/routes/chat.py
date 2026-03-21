from fastapi import APIRouter
from models.schemas import ChatRequest, ChatResponse
from services.llm_service import get_chat_response
from services.database_service import get_user_medications, save_chat_history

router = APIRouter()

@router.post("/message", response_model=ChatResponse)
def chat(request: ChatRequest):
    # Fetch patient's real medications from MySQL
    medications = get_user_medications(request.user_id)

    # Get AI response using Groq LLM with medication context
    reply = get_chat_response(request.message, medications)

    # Save conversation to chat_history table
    save_chat_history(request.user_id, request.message, reply)

    return ChatResponse(reply=reply)

@router.get("/health")
def health():
    return {"status": "ok", "service": "Medication AI Chatbot"}
