import { styles } from "../style.js";

const cards = [
  { title: "Fixed Window", description: "Classic rate limiting with consistent bursts." },
  { title: "Sliding Window", description: "Smooth request distribution across intervals." },
  { title: "Token Bucket", description: "High-performance capacity-based throttling." },
  { title: "Leaky Bucket", description: "Gradual request flow with fixed leak rate." },
  { title: "Redis Integration", description: "Fast distributed state storage for limits." },
  { title: "Real-time Analytics", description: "Inspect live API traffic and blocked requests." },
  { title: "Socket.IO Updates", description: "Realtime events for every algorithm change." },
  { title: "JWT Authentication", description: "Secure access and session control for users." },
];

export const Features = () => {
  return (
    <section className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#8B95AE]">Capabilities</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Built for modern API protection</h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-[#B7C0D9]">
          Optimize your API infrastructure with advanced algorithms, centralized monitoring, and strong security controls.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((item) => (
          <div key={item.title} className={`${styles.card} p-6`}>
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#202639] text-accent">
              <span className="text-lg font-semibold">•</span>
            </div>
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[#B7C0D9]">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
