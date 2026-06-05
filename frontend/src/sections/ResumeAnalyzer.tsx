import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Shield, Loader2, FileText } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { analyzeResume, type ResumeAnalysis } from "../lib/api";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ResumeAnalysis | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setError("");
    setResult(null);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const data = await analyzeResume(file);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="resume" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          label="Resume AI"
          title="Instant resume feedback — nothing stored"
          subtitle="Upload PDF, DOCX, or TXT. We process in memory, return suggestions, and discard your file."
          align="center"
        />

        <div className="mx-auto max-w-4xl">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="glass spotlight relative rounded-3xl border-2 border-dashed border-white/10 p-12 text-center transition hover:border-accent/40"
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <Upload className="mx-auto mb-4 text-accent" size={40} />
            <p className="font-display text-xl font-semibold">
              {file ? file.name : "Drop your resume here"}
            </p>
            <p className="mt-2 text-sm text-white/40">PDF · DOCX · TXT · Max 5MB</p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-full glass px-6 py-3 text-sm hover:border-accent/50"
              >
                Choose file
              </button>
              {file && (
                <button
                  type="button"
                  onClick={analyze}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : null}
                  {loading ? "Analyzing…" : "Analyze now"}
                </button>
              )}
            </div>
            <p className="mt-6 flex items-center justify-center gap-2 text-xs text-accent2">
              <Shield size={14} />
              No login · No database · Ephemeral processing only
            </p>
          </div>

          {error && (
            <p className="mt-4 text-center text-sm text-red-400">{error}</p>
          )}

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-12 space-y-8"
              >
                <div className="glass rounded-2xl p-8">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs text-white/40">Quality score</p>
                      <p className="font-display text-6xl font-bold text-gradient-accent">
                        {result.quality_score}
                      </p>
                    </div>
                    <p className="max-w-md text-sm text-white/50">{result.summary}</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <ResultCard title="Skills detected" items={result.skills} icon={<FileText size={16} />} />
                  <ResultCard title="Career fit" items={result.career_domains} />
                  <ResultCard title="Strengths" items={result.strengths} variant="positive" />
                  <ResultCard title="Improve" items={result.improvements} />
                  <ResultCard title="Missing skills" items={result.missing_skills} />
                  <ResultCard title="Structure tips" items={result.structure_suggestions} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function ResultCard({
  title,
  items,
  variant,
  icon,
}: {
  title: string;
  items: string[];
  variant?: "positive";
  icon?: React.ReactNode;
}) {
  if (!items.length) return null;
  return (
    <div className="glass rounded-2xl p-6">
      <h4 className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-accent2">
        {icon}
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className={`text-sm ${variant === "positive" ? "text-accent2/90" : "text-white/60"}`}
          >
            {variant === "positive" ? "✓ " : "→ "}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
