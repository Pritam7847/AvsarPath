from fastapi import APIRouter, File, HTTPException, UploadFile

from app.schemas.resume import ResumeAnalysisResponse
from app.services.resume_analyzer import analyze_resume_text
from app.utils.text_extractor import extract_text_from_bytes

router = APIRouter()

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}


@router.post("/analyze", response_model=ResumeAnalysisResponse)
async def analyze_resume(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename required")

    ext = "." + file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only PDF, DOCX, or TXT allowed")

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")

    try:
        text = extract_text_from_bytes(content, file.filename)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=422, detail="Could not parse file") from e

    if len(text.strip()) < 50:
        raise HTTPException(status_code=422, detail="Resume text too short to analyze")

    # Process in memory only — content is not persisted
    result = await analyze_resume_text(text)
    del content, text
    return result
