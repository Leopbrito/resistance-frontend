import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { GlowButton } from "../components/GlowButton";
import { Shield, Eye } from "lucide-react";
import { useContext, useState } from "react";
import { AppContext } from "../App";
import { AckScreen, Role } from "../enums/enums";
import { ackScreen } from "../web-socket";

export function RoleRevealScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { gameState } = useContext(AppContext);
  const [showRole, setShowRole] = useState(false);

  const isSpy = gameState.me?.role === Role.SPY;

  const handleReveal = () => {
    setShowRole(true);
  };

  if (!showRole) {
    return (
      <div className="relative min-h-screen bg-canvas overflow-hidden flex items-center justify-center px-6">
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
            className="w-32 h-32 mx-auto mb-8 rounded-full bg-surface border-2 border-resistance 
              flex items-center justify-center"
          >
            <div className="text-4xl">?</div>
          </motion.div>

          <h2 className="font-display text-2xl mb-6 text-white tracking-wider">
            {t("roles.assignmentAwaits")}
          </h2>

          <GlowButton variant="resistance" onClick={handleReveal}>
            {t("roles.reveal")}
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
            ? "radial-gradient(circle at center, var(--color-spy-deep) 0%, var(--color-canvas) 70%)"
            : "radial-gradient(circle at center, var(--color-resistance-deep) 0%, var(--color-canvas) 70%)",
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
            className="absolute inset-0 bg-spy mix-blend-screen"
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
          className="absolute w-64 h-64 rounded-full bg-resistance blur-3xl"
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
                background: isSpy ? "var(--color-spy)" : "var(--color-resistance)",
              }}
            />
            {isSpy ? (
              <Eye
                className="relative w-32 h-32"
                style={{ color: "var(--color-spy)" }}
                strokeWidth={1.5}
              />
            ) : (
              <Shield
                className="relative w-32 h-32"
                style={{ color: "var(--color-resistance)" }}
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
          <p className="font-body text-white text-sm font-bold uppercase tracking-widest mb-2">
            {t("roles.yourRole")}
          </p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: "spring" }}
            className="font-display text-6xl mb-4 tracking-wider"
            style={{
              color: isSpy ? "var(--color-spy)" : "var(--color-resistance)",
              textShadow: isSpy
                ? "0 0 30px rgba(220, 20, 60, 0.8), 0 0 60px rgba(220, 20, 60, 0.4)"
                : "0 0 30px rgba(0, 217, 255, 0.8), 0 0 60px rgba(0, 217, 255, 0.4)",
            }}
          >
            {t(`roles.${isSpy ? Role.SPY : Role.RESISTANCE}.name`)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className={`font-body text-white text-sm max-w-md mx-auto leading-relaxed ${
              isSpy &&
              gameState.players.filter((p) => p.role === Role.SPY && p.id !== gameState.me?.id)
                .length > 0
                ? "mb-6"
                : "mb-12"
            }`}
          >
            {t(`roles.${isSpy ? Role.SPY : Role.RESISTANCE}.description`)}
          </motion.p>

          {isSpy &&
            gameState.players.filter((p) => p.role === Role.SPY && p.id !== gameState.me?.id)
              .length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="mb-12"
              >
                <p className="font-body text-spy text-xs font-bold uppercase tracking-widest mb-3">
                  {t("roles.fellowSpies")}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {gameState.players
                    .filter((p) => p.role === Role.SPY && p.id !== gameState.me?.id)
                    .map((spy) => (
                      <span
                        key={spy.id}
                        className="text-spy-light font-bold text-sm font-body bg-spy-dark/40 px-4 py-1.5 rounded-full border border-spy shadow-[0_0_15px_rgba(220,20,60,0.3)]"
                      >
                        {spy.name}
                      </span>
                    ))}
                </div>
              </motion.div>
            )}
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <GlowButton
            variant={isSpy ? "spy" : "resistance"}
            onClick={() => {
              ackScreen(AckScreen.ROLES);
              navigate("/mission-voting");
            }}
          >
            {t("common.continue")}
          </GlowButton>
        </motion.div>
      </div>
    </div>
  );
}
