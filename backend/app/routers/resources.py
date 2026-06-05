import json
from pathlib import Path

from fastapi import APIRouter, Query

router = APIRouter()

DATA_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "resources.json"


def _load_resources() -> dict:
    if DATA_PATH.exists():
        with open(DATA_PATH, encoding="utf-8") as f:
            return json.load(f)
    return {"categories": []}


@router.get("/")
async def get_resources(category: str | None = Query(None)):
    data = _load_resources()
    categories = data.get("categories", [])
    if category:
        categories = [c for c in categories if c.get("id") == category]
    return {"categories": categories}


@router.get("/categories")
async def list_categories():
    data = _load_resources()
    return {
        "categories": [
            {"id": c["id"], "title": c["title"], "count": len(c.get("items", []))}
            for c in data.get("categories", [])
        ]
    }
