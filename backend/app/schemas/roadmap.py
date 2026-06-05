from pydantic import BaseModel, Field


class RoadmapRequest(BaseModel):
    goal: str = Field(..., min_length=2, max_length=120)
    experience_level: str = Field(default="beginner", pattern="^(beginner|intermediate|advanced)$")
    timeline_months: int = Field(default=6, ge=3, le=24)


class PhaseItem(BaseModel):
    title: str
    duration: str
    topics: list[str] = Field(default_factory=list)
    projects: list[str] = Field(default_factory=list)


class RoadmapResponse(BaseModel):
    goal: str
    overview: str
    skills: list[str] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)
    phases: list[PhaseItem] = Field(default_factory=list)
    project_ideas: list[str] = Field(default_factory=list)
    resources: list[str] = Field(default_factory=list)
