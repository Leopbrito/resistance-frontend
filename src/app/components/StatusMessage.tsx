import { motion } from "motion/react";
import { ReactNode } from "react";

interface StatusMessageProps {
  message: string;
  // Ações (botões) que acompanham a mensagem
  children?: ReactNode;
}

export function StatusMessage({ message, children }: StatusMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="space-y-3"
    >
      <p className="text-center text-neutral-light text-sm font-body mb-4">{message}</p>
      {children}
    </motion.div>
  );
}
