import { Link } from "react-router-dom";
import { styles } from "../style.js";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-border bg-surface/90 p-8 shadow-glow backdrop-blur-xl sm:p-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.35),_transparent_40%)]" />
      <div className="absolute right-0 top-24 h-24 w-24 rounded-full bg-accent/15 blur-3xl" />
      <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-accent">
            Enterprise protection
          </span>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Api-rate-Limiter
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[#B7C0D9]">
            Protect APIs from abuse using Redis-powered algorithms with real-time analytics and monitoring.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/register" className={styles.buttonPrimary}>
              Get Started
            </Link>
            <Link to="/login" className={styles.buttonSecondary}>
              Login
            </Link>
          </div>
        </div>

        <div className="relative rounded-[2rem] border border-[#2A2F3A] bg-[#0F1117]/80 p-5 shadow-xl">
          <div className="space-y-4 rounded-[1.5rem] bg-[#11151F] p-6 text-text">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8B95AE]">Active algorithm</span>
              <span className="rounded-full bg-[#1C2334] px-3 py-1 text-xs text-text/80">Fixed Window</span>
            </div>
            <div className="space-y-3">
              <div className="rounded-3xl bg-[#181D2A] p-4">
                <div className="flex items-center justify-between text-sm text-[#A3AFC8]">
                  <span>Request count</span>
                  <span>63%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#11151F]">
                  <div className="h-full w-3/5 rounded-full bg-accent transition-all duration-700" />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-[#181D2A] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8B95AE]">Blocked</p>
                  <p className="mt-3 text-2xl font-semibold text-white">12</p>
                </div>
                <div className="rounded-3xl bg-[#181D2A] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8B95AE]">Redis events</p>
                  <p className="mt-3 text-2xl font-semibold text-white">48/sec</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
