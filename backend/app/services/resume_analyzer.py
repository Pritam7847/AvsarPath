import re
from typing import Any

from app.schemas.resume import ResumeAnalysisResponse
from app.services.ai_client import AIClient
from app.utils.skill_extractor import extract_skills, infer_career_domains

SECTION_PATTERNS = {
    "experience": r"(experience|work history|employment)",
    "education": r"(education|academic)",
    "projects": r"(projects|portfolio)",
    "skills": r"(skills|technical skills|competencies)",
}


def _heuristic_analysis(text: str, skills: list[str]) -> ResumeAnalysisResponse:
    text_lower = text.lower()
    word_count = len(text.split())
    sections_found = [name for name, pat in SECTION_PATTERNS.items() if re.search(pat, text_lower)]

    score = 45
    strengths: list[str] = []
    improvements: list[str] = []
    structure: list[str] = []

    if word_count > 150:
        score += 10
        strengths.append("Solid content length — enough detail to showcase your work.")
    else:
        improvements.append("Expand bullet points with metrics and outcomes (e.g. 'Reduced load time by 40%').")

    if "projects" in sections_found:
        score += 12
        strengths.append("Projects section detected — great for students without full-time experience.")
    else:
        improvements.append("Add a Projects section with 2–3 builds that prove skills (GitHub links included).")
        structure.append("Add: Projects → 2–3 student builds with tech stack + impact.")

    if "experience" in sections_found:
        score += 8
        strengths.append("Experience/internship section present.")
    else:
        structure.append("Add: Experience → internships, freelance, campus roles, or open-source contributions.")

    if len(skills) >= 5:
        score += 10
        strengths.append(f"Identified {len(skills)} skills — good technical signal.")
    else:
        improvements.append("Surface more skills via projects and tools used, not just a keyword list.")

    if re.search(r"\d+%|\d+x|increased|reduced|built|shipped|led", text_lower):
        score += 8
        strengths.append("Impact-oriented language detected.")
    else:
        improvements.append("Use action verbs + numbers: built, shipped, improved, reduced, led.")

    if "github" in text_lower or "linkedin" in text_lower:
        score += 5
        strengths.append("Social/profile links detected.")
    else:
        improvements.append("Add GitHub + LinkedIn links in the header — recruiters check these first.")

    missing = _suggest_missing_skills(skills, infer_career_domains(skills, text))
    domains = infer_career_domains(skills, text)

    return ResumeAnalysisResponse(
        skills=skills,
        quality_score=min(score, 92),
        strengths=strengths[:5],
        improvements=improvements[:6],
        missing_skills=missing[:8],
        structure_suggestions=structure[:5],
        career_domains=domains,
        summary=(
            "Your resume shows student potential. Focus on projects, measurable impact, "
            "and modern discovery channels (GitHub, communities) — not just job portals."
        ),
    )


def _suggest_missing_skills(current: list[str], domains: list[str]) -> list[str]:
    suggestions_map = {
        "Frontend Developer": ["TypeScript", "React", "Tailwind CSS", "Git"],
        "Backend Developer": ["Python", "FastAPI", "PostgreSQL", "Docker"],
        "Ai Engineer": ["Python", "PyTorch", "Machine Learning", "Git"],
        "Full Stack Developer": ["React", "Node.js", "MongoDB", "REST API"],
    }
    current_lower = {s.lower() for s in current}
    out: list[str] = []
    for domain in domains[:2]:
        for skill in suggestions_map.get(domain, []):
            if skill.lower() not in current_lower and skill not in out:
                out.append(skill)
    return out[:8]


async def analyze_resume_text(text: str) -> ResumeAnalysisResponse:
    skills = extract_skills(text)
    client = AIClient()

    if client.settings.has_ai:
        try:
            result = await client.complete_json(
                system=(
                    "You are AvsarPath resume coach for Gen Z students. "
                    "Analyze resume text. Return JSON with keys: "
                    "skills (array), quality_score (0-100), strengths, improvements, "
                    "missing_skills, structure_suggestions, career_domains, summary."
                ),
                user=f"Resume text (processed in memory only, not stored):\n\n{text[:12000]}",
            )
            if result:
                return ResumeAnalysisResponse(**_normalize_resume_ai(result, skills))
        except Exception:
            pass

    return _heuristic_analysis(text, skills)


def _normalize_resume_ai(data: dict[str, Any], fallback_skills: list[str]) -> dict[str, Any]:
    data.setdefault("skills", fallback_skills)
    if not data.get("skills"):
        data["skills"] = fallback_skills
    data["quality_score"] = max(0, min(100, int(data.get("quality_score", 70))))
    for key in ("strengths", "improvements", "missing_skills", "structure_suggestions", "career_domains"):
        data.setdefault(key, [])
    data.setdefault("summary", "")
    return data
