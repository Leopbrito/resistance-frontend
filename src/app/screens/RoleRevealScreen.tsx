import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { GlowButton } from "../components/GlowButton";
import { Shield, Eye } from "lucide-react";
import { useContext, useState } from "react";
import { AppContext } from "../App";
import { Role } from "../enums/enums";

export function RoleRevealScreen() {
  const navigate = useNavigate();
  const { gameState } = useContext(AppContext);
  const [showRole, setShowRole] = useState(false);

  const isSpy = gameState.me?.role === Role.SPY;

  const handleReveal = () => {
    setShowRole(true);
  };

  if (!showRole) {
    return (
      <div className="relative min-h-screen bg-[#0B0F14] overflow-hidden flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(0,217,255,0.3)",
                "0 0 40px rgba(0,217,255,0.6)",
                "0 0 20px rgba(0,217,255,0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-32 h-32 mx-auto mb-8 rounded-full bg-[#1A1F28] border-2 border-[#00D9FF] 
              flex items-center justify-center"
          >
            <div className="text-4xl">?</div>
          </motion.div>

          <h2 className="font-['Orbitron'] text-2xl mb-6 text-white tracking-wider">
            YOUR ASSIGNMENT AWAITS
          </h2>

          <GlowButton variant="resistance" onClick={handleReveal}>
            Reveal Role
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-6">
      {/* Animated Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0"
        style={{
          background: isSpy
            ? "radial-gradient(circle at center, #940e29 0%, #0B0F14 70%)"
            : "radial-gradient(circle at center, #00b0cf 0%, #0B0F14 70%)",
        }}
      />

      {/* Glitch effect overlay for spy */}
      {isSpy && (
        <>
          <motion.div
            animate={{
              opacity: [0, 0.1, 0, 0.15, 0],
              x: [0, -5, 5, -3, 0],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            className="absolute inset-0 bg-[#DC143C] mix-blend-screen"
          />
          <motion.div
            animate={{
              opacity: [0, 0.2, 0],
            }}
            transition={{
              duration: 0.15,
              repeat: Infinity,
              repeatDelay: 3,
            }}
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(220, 20, 60, 0.1) 2px, rgba(220, 20, 60, 0.1) 4px)",
            }}
          />
        </>
      )}

      {/* Pulse effect for resistance */}
      {!isSpy && (
        <motion.div
          animate={{
            scale: [1, 1.5, 2],
            opacity: [0.3, 0.1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute w-64 h-64 rounded-full bg-[#00D9FF] blur-3xl"
        />
      )}

      <div className="relative z-10 text-center">
        {/* Role Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{
                boxShadow: isSpy
                  ? [
                      "0 0 30px rgba(220, 20, 60, 0.5)",
                      "0 0 60px rgba(220, 20, 60, 0.8)",
                      "0 0 30px rgba(220, 20, 60, 0.5)",
                    ]
                  : [
                      "0 0 30px rgba(0, 217, 255, 0.5)",
                      "0 0 60px rgba(0, 217, 255, 0.8)",
                      "0 0 30px rgba(0, 217, 255, 0.5)",
                    ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 blur-2xl"
              style={{
                background: isSpy ? "#DC143C" : "#00D9FF",
              }}
            />
            {isSpy ? (
              <Eye
                className="relative w-32 h-32"
                style={{ color: "#DC143C" }}
                strokeWidth={1.5}
              />
            ) : (
              <Shield
                className="relative w-32 h-32"
                style={{ color: "#00D9FF" }}
                strokeWidth={1.5}
              />
            )}
          </div>
        </motion.div>

        {/* Role Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="font-['Inter'] text-white text-sm font-bold uppercase tracking-widest mb-2">
            Your Role
          </p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: "spring" }}
            className="font-['Orbitron'] text-6xl mb-4 tracking-wider"
            style={{
              color: isSpy ? "#DC143C" : "#00D9FF",
              textShadow: isSpy
                ? "0 0 30px rgba(220, 20, 60, 0.8), 0 0 60px rgba(220, 20, 60, 0.4)"
                : "0 0 30px rgba(0, 217, 255, 0.8), 0 0 60px rgba(0, 217, 255, 0.4)",
            }}
          >
            {isSpy ? "SPY" : "RESISTANCE"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="font-['Inter'] text-white text-sm max-w-md mx-auto mb-12 leading-relaxed"
          >
            {isSpy
              ? "Infiltrate the resistance. Sabotage their missions without revealing your identity."
              : "Protect the resistance. Identify the spies and complete the missions successfully."}
          </motion.p>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <GlowButton
            variant={isSpy ? "spy" : "resistance"}
            onClick={() => navigate("/mission-voting")}
          >
            Continue
          </GlowButton>
        </motion.div>
      </div>
    </div>
  );
}
