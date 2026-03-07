import { Shield } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { GlitchText } from "../components/GlitchText";
import { GlowButton } from "../components/GlowButton";
import { ParticleBackground } from "../components/ParticleBackground";

export function HomeScreen() {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    navigate("/join?mode=create");
  };

  const handleJoinRoom = () => {
    navigate("/join");
  };

  return (
    <div className="relative min-h-screen bg-[#0B0F14] overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-[#00D9FF] opacity-30 rounded-full" />
            <Shield
              className="relative w-24 h-24 text-[#00D9FF]"
              strokeWidth={1.5}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-['Orbitron'] text-5xl mb-2 text-center tracking-wider"
          style={{
            background: "linear-gradient(to bottom, #FFFFFF, #00D9FF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "0 0 40px rgba(0, 217, 255, 0.3)",
          }}
        >
          <GlitchText>THE RESISTANCE</GlitchText>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-['Inter'] text-[#9CA3AF] text-sm mb-16 tracking-widest uppercase"
        >
          Trust No One
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col gap-4 w-full max-w-xs"
        >
          <GlowButton variant="resistance" onClick={handleCreateRoom}>
            Create Room
          </GlowButton>

          <GlowButton variant="neutral" onClick={handleJoinRoom}>
            Join Room
          </GlowButton>
        </motion.div>

        {/* Glitch effect decoration */}
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
            x: [0, 2, -2, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-32 h-32 border border-[#00D9FF] opacity-10 pointer-events-none"
          style={{
            transform: "rotate(45deg)",
          }}
        />

        <motion.div
          animate={{
            opacity: [0.1, 0.2, 0.1],
            x: [0, -2, 2, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-32 right-10 w-24 h-24 border border-[#DC143C] opacity-10 pointer-events-none"
          style={{
            transform: "rotate(25deg)",
          }}
        />
      </div>
    </div>
  );
}
