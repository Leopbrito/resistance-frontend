import { useTranslation } from "react-i18next";
import { CheckCircle, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../App";
import { GlowButton } from "../components/GlowButton";
import { AckScreen, GamePhase, MissionVoteAction, RoundStatus, SocketEvent } from "../enums/enums";
import { ackScreen, socket } from "../web-socket";

export function MissionResultScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { gameState } = useContext(AppContext);
  // Fixa o round do resultado: o estado muda (ack, próxima rodada) enquanto a tela está montada
  const [resultRoundIndex] = useState(
    () =>
      gameState.me?.pendingMissionResult ??
      (gameState.phase === GamePhase.FINISHED
        ? gameState.currentRoundIndex
        : gameState.currentRoundIndex - 1),
  );
  const resultRound = gameState.rounds[resultRoundIndex];
  const [results, setResults] = useState<any[]>(
    resultRound.missionVoteResult
      .map((result) => ({
        status: result,
        flipped: !!resultRound.resultRevealed,
      }))
      .sort((a) => (a.status === MissionVoteAction.SUCCESS ? -1 : 1)),
  );

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    const onRevealMissionResult = () => {
      results.forEach((_, index) => {
        timers.push(
          setTimeout(() => {
            setResults((prev) =>
              prev.map((r, i) => ({
                ...r,
                flipped: i <= index,
              })),
            );
          }, 700 * index),
        );
      });
    };

    socket.on(SocketEvent.REVEAL_MISSION_RESULT, onRevealMissionResult);

    return () => {
      socket.off(SocketEvent.REVEAL_MISSION_RESULT, onRevealMissionResult);
      timers.forEach(clearTimeout);
    };
  }, []);

  const handleRevealResults = () => {
    socket.emit(SocketEvent.SUBMIT_MISSION_RESULT_REVEAL);
  };

  const handleContinueButton = () => {
    ackScreen(AckScreen.MISSION_RESULT);
    if (gameState.phase === GamePhase.FINISHED) {
      navigate("/game-end");
    } else {
      navigate("/mission-voting");
    }
  };

  const isResistanceWin = () => {
    return (
      !results.every((result) => result.flipped) ||
      resultRound.status === RoundStatus.MISSION_SUCCESS
    );
  };

  return (
    <div className="relative min-h-screen bg-canvas overflow-hidden">
      {/* Dynamic background based on result */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        className="absolute inset-0"
        style={{
          background: isResistanceWin()
            ? "radial-gradient(circle at center, var(--color-resistance) 0%, transparent 70%)"
            : "radial-gradient(circle at center, var(--color-spy) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 min-h-screen px-6 py-8 flex flex-col items-center justify-between">
        {/* Mission Progress Tracker */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl mb-12 text-center tracking-wider text-white"
        >
          {t("result.title")}
        </motion.h2>
        {/* <MissionTracker/> */}

        {/* Card Flip Result */}
        <div className="flex-1 flex flex-wrap gap-4 items-center justify-center">
          {results.map((result) => (
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
                  className="absolute inset-0 rounded-2xl bg-surface border-2 border-neutral
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
                    className="w-24 h-24 rounded-full border-2 border-resistance 
                  flex items-center justify-center"
                  >
                    <span className="text-4xl font-display text-resistance">?</span>
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
                        ? "linear-gradient(135deg, var(--color-surface) 0%, color-mix(in srgb, var(--color-resistance) 12.5%, transparent) 100%)"
                        : "linear-gradient(135deg, var(--color-surface) 0%, color-mix(in srgb, var(--color-spy) 12.5%, transparent) 100%)",
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor:
                      result.status === MissionVoteAction.SUCCESS
                        ? "var(--color-resistance)"
                        : "var(--color-spy)",
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
                        style={{ color: "var(--color-resistance)" }}
                        strokeWidth={2}
                      />
                    ) : (
                      <XCircle
                        className="w-16 h-16 mb-6"
                        style={{ color: "var(--color-spy)" }}
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
                    className="font-display tracking-wider"
                    style={{
                      color:
                        result.status === MissionVoteAction.SUCCESS
                          ? "var(--color-resistance)"
                          : "var(--color-spy)",
                      textShadow:
                        result.status === MissionVoteAction.SUCCESS
                          ? "0 0 20px rgba(0,217,255,0.6)"
                          : "0 0 20px rgba(220,20,60,0.6)",
                    }}
                  >
                    {result.status === MissionVoteAction.SUCCESS
                      ? t("result.success")
                      : t("result.failed")}
                  </motion.h3>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {!results.every((result) => result.flipped) ? (
          <>
            {gameState.me?.id === resultRound.leaderId ? (
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
                  {t("result.reveal")}
                </GlowButton>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <p className="text-center text-neutral-light text-sm font-body mb-4">
                  {t("result.awaitingReveal")}
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
              {t("common.continue")}
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
              className="absolute w-2 h-2 rounded-full bg-resistance"
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
          className="absolute inset-0 bg-spy mix-blend-screen pointer-events-none"
        />
      )}
    </div>
  );
}
