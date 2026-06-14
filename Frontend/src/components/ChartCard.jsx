import { ResponsiveContainer, AreaChart, Area, Tooltip, PieChart, Pie, Cell } from "recharts";

export const ChartCard = ({ title, data, type }) => {
  return (
    <div className="rounded-[2rem] border border-border bg-[#151B28]/90 p-6 shadow-glow">
      <div className="flex items-center justify-between">
        <p className="text-sm uppercase tracking-[0.3em] text-[#8B95AE]">{title}</p>
      </div>
      <div className="mt-5 h-72">
        {type === "area" ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, left: -10, right: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <Tooltip contentStyle={{ background: "#11151F", border: "1px solid #2A2F3A", color: "#D6DCE5" }} />
              <Area type="monotone" dataKey="value" stroke="#6366F1" fill="url(#colorArea)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={4}>
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={index % 2 === 0 ? "#6366F1" : "#10B981"} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
