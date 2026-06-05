import { motion } from "framer-motion";
import { Linkedin, Github, Layout, Network } from "lucide-react";
import SectionHeading from "../components/SectionHeading";

const pillars = [
  {
    icon: Linkedin,
    title: "LinkedIn",
    tips: [
      "Headline: 'Building [X] | [stack]' — not 'Student at…'",
      "Banner: project screenshot or clean personal brand",
      "Featured: best project, GitHub, portfolio link",
      "Post 1×/week: lesson learned, not motivational quotes",
    ],
  },
  {
    icon: Github,
    title: "GitHub",
    tips: [
      "Profile README with what you're building now",
      "Pin 3 repos with GIF demos in README",
      "Consistent commits > perfect green square aesthetics",
      "Contribute to OSS — PR link in every outreach",
    ],
  },
  {
    icon: Layout,
    title: "Portfolio",
    tips: [
      "One memorable case study > ten generic projects",
      "Show process: problem → wireframe → ship",
      "Performance & motion = frontend interview signal",
      "Mobile-first — recruiters check on phones",
    ],
  },
  {
    icon: Network,
    title: "Networking",
    tips: [
      "Give before you ask: share resources, feedback, intros",
      "Track 10 warm contacts, not 500 random connections",
      "Voice notes / Loom > walls of text for founders",
      "Follow up with shipped work, not 'just checking in'",
    ],
  },
];

export default function PersonalBranding() {
  return (
    <section id="branding" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          label="Personal Brand"
          title="Stand out before you apply"
          subtitle="Recruiters check GitHub and LinkedIn in 30 seconds. Make those seconds count."
          align="center"
        />

        <div className="grid gap-8 md:grid-cols-2">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass group rounded-3xl p-8 transition hover:border-accent/30"
            >
              <p.icon className="mb-4 text-accent" size={32} />
              <h3 className="font-display text-2xl font-bold">{p.title}</h3>
              <ul className="mt-6 space-y-3">
                {p.tips.map((tip) => (
                  <li key={tip} className="text-sm text-white/55 leading-relaxed">
                    <span className="mr-2 text-accent2">◆</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
