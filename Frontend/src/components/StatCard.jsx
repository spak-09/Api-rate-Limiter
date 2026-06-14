export const StatCard = ({ title, value, label, accent }) => {
  return (
    <div className="rounded-[2rem] border border-border bg-[#151B28]/90 p-6 shadow-glow">
      <p className="text-sm uppercase tracking-[0.3em] text-[#8B95AE]">{title}</p>
      <h3 className="mt-4 text-3xl font-semibold text-white">{value}</h3>
      <p className={`mt-3 text-sm ${accent ? "text-success" : "text-[#A3AFC8]"}`}>{label}</p>
    </div>
  );
};
