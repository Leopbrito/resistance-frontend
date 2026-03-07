import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { GlowButton } from "../components/GlowButton";
import { CheckCircle, XCircle, Circle } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../App";
import { GamePhase } from "../enums/enums";

export function MissionResultScreen() {
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState(false);
  const { gameState } = useContext(AppContext);
  
  while(gameState.rounds.length < 5) {
    gameState.rounds.push({} as any)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setFlipped(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleContinueButton = () => {
    if (gameState.phase === GamePhase.FINISHED) {
      navigate("/lobby")
    } else {
      navigate("/mission-voting")
    }
  }

  return (
    <div className="relative min-h-screen bg-[#0B0F14] overflow-hidden">
      {/* Dynamic background based on result */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        className="absolute inset-0"
        style={{
          background: gameState.rounds[gameState.currentRoundIndex -1].status === "MISSION_SUCCESS"
            ? "radial-gradient(circle at center, #00D9FF 0%, transparent 70%)"
            : "radial-gradient(circle at center, #DC143C 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 min-h-screen px-6 py-8 flex flex-col items-center justify-between">
        {/* Mission Progress Tracker */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <h3 className="text-center font-['Inter'] text-[#9CA3AF] text-sm uppercase tracking-wide mb-4">
            Mission Progress
          </h3>
          <div className="flex justify-center gap-3">
            {gameState.rounds
            .map(m => {
              return {
                 completed: m.status === 'MISSION_SUCCESS' || m.status === 'MISSION_FAILED', 
                 success: m.status === 'MISSION_SUCCESS' 
              }
            })
            .map((mission, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 * index, type: "spring" }}
              >
                {mission.completed ? (
                  mission.success ? (
                    <div
                      className="w-12 h-12 rounded-full border-2 border-[#00D9FF] 
                      bg-[#00D9FF]/20 flex items-center justify-center
                      shadow-[0_0_15px_rgba(0,217,255,0.4)]"
                    >
                      <CheckCircle className="w-6 h-6 text-[#00D9FF]" />
                    </div>
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full border-2 border-[#DC143C] 
                      bg-[#DC143C]/20 flex items-center justify-center
                      shadow-[0_0_15px_rgba(220,20,60,0.4)]"
                    >
                      <XCircle className="w-6 h-6 text-[#DC143C]" />
                    </div>
                  )
                ) : (
                  <div
                    className="w-12 h-12 rounded-full border-2 border-[#6B7280] 
                    bg-[#1A1F28] flex items-center justify-center"
                  >
                    <Circle className="w-6 h-6 text-[#6B7280]" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Card Flip Result */}
        <div className="flex-1 flex items-center justify-center">
          <div className="perspective-1000">
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{
                transformStyle: "preserve-3d",
              }}
              className="relative w-72 h-96"
            >
              {/* Card Back */}
              <div
                className="absolute inset-0 rounded-2xl bg-[#1A1F28] border-2 border-[#6B7280]
                flex items-center justify-center shadow-2xl"
                style={{
                  backfaceVisibility: "hidden",
                }}
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
                  className="w-24 h-24 rounded-full border-2 border-[#00D9FF] 
                  flex items-center justify-center"
                >
                  <span className="text-4xl font-['Orbitron'] text-[#00D9FF]">
                    ?
                  </span>
                </motion.div>
              </div>

              {/* Card Front */}
              <div
                className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center shadow-2xl"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: gameState.rounds[gameState.currentRoundIndex -1].status === "MISSION_SUCCESS"
                    ? "linear-gradient(135deg, #1A1F28 0%, #00D9FF20 100%)"
                    : "linear-gradient(135deg, #1A1F28 0%, #DC143C20 100%)",
                  borderWidth: "2px",
                  borderStyle: "solid",
                  borderColor: gameState.rounds[gameState.currentRoundIndex -1].status === "MISSION_SUCCESS" ? "#00D9FF" : "#DC143C",
                  boxShadow: gameState.rounds[gameState.currentRoundIndex -1].status === "MISSION_SUCCESS"
                    ? "0 0 40px rgba(0,217,255,0.5)"
                    : "0 0 40px rgba(220,20,60,0.5)",
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: flipped ? 1 : 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  {gameState.rounds[gameState.currentRoundIndex -1].status === "MISSION_SUCCESS" ? (
                    <CheckCircle
                      className="w-24 h-24 mb-6"
                      style={{ color: "#00D9FF" }}
                      strokeWidth={2}
                    />
                  ) : (
                    <XCircle
                      className="w-24 h-24 mb-6"
                      style={{ color: "#DC143C" }}
                      strokeWidth={2}
                    />
                  )}
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: flipped ? 1 : 0, y: flipped ? 0 : 20 }}
                  transition={{ delay: 0.5 }}
                  className="font-['Orbitron'] text-4xl tracking-wider"
                  style={{
                    color: gameState.rounds[gameState.currentRoundIndex -1].status === "MISSION_SUCCESS" ? "#00D9FF" : "#DC143C",
                    textShadow: gameState.rounds[gameState.currentRoundIndex -1].status === "MISSION_SUCCESS"
                      ? "0 0 20px rgba(0,217,255,0.6)"
                      : "0 0 20px rgba(220,20,60,0.6)",
                  }}
                >
                  {gameState.rounds[gameState.currentRoundIndex -1].status === "MISSION_SUCCESS" ? "SUCCESS" : "FAILED"}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: flipped ? 1 : 0 }}
                  transition={{ delay: 0.7 }}
                  className="font-['Inter'] text-[#9CA3AF] text-sm mt-4 px-8 text-center"
                >
                  {gameState.rounds[gameState.currentRoundIndex -1].status === "MISSION_SUCCESS"
                    ? "The mission was completed successfully"
                    : "The mission has been sabotaged"}
                </motion.p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="w-full max-w-md"
        >
          <GlowButton
            variant={gameState.rounds[gameState.currentRoundIndex -1].status === "MISSION_SUCCESS" ? "resistance" : "spy"}
            onClick={handleContinueButton}
            className="w-full"
          >
            Continue
          </GlowButton>

          <p className="text-center text-[#9CA3AF] text-xs font-['Inter'] mt-4">
            {gameState.rounds[gameState.currentRoundIndex -1].status === "MISSION_SUCCESS" ? "Resistance" : "Spies"}: 1 point
          </p>
        </motion.div>
      </div>

      {/* Particle effects based on result */}
      {gameState.rounds[gameState.currentRoundIndex -1].status === "MISSION_SUCCESS" ? (
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
