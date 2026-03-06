import { motion } from "motion/react";
import { ReactNode } from "react";

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "resistance" | "spy" | "neutral";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}

export function GlowButton({
  children,
  onClick,
  variant = "resistance",
  className = "",
  disabled = false,
  type = "button",
}: GlowButtonProps) {
  const colors = {
    resistance: {
      bg: "bg-[#00D9FF]",
      shadow: "shadow-[0_0_20px_rgba(0,217,255,0.6),0_0_40px_rgba(0,217,255,0.3)]",
      hoverShadow: "hover:shadow-[0_0_30px_rgba(0,217,255,0.8),0_0_60px_rgba(0,217,255,0.5)]",
    },
    spy: {
      bg: "bg-[#DC143C]",
      shadow: "shadow-[0_0_20px_rgba(220,20,60,0.6),0_0_40px_rgba(220,20,60,0.3)]",
      hoverShadow: "hover:shadow-[0_0_30px_rgba(220,20,60,0.8),0_0_60px_rgba(220,20,60,0.5)]",
    },
    neutral: {
      bg: "bg-[#6B7280]",
      shadow: "shadow-[0_0_15px_rgba(107,114,128,0.4)]",
      hoverShadow: "hover:shadow-[0_0_25px_rgba(107,114,128,0.6)]",
    },
  };

  const colorScheme = colors[variant];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`
        px-8 py-4 rounded-lg 
        ${colorScheme.bg} 
        ${colorScheme.shadow} 
        ${colorScheme.hoverShadow}
        text-[#0B0F14] font-['Orbitron'] uppercase tracking-wider
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}