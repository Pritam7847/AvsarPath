import json
import re
from typing import Any

import httpx

from app.config import get_settings

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


class AIClient:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def complete_json(self, system: str, user: str) -> dict[str, Any] | None:
        if not self.settings.has_ai:
            return None
        return await self._groq_json(system, user)

    async def _groq_json(self, system: str, user: str) -> dict[str, Any] | None:
        headers = {
            "Authorization": f"Bearer {self.settings.groq_api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.settings.groq_model,
            "messages": [
                {"role": "system", "content": system + "\nRespond ONLY with valid JSON, no markdown."},
                {"role": "user", "content": user},
            ],
            "temperature": 0.4,
            "max_tokens": 4096,
            "response_format": {"type": "json_object"},
        }
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(GROQ_API_URL, headers=headers, json=payload)
            resp.raise_for_status()
            text = resp.json()["choices"][0]["message"]["content"]
        return _parse_json(text)


def _parse_json(text: str) -> dict[str, Any]:
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\n?", "", text)
        text = re.sub(r"\n?```$", "", text)
    return json.loads(text)
