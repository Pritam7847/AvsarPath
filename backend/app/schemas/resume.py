from pydantic import BaseModel, Field


class ResumeAnalysisResponse(BaseModel):
    skills: list[str] = Field(default_factory=list)
    quality_score: int = Field(ge=0, le=100)
    strengths: list[str] = Field(default_factory=list)
    improvements: list[str] = Field(default_factory=list)
    missing_skills: list[str] = Field(default_factory=list)
    structure_suggestions: list[str] = Field(default_factory=list)
    career_domains: list[str] = Field(default_factory=list)
    summary: str = ""
