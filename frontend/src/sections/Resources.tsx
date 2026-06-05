import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { fetchResources, type ResourceCategory } from "../lib/api";

const FALLBACK: ResourceCategory[] = [
  {
    id: "communities",
    title: "Communities",
    items: [
      { name: "Disboard", url: "https://disboard.org", type: "Discord", tip: "Find niche servers" },
      { name: "Indie Hackers", url: "https://indiehackers.com", type: "Startups", tip: "Engage with founders" },
    ],
  },
];

export default function Resources() {
  const [categories, setCategories] = useState<ResourceCategory[]>([]);

  useEffect(() => {
    fetchResources()
      .then((d) => setCategories(d.categories))
      .catch(() => setCategories(FALLBACK));
  }, []);

  return (
    <section id="resources" className="relative py-32 pb-40">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          label="Curated Resources"
          title="Links that actually help students"
          subtitle="Communities, learning paths, hackathons, and platforms — curated for modern discovery."
        />

        <div className="space-y-16">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ci * 0.05 }}
            >
              <h3 className="font-display text-2xl font-bold">{cat.title}</h3>
              {cat.description && (
                <p className="mt-2 text-white/45">{cat.description}</p>
              )}
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cat.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass group flex flex-col rounded-xl p-5 transition hover:border-accent/40"
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-semibold group-hover:text-accent2">{item.name}</span>
                      <ExternalLink size={14} className="text-white/30" />
                    </div>
                    <span className="mt-1 font-mono text-[10px] uppercase text-accent/80">
                      {item.type}
                    </span>
                    <p className="mt-3 text-sm text-white/45">{item.tip}</p>
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
