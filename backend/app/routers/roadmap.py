from fastapi import APIRouter

from app.schemas.roadmap import RoadmapRequest, RoadmapResponse
from app.services.roadmap_generator import generate_roadmap

router = APIRouter()


@router.post("/generate", response_model=RoadmapResponse)
async def create_roadmap(request: RoadmapRequest):
    return await generate_roadmap(request)


@router.get("/goals")
async def list_goals():
    return {
        "goals": [
            "Frontend Developer",
            "Backend Developer",
            "Full Stack Developer",
            "AI Engineer",
            "Data Scientist",
            "UI/UX Designer",
            "DevOps Engineer",
            "Mobile Developer",
            "Product Manager",
            "Cybersecurity Analyst",
        ]
    }
