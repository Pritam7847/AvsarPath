import { motion } from "framer-motion";
import {
  MessageCircle,
  Send,
  Twitter,
  Github,
  Rocket,
  Users,
} from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { useSpotlight } from "../hooks/useSpotlight";

const channels = [
  {
    icon: Send,
    title: "Telegram Groups",
    color: "from-blue-500/20 to-blue-600/5",
    tips: [
      "Search '[stack] internships india' — verify message history before joining",
      "Avoid fake channels; star 2–3 high-signal ones",
      "Reply with value before asking 'any openings?'",
    ],
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Circles",
    color: "from-green-500/20 to-green-600/5",
    tips: [
      "Campus alumni & placement-adjacent groups share unposted roles",
      "Try to Connect with Super Seniors and get the latest updates and news about the Openings",
      "Some Youtube Channels create Whats App Groups/Channels to share internships and jobs",
    ],
  },
  {
    icon: Users,
    title: "AI Tools",
    color: "from-indigo-500/20 to-indigo-600/5",
    tips: [
      "Ask ChatGPT to find internships matching your skills and location",
      "Use Claude to discover recently posted jobs and startup openings",
      "Set up AI-powered job alerts to get notified when new roles are published",
    ],
  },
  {
    icon: Twitter,
    title: "Twitter / X",
    color: "from-sky-500/20 to-sky-600/5",
    tips: [
      "Follow founders + Employees of the companies to get the latest updates and news about the companies",
      "Many Users helps online by giving referrals to the companies",
      "Many HR Groups are created to share internships and jobs",
    ],
  },
  {
    icon: Rocket,
    title: "Startup Founders",
    color: "from-orange-500/20 to-orange-600/5",
    tips: [
      "Wellfound & YC Work at a Startup for early roles",
      "Engage with content before cold DMs",
      "15-min chat ask > 'please hire me' essay",
    ],
  },
  {
    icon: Github,
    title: "Open Source",
    color: "from-purple-500/20 to-purple-600/5",
    tips: [
      "good-first-issue PRs on startup repos",
      "Docs fixes merge fast — mention PR in outreach",
      "Pinned repos = living resume",
    ],
  },
];

export default function InternshipDiscovery() {
  const onSpotlight = useSpotlight();

  return (
    <section id="discover" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          label="Modern Discovery"
          title="Find internships where Gen Z actually looks"
          subtitle="Job portals are the last step — not the first. Learn the channels that surface opportunities early."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {channels.map((ch, i) => (
            <motion.article
              key={ch.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onMouseMove={onSpotlight}
              className={`spotlight glass group rounded-2xl p-8 bg-gradient-to-br ${ch.color}`}
            >
              <ch.icon className="mb-4 text-accent2" size={28} />
              <h3 className="font-display text-xl font-semibold">{ch.title}</h3>
              <ul className="mt-4 space-y-3">
                {ch.tips.map((tip) => (
                  <li key={tip} className="flex gap-2 text-sm text-white/55">
                    <span className="text-accent2">→</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
