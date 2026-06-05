from app.schemas.suggestions import SuggestionItem, SuggestionsRequest, SuggestionsResponse
from app.services.ai_client import AIClient

STATIC_SUGGESTIONS: dict[str, list[SuggestionItem]] = {
    "networking": [
        SuggestionItem(
            title="Discord > Random DMs",
            description="Join 2–3 niche servers (React India, ML Ops, design buddies). Add value in #help before asking for referrals.",
            category="networking",
            action_steps=[
                "Search Disboard/Discord for your stack + 'internships'",
                "Reply to 3 questions weekly with genuine help",
                "Share a mini project in #showcase",
            ],
        ),
        SuggestionItem(
            title="Twitter/X Builder Signal",
            description="Post weekly build logs — recruiters follow momentum, not polished LinkedIn essays.",
            category="networking",
            action_steps=[
                "Thread: problem → approach → screenshot → GitHub",
                "Quote-tweet founders with thoughtful questions",
                "Pin your best project thread",
            ],
        ),
        SuggestionItem(
            title="GitHub as Resume",
            description="Pin 3 repos, write READMEs like product pages, add demo GIFs.",
            category="networking",
            action_steps=[
                "Profile README with stack + 'building X'",
                "Consistent green squares via small daily commits",
                "Tag issues 'good first issue' and invite peers",
            ],
        ),
    ],
    "outreach": [
        SuggestionItem(
            title="Cold Email — 3 Block Rule",
            description="Hook (why them) → Proof (1 link) → Ask (15-min chat). Under 120 words.",
            category="outreach",
            action_steps=[
                "Subject: 'Student builder — loved your [specific feature]'",
                "One line on their product you used",
                "CTA: 'Open to a 15-min intern chat this week?'",
            ],
        ),
        SuggestionItem(
            title="Founder DM on LinkedIn",
            description="Startups hire faster than HR portals. Message founders after engaging with their content.",
            category="outreach",
            action_steps=[
                "Comment on 2 posts authentically",
                "Send connection note referencing their post",
                "Attach Loom demo if visual product",
            ],
        ),
    ],
    "internships": [
        SuggestionItem(
            title="Telegram Internship Channels",
            description="Many Indian startups post roles in Telegram before Naukri. Search '[stack] internships india'.",
            category="internships",
            action_steps=[
                "Join 3 verified channels (check message history)",
                "Set keyword alerts if client supports",
                "Apply within 24h with tailored 3-line intro",
            ],
        ),
        SuggestionItem(
            title="WhatsApp Campus Circles",
            description="Seniors share unposted roles in groups — ask politely, offer help back.",
            category="internships",
            action_steps=[
                "Ask placement cell for alumni startup groups",
                "Share useful resources weekly (not spam)",
                "DM seniors: 'Happy to review your deck if you share leads'",
            ],
        ),
        SuggestionItem(
            title="Open Source → Intern Pipeline",
            description="Merge PRs on startup OSS repos — founders notice contributors.",
            category="internships",
            action_steps=[
                "Filter GitHub issues: label=good-first-issue",
                "Fix docs/tests first (fast merge)",
                "Mention PR in outreach email subject line",
            ],
        ),
    ],
    "growth": [
        SuggestionItem(
            title="Weekly Learning Sprint",
            description="One skill deep-dive + one ship — avoid tutorial paralysis.",
            category="growth",
            action_steps=[
                "Mon–Thu: learn 45 min/day",
                "Fri–Sun: ship small feature",
                "Public post every Sunday",
            ],
        ),
        SuggestionItem(
            title="Personal Brand Stack",
            description="LinkedIn for credibility, GitHub for proof, X for momentum.",
            category="growth",
            action_steps=[
                "LinkedIn headline: 'Building [X] | [stack]'",
                "GitHub pinned repos with demos",
                "Repeat one theme across platforms",
            ],
        ),
    ],
    "general": [],
}


async def generate_suggestions(request: SuggestionsRequest) -> SuggestionsResponse:
    focus = request.focus.lower() if request.focus else "general"
    client = AIClient()

    if client.settings.has_ai:
        try:
            result = await client.complete_json(
                system=(
                    "You are AvsarPath Gen Z career coach. Return JSON: "
                    "{ focus, suggestions: [{ title, description, category, action_steps }] }. "
                    "Teach HOW to find opportunities — not job listings. Modern channels only."
                ),
                user=f"Focus: {focus}. Interests: {', '.join(request.interests) or 'general tech'}.",
            )
            if result and result.get("suggestions"):
                items = [SuggestionItem(**s) for s in result["suggestions"]]
                return SuggestionsResponse(focus=focus, suggestions=items[:8])
        except Exception:
            pass

    pool: list[SuggestionItem] = []
    if focus == "general":
        for key in ("networking", "outreach", "internships", "growth"):
            pool.extend(STATIC_SUGGESTIONS.get(key, [])[:2])
    else:
        pool = list(STATIC_SUGGESTIONS.get(focus, STATIC_SUGGESTIONS["networking"]))

    return SuggestionsResponse(focus=focus, suggestions=pool[:8])
