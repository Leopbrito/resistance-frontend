import { motion } from "motion/react";
import { ReactNode } from "react";

interface GlitchTextProps {
  children: ReactNode;
  className?: string;
}

export function GlitchText({ children, className = "" }: GlitchTextProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      
      <motion.span
        animate={{
          opacity: [0, 0.7, 0],
          x: [-5, 5, -5],
        }}
        transition={{
          duration: 0.15,
          repeat: Infinity,
          repeatDelay: 3,
        }}
        className="absolute inset-0 text-[#00D9FF] opacity-0"
        style={{ mixBlendMode: "screen" }}
      >
        {children}
      </motion.span>
      
      <motion.span
        animate={{
          opacity: [0, 0.7, 0],
          x: [5, -5, 5],
        }}
        transition={{
          duration: 0.15,
          repeat: Infinity,
          repeatDelay: 4,
        }}
        className="absolute inset-0 text-[#DC143C] opacity-0"
        style={{ mixBlendMode: "screen" }}
      >
        {children}
      </motion.span>
    </div>
  );
}
