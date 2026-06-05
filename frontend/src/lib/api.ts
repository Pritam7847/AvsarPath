const API_BASE = import.meta.env.VITE_API_URL || "";

export interface ResumeAnalysis {
  skills: string[];
  quality_score: number;
  strengths: string[];
  improvements: string[];
  missing_skills: string[];
  structure_suggestions: string[];
  career_domains: string[];
  summary: string;
}

export interface RoadmapPhase {
  title: string;
  duration: string;
  topics: string[];
  projects: string[];
}

export interface Roadmap {
  goal: string;
  overview: string;
  skills: string[];
  certifications: string[];
  phases: RoadmapPhase[];
  project_ideas: string[];
  resources: string[];
}

export interface Suggestion {
  title: string;
  description: string;
  category: string;
  action_steps: string[];
}

export interface ResourceItem {
  name: string;
  url: string;
  type: string;
  tip: string;
}

export interface ResourceCategory {
  id: string;
  title: string;
  description?: string;
  items: ResourceItem[];
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

export async function analyzeResume(file: File): Promise<ResumeAnalysis> {
  const form = new FormData();
  form.append("file", file);
  return request("/api/resume/analyze", { method: "POST", body: form });
}

export async function generateRoadmap(
  goal: string,
  experienceLevel: string,
  timelineMonths: number
): Promise<Roadmap> {
  return request("/api/roadmap/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      goal,
      experience_level: experienceLevel,
      timeline_months: timelineMonths,
    }),
  });
}

export async function fetchGoals(): Promise<string[]> {
  const data = await request<{ goals: string[] }>("/api/roadmap/goals");
  return data.goals;
}

export async function generateSuggestions(
  focus: string,
  interests: string[] = []
): Promise<{ focus: string; suggestions: Suggestion[] }> {
  return request("/api/suggestions/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ focus, interests }),
  });
}

export async function fetchResources(): Promise<{ categories: ResourceCategory[] }> {
  return request("/api/resources/");
}

export async function checkHealth(): Promise<{ status: string; ai_enabled: boolean }> {
  return request("/api/health");
}
