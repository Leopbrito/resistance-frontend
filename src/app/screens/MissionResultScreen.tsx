import { CheckCircle, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../App";
import { GlowButton } from "../components/GlowButton";
import { GamePhase, MissionVoteAction, SocketEvent } from "../enums/enums";
import { socket } from "../web-socket";

export function MissionResultScreen() {
  const navigate = useNavigate();
  const { gameState } = useContext(AppContext);
  const [results, setResults] = useState<any[]>(
    gameState.rounds[gameState.currentRoundIndex - 1].missionVoteResult.map(
      (result) => ({
        status: result,
        flipped: false,
      }),
    ).sort((a, b) => a.status === MissionVoteAction.SUCCESS ? -1 : 1)
  );

  socket.on(SocketEvent.REVEAL_MISSION_RESULT, () => {
    results.forEach((result, index) => {
      setTimeout(() => {
        setResults(
          results.map((r, i) => {
            return {
              ...r,
              flipped: i <= index,
            };
          }),
        );
      }, 700 * index);
    });
  });

  const handleRevealResults = () => {
    socket.emit(SocketEvent.SUBMIT_MISSION_RESULT_REVEAL);
  };

  const handleContinueButton = () => {
    if (gameState.phase === GamePhase.FINISHED) {
      navigate("/lobby");
    } else {
      navigate("/mission-voting");
    }
  };

  const isResistanceWin = () => {
    return (
      !results.every((result) => result.flipped) ||
      gameState.rounds[gameState.currentRoundIndex - 1].status ===
        "MISSION_SUCCESS"
    );
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
        {/* Mission Progress Tracker */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-['Orbitron'] text-3xl mb-12 text-center tracking-wider text-white"
        >
          MISSION RESULT
        </motion.h2>
        {/* <MissionTracker/> */}

        {/* Card Flip Result */}
        <div className="flex-1 flex flex-wrap gap-4 items-center justify-center">
          {results.map((result, index) => (
            <div className="perspective-1000">
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: result.flipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{
                  transformStyle: "preserve-3d",
                }}
                className="relative w-32 h-48"
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
                    background:
                      result.status === MissionVoteAction.SUCCESS
                        ? "linear-gradient(135deg, #1A1F28 0%, #00D9FF20 100%)"
                        : "linear-gradient(135deg, #1A1F28 0%, #DC143C20 100%)",
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor:
                      result.status === MissionVoteAction.SUCCESS
                        ? "#00D9FF"
                        : "#DC143C",
                    boxShadow:
                      result.status === MissionVoteAction.SUCCESS
                        ? "0 0 40px rgba(0,217,255,0.5)"
                        : "0 0 40px rgba(220,20,60,0.5)",
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: result.flipped ? 1 : 0 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    {result.status === MissionVoteAction.SUCCESS ? (
                      <CheckCircle
                        className="w-16 h-16 mb-6"
                        style={{ color: "#00D9FF" }}
                        strokeWidth={2}
                      />
                    ) : (
                      <XCircle
                        className="w-16 h-16 mb-6"
                        style={{ color: "#DC143C" }}
                        strokeWidth={2}
                      />
                    )}
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: result.flipped ? 1 : 0,
                      y: result.flipped ? 0 : 20,
                    }}
                    transition={{ delay: 0.5 }}
                    className="font-['Orbitron'] tracking-wider"
                    style={{
                      color:
                        result.status === MissionVoteAction.SUCCESS
                          ? "#00D9FF"
                          : "#DC143C",
                      textShadow:
                        result.status === MissionVoteAction.SUCCESS
                          ? "0 0 20px rgba(0,217,255,0.6)"
                          : "0 0 20px rgba(220,20,60,0.6)",
                    }}
                  >
                    {result.status === MissionVoteAction.SUCCESS
                      ? "SUCCESS"
                      : "FAILED"}
                  </motion.h3>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {!results.every((result) => result.flipped) ? (
          <>
            {gameState.me?.id ===
            gameState.rounds[gameState.currentRoundIndex - 1].leaderId ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-md"
              >
                <GlowButton
                  variant={isResistanceWin() ? "resistance" : "spy"}
                  onClick={handleRevealResults}
                  className="w-full"
                >
                  Reveal Results
                </GlowButton>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <p className="text-center text-[#9CA3AF] text-sm font-['Inter'] mb-4">
                  Awaiting leader to reveal results...
                </p>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-md"
          >
            <GlowButton
              variant={isResistanceWin() ? "resistance" : "spy"}
              onClick={handleContinueButton}
              className="w-full"
            >
              Continue
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
