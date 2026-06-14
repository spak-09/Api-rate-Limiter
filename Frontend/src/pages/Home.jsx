import { Hero } from "../components/Hero.jsx";
import { Footer } from "../components/Footer.jsx";

const architecture = [
  "Client",
  "Express",
  "JWT Middleware",
  "Rate Limiter",
  "Controller",
  "MongoDB",
];

const statistics = [
  { label: "4 Algorithms", value: "Fixed, Sliding, Token, Leaky" },
  { label: "Redis Powered", value: "Distributed state management" },
  { label: "Real-Time Monitoring", value: "Live analytics and events" },
  { label: "Admin Dashboard", value: "Control limits and algorithms" },
];

export const Home = () => {
  return (
    <main className="space-y-14 pt-8 pb-20 lg:pt-12">
      <Hero />

      <section className="rounded-[2rem] border border-border bg-surface/80 p-8 shadow-glow backdrop-blur-xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#8B95AE]">Architecture</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Secure request flow with Redis-backed limiting</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#B7C0D9]">
              Api-rate-Limiter unifies API protection, authentication, and analytics in a single platform designed for modern service architectures.
            </p>
          </div>

          <div className="space-y-4">
            {architecture.map((step, index) => (
              <div key={step} className="flex items-center gap-4 rounded-3xl border border-border bg-[#11151F]/80 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-accent/10 text-accent">{index + 1}</div>
                <p className="text-sm text-text">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statistics.map((item) => (
          <div key={item.label} className="rounded-[2rem] border border-border bg-[#11151F]/80 p-6 shadow-glow">
            <p className="text-sm uppercase tracking-[0.3em] text-[#8B95AE]">{item.label}</p>
            <p className="mt-4 text-xl font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </section>

      <Footer />
    </main>
  );
};
