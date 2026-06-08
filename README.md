# AvsarPath

**Modern AI-assisted career playbook for Gen Z students** — not a job portal.

AvsarPath teaches students *how* to discover opportunities: cold emails, Telegram/Discord networking, personal branding, resume improvement, and AI-generated learning roadmaps.

## Architecture

```
avsarpath/
├── frontend/          # React + Vite + Tailwind + Framer Motion + GSAP + Lenis
│   └── src/
│       ├── components/   # Navbar, MagneticButton, SectionHeading, …
│       ├── sections/     # Hero, Discovery, Cold Email, Resume, Roadmap, …
│       ├── hooks/        # Lenis, spotlight, magnetic
│       └── lib/api.ts    # API client (proxied to backend in dev)
│
└── backend/           # FastAPI (modular routers + services)
    ├── app/
    │   ├── routers/      # resume, roadmap, suggestions, resources
    │   ├── services/     # AI client, analyzers (no persistence)
    │   ├── schemas/      # Pydantic models
    │   └── utils/        # PDF/DOCX extract, skill NLP
    └── data/
        └── resources.json   # Static curated links (no MongoDB required)
```

### Design principles

| Area | Approach |
|------|----------|
| Auth | None — open access |
| Resume uploads | Processed in memory only, never stored |
| Database | Optional — static JSON for resources |
| AI | Groq API when key set; rich heuristics otherwise |
| Frontend | Cinematic dark UI, smooth scroll, magnetic CTAs |

## Tech stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, GSAP, Lenis
- **Backend:** FastAPI, Pydantic, PyPDF2, python-docx, spaCy (optional), scikit-learn
- **AI:** Groq (Llama 3.3 70B via OpenAI-compatible API)

## Quick start

### Prerequisites

- Node.js 18+
- Python 3.11+
- (Optional) `GROQ_API_KEY` from [console.groq.com](https://console.groq.com/keys) for enhanced AI

### Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt
# Optional: python -m spacy download en_core_web_sm

copy .env.example .env
# Edit .env with your API key

uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

API docs: http://127.0.0.1:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 — Vite proxies `/api` to the backend.

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health + AI status |
| POST | `/api/resume/analyze` | Upload resume (PDF/DOCX/TXT), get feedback |
| POST | `/api/roadmap/generate` | Generate career roadmap |
| GET | `/api/roadmap/goals` | List career goals |
| POST | `/api/suggestions/generate` | Networking/outreach playbook |
| GET | `/api/resources/` | Curated resources |

## Environment variables

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
CORS_ORIGINS=http://localhost:5173
```

## Deployment

### Render

This repo is ready for Render monorepo deployment with two services:

- `avsarpath-backend`: Docker web service using `backend/Dockerfile`
- `avsarpath-frontend`: static site using the `frontend` folder

The backend container uses `PORT` at runtime, and the frontend reads `VITE_API_URL` to call the API.

Render service environment variables:

- `GROQ_API_KEY`
- `GROQ_MODEL`
- `CORS_ORIGINS`
- `VITE_API_URL`

Use the root `render.yaml` file included in this repo to configure both services.

### Frontend (Vercel / Netlify)

```bash
cd frontend
npm run build
```

Set `VITE_API_URL` to your production API URL, for example `https://avsarpath.onrender.com`.

### Backend (Railway / Render / Fly.io)

- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Set environment variables from `.env.example`
- Do **not** enable persistent file storage for uploads

### Docker (optional)

```dockerfile
# Backend Dockerfile example
FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
```

## Privacy

- No login or user accounts
- Resumes are never written to disk or database
- Only anonymous API requests for AI features

## License

MIT — built for students learning to create their own opportunities.
