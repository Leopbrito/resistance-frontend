import { useLocation, useNavigate } from "react-router";
import { Menu } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const routes = [
  { path: "/", label: "Home" },
  { path: "/join", label: "Join Room" },
  { path: "/join?mode=create", label: "Create Room" },
  { path: "/lobby", label: "Lobby" },
  { path: "/role-reveal", label: "Role Reveal" },
  { path: "/mission-voting", label: "Mission Voting" },
  { path: "/mission-result", label: "Mission Result" },
];

export function DevNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Hide in production or when explicitly disabled
  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-[#1A1F28] border border-[#00D9FF] rounded-full
          flex items-center justify-center shadow-[0_0_15px_rgba(0,217,255,0.4)]
          hover:shadow-[0_0_25px_rgba(0,217,255,0.6)] transition-all"
      >
        <Menu className="w-6 h-6 text-[#00D9FF]" />
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-16 right-0 bg-[#1A1F28] border border-[#00D9FF] rounded-lg
            shadow-[0_0_20px_rgba(0,217,255,0.3)] overflow-hidden w-48"
        >
          <div className="p-2 space-y-1">
            <div className="px-3 py-1 text-xs text-[#9CA3AF] font-['Inter'] uppercase tracking-wide">
              Dev Navigation
            </div>
            {routes.map((route) => (
              <button
                key={route.path}
                onClick={() => {
                  navigate(route.path);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded text-sm font-['Inter']
                  transition-colors ${
                    location.pathname + location.search === route.path
                      ? "bg-[#00D9FF] text-[#0B0F14]"
                      : "text-[#9CA3AF] hover:bg-[#242933] hover:text-white"
                  }`}
              >
                {route.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
