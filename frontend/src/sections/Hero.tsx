import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ArrowDown, Sparkles } from "lucide-react";
import AnimatedGrid from "../components/AnimatedGrid";
import MagneticButton from "../components/MagneticButton";

const words = ["discover", "network", "outreach", "stand out"];

export default function Hero() {
  const wordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let i = 0;
    const el = wordRef.current;
    if (!el) return;

    const cycle = () => {
      gsap.to(el, {
        opacity: 0,
        y: -12,
        duration: 0.35,
        onComplete: () => {
          i = (i + 1) % words.length;
          el.textContent = words[i];
          gsap.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45 });
        },
      });
    };

    const id = setInterval(cycle, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24">
      <AnimatedGrid />

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-mono text-accent2"
        >
          <Sparkles size={14} />
          AI-assisted career playbook · Gen Z edition
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl"
        >
          Learn how to
          <br />
          <span ref={wordRef} className="text-gradient-accent inline-block">
            discover
          </span>
          <br />
          <span className="text-white/40">not just apply.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mx-auto mt-8 max-w-2xl text-lg text-white/50 md:text-xl"
        >
          AvsarPath teaches cold emails, modern networking, internship discovery on
          Social Media, and personal branding — without being another job board.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton href="#resume">Analyze your resume</MagneticButton>
          <MagneticButton href="#roadmap" variant="ghost">
            Build your roadmap
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-24 flex justify-center"
        >
          <a href="#discover" className="flex flex-col items-center gap-2 text-white/30 hover:text-white/60">
            <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
            <ArrowDown size={20} className="animate-bounce" />
          </a>
        </motion.div>
      </div>

      {/* Floating orbs */}
      <motion.div
        className="absolute left-[10%] top-[30%] h-3 w-3 rounded-full bg-accent2 shadow-[0_0_20px_#00e5c0]"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute right-[15%] top-[40%] h-2 w-2 rounded-full bg-accent shadow-[0_0_20px_#7c5cff]"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />
    </section>
  );
}
