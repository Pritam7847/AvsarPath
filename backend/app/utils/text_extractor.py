import io
from typing import Optional

from PyPDF2 import PdfReader
from docx import Document


def extract_text_from_bytes(content: bytes, filename: str) -> str:
    lower = filename.lower()
    if lower.endswith(".pdf"):
        return _extract_pdf(content)
    if lower.endswith(".docx"):
        return _extract_docx(content)
    if lower.endswith(".txt"):
        return content.decode("utf-8", errors="ignore")
    raise ValueError("Unsupported file type. Use PDF, DOCX, or TXT.")


def _extract_pdf(content: bytes) -> str:
    reader = PdfReader(io.BytesIO(content))
    parts: list[str] = []
    for page in reader.pages:
        text: Optional[str] = page.extract_text()
        if text:
            parts.append(text)
    return "\n".join(parts).strip()


def _extract_docx(content: bytes) -> str:
    doc = Document(io.BytesIO(content))
    return "\n".join(p.text for p in doc.paragraphs if p.text.strip()).strip()
