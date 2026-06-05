from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import resume, roadmap, suggestions, resources

settings = get_settings()

app = FastAPI(
    title="AvsarPath API",
    description="AI-assisted career guidance — no user data stored",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])
app.include_router(roadmap.router, prefix="/api/roadmap", tags=["Roadmap"])
app.include_router(suggestions.router, prefix="/api/suggestions", tags=["Suggestions"])
app.include_router(resources.router, prefix="/api/resources", tags=["Resources"])


@app.get("/api/health")
async def health():
    return {"status": "ok", "ai_enabled": settings.has_ai}
