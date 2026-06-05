from pydantic import BaseModel, Field


class SuggestionsRequest(BaseModel):
    focus: str = Field(
        default="general",
        description="networking | outreach | internships | growth | general",
    )
    interests: list[str] = Field(default_factory=list, max_length=10)


class SuggestionItem(BaseModel):
    title: str
    description: str
    category: str
    action_steps: list[str] = Field(default_factory=list)


class SuggestionsResponse(BaseModel):
    focus: str
    suggestions: list[SuggestionItem] = Field(default_factory=list)
