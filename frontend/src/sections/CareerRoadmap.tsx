import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Loader2, ChevronRight } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { fetchGoals, generateRoadmap, type Roadmap } from "../lib/api";

export default function CareerRoadmap() {
  const [goals, setGoals] = useState<string[]>([]);
  const [goal, setGoal] = useState("Frontend Developer");
  const [level, setLevel] = useState("beginner");
  const [months, setMonths] = useState(6);
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGoals()
      .then(setGoals)
      .catch(() =>
        setGoals([
          "Frontend Developer",
          "AI Engineer",
          "UI/UX Designer",
          "Backend Developer",
          "Full Stack Developer",
        ])
      );
  }, []);

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await generateRoadmap(goal, level, months);
      setRoadmap(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="roadmap" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          label="Career Roadmap"
          title="Your learning path — projects over certificates"
          subtitle="Pick a goal. Get phases, skills, certifications, and project ideas tailored for students."
        />

        <div className="glass rounded-3xl p-8 md:p-10">
          <div className="grid gap-6 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block font-mono text-xs text-white/40">Career goal</span>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-void px-4 py-3 text-sm focus:border-accent outline-none"
              >
                {goals.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block font-mono text-xs text-white/40">Experience</span>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-void px-4 py-3 text-sm focus:border-accent outline-none"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block font-mono text-xs text-white/40">Timeline (months)</span>
              <input
                type="range"
                min={3}
                max={18}
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full accent-accent"
              />
              <span className="mt-1 block text-center font-mono text-sm text-accent2">{months} months</span>
            </label>
          </div>

          <button
            type="button"
            onClick={generate}
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-white py-4 font-semibold text-void transition hover:bg-accent2 disabled:opacity-50 md:w-auto md:px-12"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Map size={18} />}
            Generate roadmap
          </button>
          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        </div>

        <AnimatePresence>
          {roadmap && (
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 space-y-8"
            >
              <div className="glass rounded-2xl p-8">
                <h3 className="font-display text-3xl font-bold">{roadmap.goal}</h3>
                <p className="mt-4 text-white/55">{roadmap.overview}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {roadmap.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-accent/20 px-3 py-1 text-xs text-accent2"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {roadmap.phases.map((phase, i) => (
                  <motion.div
                    key={phase.title}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="font-mono text-xs text-accent">{phase.duration}</span>
                        <h4 className="font-display text-xl font-semibold">{phase.title}</h4>
                      </div>
                      <ChevronRight className="text-white/20" />
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="mb-2 font-mono text-xs text-white/40">Topics</p>
                        <ul className="space-y-1 text-sm text-white/60">
                          {phase.topics.map((t) => (
                            <li key={t}>· {t}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="mb-2 font-mono text-xs text-white/40">Projects</p>
                        <ul className="space-y-1 text-sm text-accent2/80">
                          {phase.projects.map((p) => (
                            <li key={p}>→ {p}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <ListBlock title="Project ideas" items={roadmap.project_ideas} />
                <ListBlock title="Certifications" items={roadmap.certifications} />
                <ListBlock title="Resources" items={roadmap.resources} className="md:col-span-2" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function ListBlock({
  title,
  items,
  className = "",
}: {
  title: string;
  items: string[];
  className?: string;
}) {
  return (
    <div className={`glass rounded-2xl p-6 ${className}`}>
      <h4 className="font-mono text-xs uppercase tracking-wider text-accent2">{title}</h4>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm text-white/60">
            → {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
