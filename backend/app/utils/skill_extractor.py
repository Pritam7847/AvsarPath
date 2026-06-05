import re
from functools import lru_cache

# Curated skill lexicon for students (rule-based + optional spaCy)
SKILL_LEXICON = {
    "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust", "kotlin", "swift",
    "react", "vue", "angular", "next.js", "node.js", "express", "fastapi", "django", "flask",
    "html", "css", "tailwind", "sass", "figma", "ui/ux", "design systems",
    "sql", "mongodb", "postgresql", "mysql", "redis", "firebase",
    "aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "git", "github",
    "machine learning", "deep learning", "tensorflow", "pytorch", "scikit-learn", "nlp",
    "data structures", "algorithms", "system design", "rest api", "graphql",
    "communication", "leadership", "teamwork", "problem solving",
    "tensorflow", "pandas", "numpy", "opencv", "llm", "generative ai",
}

DOMAIN_KEYWORDS = {
    "frontend developer": ["react", "javascript", "css", "html", "typescript", "ui"],
    "backend developer": ["python", "fastapi", "node.js", "sql", "rest api", "docker"],
    "full stack developer": ["react", "node.js", "mongodb", "sql", "rest api"],
    "ai engineer": ["python", "machine learning", "pytorch", "tensorflow", "nlp"],
    "data scientist": ["python", "pandas", "sql", "machine learning", "statistics"],
    "ui/ux designer": ["figma", "ui/ux", "design systems", "prototyping"],
    "devops engineer": ["docker", "kubernetes", "ci/cd", "aws", "linux"],
    "mobile developer": ["kotlin", "swift", "react native", "flutter"],
}


@lru_cache(maxsize=1)
def _get_nlp():
    try:
        import spacy
        try:
            return spacy.load("en_core_web_sm")
        except OSError:
            return spacy.blank("en")
    except Exception:
        return None


def extract_skills(text: str) -> list[str]:
    text_lower = text.lower()
    found = set()

    for skill in SKILL_LEXICON:
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"
        if re.search(pattern, text_lower):
            found.add(skill.title() if skill.islower() else skill)

    nlp = _get_nlp()
    if nlp:
        doc = nlp(text[:50000])
        for ent in doc.ents:
            if ent.label_ in ("ORG", "PRODUCT", "LANGUAGE"):
                token = ent.text.strip().lower()
                if token in SKILL_LEXICON:
                    found.add(token.title())

    return sorted(found, key=str.lower)


def infer_career_domains(skills: list[str], text: str) -> list[str]:
    skill_set = {s.lower() for s in skills}
    text_lower = text.lower()
    scores: dict[str, int] = {}

    for domain, keywords in DOMAIN_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in skill_set or kw in text_lower)
        if score > 0:
            scores[domain] = score

    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return [d.replace("_", " ").title() for d, _ in ranked[:4]] or ["General Tech"]
