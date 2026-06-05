import { motion } from "framer-motion";
import { Mail, Copy, Check } from "lucide-react";
import { useState } from "react";
import SectionHeading from "../components/SectionHeading";

const template = `Subject: Fresh Graduate in [Your Field] — Eager to Contribute at [Company Name]

Hi [Name],

I recently graduated with a degree in [Your Degree] from [College Name] and have been following [Company Name]'s work in [specific area] — particularly [mention something specific like a product, project, or news].

I'm reaching out because I'd love to explore if there's a fit for a [role/internship] on your team. During my studies, I [mention 1–2 relevant projects or skills — e.g., "built a React dashboard for my final year project" or "interned briefly at X where I handled Y"].

I'd be grateful for even 15 minutes of your time to learn more about your team's direction.

[Your LinkedIn / Portfolio link]
Thanks for your time,
[Your Name]`;

const steps = [
  {
    step: "01",
    tag: "before you write",
    tagColor: "purple",
    title: "Stalk before you send",
    body: "Open their product, read their last 3 LinkedIn posts, check their GitHub. Drop one hyper-specific detail in line 1 — it signals you're not mass blasting.",
    tip: "\"I noticed your checkout flow has no guest option — I have a fix idea\" beats \"I love your company.\"",
  },
  {
    step: "02",
    tag: "your proof",
    tagColor: "teal",
    title: "Lead with a link, not a degree",
    body: "One link — GitHub repo, Loom walkthrough, or Notion case study. No portfolio? Build a 2-hour project that solves their actual problem and link that.",
    tip: "Freshers win on proof, not credentials. The link is your résumé.",
  },
  {
    step: "03",
    tag: "your ask",
    tagColor: "amber",
    title: "Ask for a conversation, not a job",
    body: "\"15-minute call\" or \"reply with one thought\" converts 3× better than \"please consider me.\" Lower the stakes — make saying yes effortless.",
    tip: "Curiosity + a micro-ask = reply. \"Hire me\" = delete.",
  },
  {
    step: "04",
    tag: "follow-up",
    tagColor: "coral",
    title: "One bump with a new update",
    body: "Wait 5–7 days, then follow up with a progress signal — a PR merged, a feature shipped, a new result. It shows momentum, not desperation.",
    tip: "\"Shipped X since my last email\" is the best follow-up line a fresher can send.",
  },
];

export default function ColdEmailGuide() {
  const [copied, setCopied] = useState(false);

  const copyTemplate = async () => {
    await navigator.clipboard.writeText(template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="cold-email" className="relative py-32">
      <div className="absolute inset-0 bg-radial-glow opacity-50" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          label="Outreach Playbook"
          title="Cold emails that founders actually read"
          subtitle="Not too Big, Not too Small. Specific hook. One link. One small ask."
        />

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6"
              >
                <span className="font-mono text-3xl font-bold text-accent/40">{s.step}</span>
                <div>
                  <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-white/50">{s.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-strong relative rounded-2xl p-8"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-accent2">
                <Mail size={18} />
                <span className="font-mono text-xs uppercase tracking-wider">Template</span>
              </div>
              <button
                type="button"
                onClick={copyTemplate}
                className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs hover:bg-white/20"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-relaxed text-white/70">
              {template}
            </pre>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
