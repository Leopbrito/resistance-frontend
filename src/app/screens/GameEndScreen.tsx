import { useTranslation } from "react-i18next";
import { Eye, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../app-context";
import { ConfettiBurst } from "../components/ConfettiBurst";
import { GlowButton } from "../components/GlowButton";
import { AckScreen, Role } from "../enums/enums";
import { Player } from "../interfaces/interfaces";
import { ackScreen } from "../web-socket";

interface PlayerResult {
  player: Player;
  flipped: boolean;
}

export function GameEndScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { gameState } = useContext(AppContext);
  const [results, setResults] = useState<PlayerResult[]>(
    gameState.players?.map((player) => ({
      player,
      flipped: false,
    })) || [],
  );

  // O total de jogadores não muda durante a tela; só o flipped
  const playerCount = results.length;

  useEffect(() => {
    if (playerCount === 0) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(
      setTimeout(() => {
        for (let index = 0; index < playerCount; index++) {
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
        }
      }, 1000),
    );
    return () => timers.forEach(clearTimeout);
  }, [playerCount]);

  const handleContinueButton = () => {
    ackScreen(AckScreen.GAME_END);
    navigate("/lobby");
  };

  const isResistanceWin = () => {
    return gameState.spyWins < 3;
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
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl mb-12 text-center tracking-wider text-white"
        >
          {isResistanceWin() ? t("end.resistanceWins") : t("end.spiesWin")}
        </motion.h2>

        {/* Card Flip Result */}
        <div className="flex-1 flex flex-wrap gap-4 items-center justify-center">
          {results.map((result) => (
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
                  className="absolute inset-0 rounded-2xl bg-surface border-2 border-neutral
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
                    className="w-16 h-16 rounded-full border-2 border-neutral 
                  flex items-center justify-center mb-4"
                  >
                    <span className="text-2xl font-display text-neutral">?</span>
                  </motion.div>
                  <span className="font-body text-sm tracking-wide text-neutral-light text-center px-1 line-clamp-1">
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
                      result.player.role !== Role.SPY
                        ? "linear-gradient(135deg, var(--color-surface) 0%, color-mix(in srgb, var(--color-resistance) 12.5%, transparent) 100%)"
                        : "linear-gradient(135deg, var(--color-surface) 0%, color-mix(in srgb, var(--color-spy) 12.5%, transparent) 100%)",
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor:
                      result.player.role !== Role.SPY
                        ? "var(--color-resistance)"
                        : "var(--color-spy)",
                    boxShadow:
                      result.player.role !== Role.SPY
                        ? "0 0 40px rgba(0,217,255,0.5)"
                        : "0 0 40px rgba(220,20,60,0.5)",
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: result.flipped ? 1 : 0 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    {result.player.role !== Role.SPY ? (
                      <Shield
                        className="w-12 h-12 mb-4"
                        style={{ color: "var(--color-resistance)" }}
                        strokeWidth={1.5}
                      />
                    ) : (
                      <Eye
                        className="w-12 h-12 mb-4"
                        style={{ color: "var(--color-spy)" }}
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
                    className="font-body text-xs uppercase tracking-wider mb-2 text-center"
                    style={{
                      color:
                        result.player.role !== Role.SPY
                          ? "var(--color-resistance)"
                          : "var(--color-spy)",
                    }}
                  >
                    {t(
                      `roles.${result.player.role !== Role.SPY ? Role.RESISTANCE : Role.SPY}.name`,
                    )}
                  </motion.h3>

                  <span className="font-body font-semibold text-sm tracking-wide text-white text-center px-1 line-clamp-1">
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
            <GlowButton variant="resistance" onClick={handleContinueButton} className="w-full">
              {t("end.exit")}
            </GlowButton>
          </motion.div>
        )}
      </div>

      {/* Particle effects based on result */}
      {isResistanceWin() ? (
        <>
          <ConfettiBurst />
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
