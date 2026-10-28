import { motion } from "motion/react";
import { useState } from "react";

const PARTICLE_COUNT = 20;

// Destino sorteado uma vez por montagem: sortear no render faria as partículas saltarem a cada re-render
const randomTarget = () => ({
  x: `${50 + (Math.random() - 0.5) * 100}vw`,
  y: `${50 + (Math.random() - 0.5) * 100}vh`,
});

export function ConfettiBurst() {
  const [targets] = useState(() => Array.from({ length: PARTICLE_COUNT }, randomTarget));

  return (
    <>
      {targets.map((target, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            scale: 0,
            x: "50vw",
            y: "50vh",
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: target.x,
            y: target.y,
          }}
          transition={{
            duration: 2,
            delay: 1 + i * 0.05,
            ease: "easeOut",
          }}
          className="absolute w-2 h-2 rounded-full bg-resistance"
          style={{
            boxShadow: "0 0 10px rgba(0,217,255,0.8)",
          }}
        />
      ))}
    </>
  );
}
