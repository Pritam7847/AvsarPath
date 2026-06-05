from typing import Any

from app.schemas.roadmap import PhaseItem, RoadmapRequest, RoadmapResponse
from app.services.ai_client import AIClient

ROADMAP_TEMPLATES: dict[str, RoadmapResponse] = {
    "frontend developer": RoadmapResponse(
        goal="Frontend Developer",
        overview="Build visual craft + engineering fundamentals. Ship UI that feels premium.",
        skills=["HTML/CSS", "JavaScript", "TypeScript", "React", "Tailwind", "Git", "Figma basics"],
        certifications=["freeCodeCamp Responsive Web Design", "Meta Front-End Developer (Coursera)"],
        phases=[
            PhaseItem(
                title="Foundations",
                duration="Month 1–2",
                topics=["HTML semantics", "CSS layout (Flex/Grid)", "JS DOM", "Git workflow"],
                projects=["Personal landing page", "CSS art / micro-interactions page"],
            ),
            PhaseItem(
                title="React & Tooling",
                duration="Month 3–4",
                topics=["React hooks", "TypeScript", "Vite", "API integration", "state patterns"],
                projects=["Todo app with API", "Weather/dashboard clone with animations"],
            ),
            PhaseItem(
                title="Portfolio & Outreach",
                duration="Month 5–6",
                topics=["Performance", "accessibility", "Framer Motion", "cold outreach"],
                projects=["Premium portfolio (Awwwards-inspired)", "Open-source UI component PR"],
            ),
        ],
        project_ideas=[
            "Animated portfolio with GSAP scroll scenes",
            "Design system playground (buttons, cards, tokens)",
            "Hackathon team dashboard UI",
        ],
        resources=["javascript.info", "React docs", "Frontend Mentor", "UI.dev"],
    ),
    "ai engineer": RoadmapResponse(
        goal="AI Engineer",
        overview="Math-light path: Python → ML basics → projects → modern AI tooling.",
        skills=["Python", "NumPy/Pandas", "scikit-learn", "PyTorch basics", "LLM APIs", "FastAPI"],
        certifications=["DeepLearning.AI ML Specialization", "Google ML Crash Course"],
        phases=[
            PhaseItem(
                title="Python & Data",
                duration="Month 1–2",
                topics=["Python", "NumPy", "Pandas", "visualization", "statistics intuition"],
                projects=["EDA notebook on Kaggle dataset", "Data cleaning pipeline script"],
            ),
            PhaseItem(
                title="ML Core",
                duration="Month 3–4",
                topics=["scikit-learn", "train/test split", "classification", "NLP intro"],
                projects=["Spam classifier", "Resume skill tagger (like AvsarPath!)"],
            ),
            PhaseItem(
                title="Modern AI",
                duration="Month 5–6",
                topics=["PyTorch basics", "embeddings", "RAG patterns", "API deployment"],
                projects=["PDF Q&A mini-app", "Career coach bot with guardrails"],
            ),
        ],
        project_ideas=["Student career RAG assistant", "GitHub repo summarizer", "Interview question generator"],
        resources=["fast.ai", "Kaggle Learn", "Hugging Face course", "Papers With Code"],
    ),
    "ui/ux designer": RoadmapResponse(
        goal="UI/UX Designer",
        overview="Learn user research, visual systems, and prototyping — then prove it in case studies.",
        skills=["Figma", "User research", "Wireframing", "Design systems", "Prototyping", "Accessibility"],
        certifications=["Google UX Design Certificate", "Interaction Design Foundation trials"],
        phases=[
            PhaseItem(
                title="UX Foundations",
                duration="Month 1–2",
                topics=["User interviews", "personas", "journey maps", "information architecture"],
                projects=["Redesign a campus app flow", "Usability test report (5 users)"],
            ),
            PhaseItem(
                title="Visual & Systems",
                duration="Month 3–4",
                topics=["Typography", "color", "components", "auto-layout", "design tokens"],
                projects=["Mobile app UI kit", "Dark/light theme system"],
            ),
            PhaseItem(
                title="Case Studies & Brand",
                duration="Month 5–6",
                topics=["Portfolio storytelling", "motion in UI", "handoff to dev"],
                projects=["2 case studies on Behance/Dribbble", "Personal brand landing page"],
            ),
        ],
        project_ideas=["Gen Z career app redesign", "Onboarding flow for student fintech", "Hackathon registration UX"],
        resources=["Laws of UX", "Refactoring UI", "Figma Community", "Mobbin"],
    ),
}


def _match_template(goal: str) -> RoadmapResponse | None:
    g = goal.lower().strip()
    for key, template in ROADMAP_TEMPLATES.items():
        if key in g or g in key:
            return template.model_copy(deep=True)
    return None


async def generate_roadmap(request: RoadmapRequest) -> RoadmapResponse:
    template = _match_template(request.goal)
    client = AIClient()

    if client.settings.has_ai:
        try:
            result = await client.complete_json(
                system=(
                    "You are AvsarPath career coach for Gen Z. Generate a learning roadmap JSON with keys: "
                    "goal, overview, skills, certifications, phases (array of {title, duration, topics, projects}), "
                    "project_ideas, resources. Be practical, modern, internship-focused."
                ),
                user=(
                    f"Goal: {request.goal}. Level: {request.experience_level}. "
                    f"Timeline: {request.timeline_months} months."
                ),
            )
            if result:
                return _parse_roadmap_ai(result, request.goal)
        except Exception:
            pass

    if template:
        template.goal = request.goal.title()
        return template

    return _generic_roadmap(request)


def _parse_roadmap_ai(data: dict[str, Any], goal: str) -> RoadmapResponse:
    phases = [
        PhaseItem(**p) if isinstance(p, dict) else p
        for p in data.get("phases", [])
    ]
    return RoadmapResponse(
        goal=data.get("goal", goal),
        overview=data.get("overview", ""),
        skills=data.get("skills", []),
        certifications=data.get("certifications", []),
        phases=phases,
        project_ideas=data.get("project_ideas", []),
        resources=data.get("resources", []),
    )


def _generic_roadmap(request: RoadmapRequest) -> RoadmapResponse:
    return RoadmapResponse(
        goal=request.goal,
        overview=f"A {request.timeline_months}-month path to grow as a {request.goal} — projects over certificates.",
        skills=["Core fundamentals", "Git", "One framework", "Communication", "Portfolio building"],
        certifications=["Relevant free cohort/certificate in your domain"],
        phases=[
            PhaseItem(
                title="Learn",
                duration=f"Month 1–{request.timeline_months // 2}",
                topics=["Fundamentals", "daily practice", "community learning"],
                projects=["Clone + improve one real product UI/feature"],
            ),
            PhaseItem(
                title="Prove & Network",
                duration=f"Month {request.timeline_months // 2 + 1}–{request.timeline_months}",
                topics=["Portfolio", "cold outreach", "communities", "hackathons"],
                projects=["Ship portfolio case study", "Contribute to open source or startup weekend"],
            ),
        ],
        project_ideas=["Portfolio piece solving a real student problem", "Open-source contribution"],
        resources=["freeCodeCamp", "YouTube deep dives", "Discord communities", "GitHub Explore"],
    )
