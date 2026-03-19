import { Eye, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../App";
import { GlowButton } from "../components/GlowButton";

export function GameEndScreen() {
  const navigate = useNavigate();
  const { gameState } = useContext(AppContext);
  const [results, setResults] = useState<any[]>(
    gameState.players?.map((player) => ({
      player,
      flipped: false,
    })) || []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (results.length > 0) {
        results.forEach((result, index) => {
          setTimeout(() => {
            setResults((prev) =>
              prev.map((r, i) => ({
                ...r,
                flipped: i <= index,
              }))
            );
          }, 700 * index);
        });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleContinueButton = () => {
    navigate("/lobby");
  };

  const isResistanceWin = () => {
    return gameState.spyWins < 3;
  };

  return (
    <div className="relative min-h-screen bg-[#0B0F14] overflow-hidden">
      {/* Dynamic background based on result */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        className="absolute inset-0"
        style={{
          background: isResistanceWin()
            ? "radial-gradient(circle at center, #00D9FF 0%, transparent 70%)"
            : "radial-gradient(circle at center, #DC143C 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 min-h-screen px-6 py-8 flex flex-col items-center justify-between">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-['Orbitron'] text-3xl mb-12 text-center tracking-wider text-white"
        >
          {isResistanceWin() ? "RESISTANCE WINS" : "SPIES WIN"}
        </motion.h2>

        {/* Card Flip Result */}
        <div className="flex-1 flex flex-wrap gap-4 items-center justify-center">
          {results.map((result, index) => (
            <div key={result.player.id} className="perspective-1000">
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: result.flipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{
                  transformStyle: "preserve-3d",
                }}
                className="relative w-32 h-48"
              >
                {/* Card Back - Unknown Role */}
                <div
                  className="absolute inset-0 rounded-2xl bg-[#1A1F28] border-2 border-[#6B7280]
                flex flex-col items-center justify-center shadow-2xl"
                  style={{
                    backfaceVisibility: "hidden",
                  }}
                >
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 10px rgba(107,114,128,0.3)",
                        "0 0 20px rgba(107,114,128,0.6)",
                        "0 0 10px rgba(107,114,128,0.3)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 rounded-full border-2 border-[#6B7280] 
                  flex items-center justify-center mb-4"
                  >
                    <span className="text-2xl font-['Orbitron'] text-[#6B7280]">
                      ?
                    </span>
                  </motion.div>
                  <span className="font-['Inter'] text-sm tracking-wide text-[#9CA3AF] text-center px-1 line-clamp-1">
                    {result.player.name}
                  </span>
                </div>

                {/* Card Front - Revealed Role */}
                <div
                  className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center shadow-2xl overflow-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    background:
                      result.player.role !== "SPY"
                        ? "linear-gradient(135deg, #1A1F28 0%, #00D9FF20 100%)"
                        : "linear-gradient(135deg, #1A1F28 0%, #DC143C20 100%)",
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor:
                      result.player.role !== "SPY"
                        ? "#00D9FF"
                        : "#DC143C",
                    boxShadow:
                      result.player.role !== "SPY"
                        ? "0 0 40px rgba(0,217,255,0.5)"
                        : "0 0 40px rgba(220,20,60,0.5)",
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: result.flipped ? 1 : 0 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    {result.player.role !== "SPY" ? (
                      <Shield
                        className="w-12 h-12 mb-4"
                        style={{ color: "#00D9FF" }}
                        strokeWidth={1.5}
                      />
                    ) : (
                      <Eye
                        className="w-12 h-12 mb-4"
                        style={{ color: "#DC143C" }}
                        strokeWidth={1.5}
                      />
                    )}
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: result.flipped ? 1 : 0,
                      y: result.flipped ? 0 : 10,
                    }}
                    transition={{ delay: 0.5 }}
                    className="font-['Inter'] text-xs uppercase tracking-wider mb-2 text-center"
                    style={{
                      color:
                        result.player.role !== "SPY"
                          ? "#00D9FF"
                          : "#DC143C",
                    }}
                  >
                    {result.player.role !== "SPY" ? "RESISTANCE" : "SPY"}
                  </motion.h3>

                  <span className="font-['Inter'] font-semibold text-sm tracking-wide text-white text-center px-1 line-clamp-1">
                    {result.player.name}
                  </span>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {results.length > 0 && results.every((result) => result.flipped) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-md mt-12"
          >
            <GlowButton
              variant="resistance"
              onClick={handleContinueButton}
              className="w-full"
            >
              Exit to Lobby
            </GlowButton>
          </motion.div>
        )}
      </div>

      {/* Particle effects based on result */}
      {isResistanceWin() ? (
        <>
          {[...Array(20)].map((_, i) => (
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
                x: `${50 + (Math.random() - 0.5) * 100}vw`,
                y: `${50 + (Math.random() - 0.5) * 100}vh`,
              }}
              transition={{
                duration: 2,
                delay: 1 + i * 0.05,
                ease: "easeOut",
              }}
              className="absolute w-2 h-2 rounded-full bg-[#00D9FF]"
              style={{
                boxShadow: "0 0 10px rgba(0,217,255,0.8)",
              }}
            />
          ))}
        </>
      ) : (
        <motion.div
          animate={{
            opacity: [0, 0.1, 0, 0.15, 0],
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="absolute inset-0 bg-[#DC143C] mix-blend-screen pointer-events-none"
        />
      )}
    </div>
  );
}
