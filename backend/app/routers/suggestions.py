from fastapi import APIRouter

from app.schemas.suggestions import SuggestionsRequest, SuggestionsResponse
from app.services.suggestions_engine import generate_suggestions

router = APIRouter()


@router.post("/generate", response_model=SuggestionsResponse)
async def get_suggestions(request: SuggestionsRequest):
    return await generate_suggestions(request)


@router.get("/focus-areas")
async def focus_areas():
    return {
        "areas": [
            {"id": "networking", "label": "Smart Networking"},
            {"id": "outreach", "label": "Outreach & Cold Email"},
            {"id": "internships", "label": "Internship Discovery"},
            {"id": "growth", "label": "Career Growth"},
            {"id": "general", "label": "All-Round Playbook"},
        ]
    }
