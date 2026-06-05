export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 md:flex-row">
        <div>
          <p className="font-display text-2xl font-bold">
            Avsar<span className="text-accent">Path</span>
          </p>
          <p className="mt-2 max-w-sm text-sm text-white/40">
            Not a job portal — a modern career playbook for students who build
            their own opportunities.
          </p>
        </div>
        <p className="font-mono text-xs text-white/30">
          No login · No resume storage · Processed in memory only
        </p>
      </div>
    </footer>
  );
}
