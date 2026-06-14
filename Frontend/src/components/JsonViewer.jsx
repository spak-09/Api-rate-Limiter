import { useState } from "react";

export const JsonViewer = ({ data, collapsedByDefault = true }) => {
  const [collapsed, setCollapsed] = useState(collapsedByDefault);

  const toggle = () => setCollapsed((c) => !c);

  const preview = () => {
    try {
      if (data === null || data === undefined) return "(no response)";
      if (typeof data === "string") return data.length > 200 ? data.slice(0, 200) + "..." : data;
      const s = JSON.stringify(data, null, 2);
      return s.length > 400 ? s.slice(0, 400) + "..." : s;
    } catch (e) {
      return String(data);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={toggle}
          className="text-sm text-accent hover:underline"
        >
          {collapsed ? "Show response" : "Hide response"}
        </button>
      </div>

      <div className="mt-2">
        {collapsed ? (
          <pre className="max-h-28 overflow-auto whitespace-pre-wrap rounded-md bg-[#0F1317] p-3 text-xs">{preview()}</pre>
        ) : (
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-md bg-[#0F1317] p-3 text-xs">{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
    </div>
  );
};

export default JsonViewer;
