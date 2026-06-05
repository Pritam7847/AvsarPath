import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Loader2 } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { generateSuggestions, type Suggestion } from "../lib/api";

const focusOptions = [
  { id: "general", label: "All-round" },
  { id: "networking", label: "Networking" },
  { id: "outreach", label: "Outreach" },
  { id: "internships", label: "Internships" },
  { id: "growth", label: "Growth" },
];

export default function SmartSuggestions() {
  const [focus, setFocus] = useState("general");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const load = useCallback(async (f: string) => {
    setFocus(f);
    setLoading(true);
    try {
      const data = await generateSuggestions(f);
      setSuggestions(data.suggestions);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load("general");
  }, [load]);

  return (
    <section id="suggestions" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          label="Smart Playbook"
          title="Gen Z career moves — generated for you"
          subtitle="Actionable networking, outreach, and discovery strategies. No job listings — just how-to."
          align="center"
        />

        <div className="flex flex-wrap justify-center gap-3">
          {focusOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => load(opt.id)}
              className={`rounded-full px-5 py-2 text-sm transition ${
                focus === opt.id
                  ? "bg-accent text-white"
                  : "glass text-white/60 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => load(focus)}
            disabled={loading}
            className="flex items-center gap-2 rounded-full glass px-6 py-3 text-sm hover:border-accent/50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Lightbulb size={16} />}
            Refresh suggestions
          </button>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.p
              key="load"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12 text-center text-white/40"
            >
              Crafting your playbook…
            </motion.p>
          ) : suggestions.length > 0 ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 grid gap-6 md:grid-cols-2"
            >
              {suggestions.map((s, i) => (
                <motion.article
                  key={s.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass rounded-2xl p-6"
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-accent2">
                    {s.category}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-white/50">{s.description}</p>
                  <ul className="mt-4 space-y-2 border-t border-white/5 pt-4">
                    {s.action_steps.map((step) => (
                      <li key={step} className="text-xs text-white/45">
                        → {step}
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.p
              key="empty"
              className="mt-12 text-center text-white/40"
            >
              Select a focus area to load your playbook.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
