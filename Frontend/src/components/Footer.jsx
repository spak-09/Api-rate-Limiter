import { Link } from "react-router-dom";

const links = [
  { label: "Home", to: "/" },
  { label: "Login", to: "/login" },
  { label: "Register", to: "/register" },
  { label: "GitHub", to: "https://github.com" },
];

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-[#0F1117] py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p className="text-sm text-[#8B95AE]">Api-rate-Limiter </p>
        
      </div>
    </footer>
  );
};
