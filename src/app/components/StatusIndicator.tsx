import { motion } from "motion/react";

interface StatusIndicatorProps {
  active?: boolean;
  color?: "resistance" | "spy" | "neutral";
  size?: "sm" | "md" | "lg";
}

export function StatusIndicator({
  active = false,
  color = "resistance",
  size = "md",
}: StatusIndicatorProps) {
  const colors = {
    resistance: "#00D9FF",
    spy: "#DC143C",
    neutral: "#6B7280",
  };

  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const selectedColor = colors[color];
  const selectedSize = sizes[size];

  return (
    <div className="relative inline-flex items-center justify-center">
      {active && (
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute ${selectedSize} rounded-full`}
          style={{ backgroundColor: selectedColor }}
        />
      )}
      <div
        className={`relative ${selectedSize} rounded-full`}
        style={{
          backgroundColor: selectedColor,
          boxShadow: active ? `0 0 10px ${selectedColor}` : "none",
        }}
      />
    </div>
  );
}
