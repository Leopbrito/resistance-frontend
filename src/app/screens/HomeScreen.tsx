import { useTranslation } from "react-i18next";
import { Shield } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { GlitchText } from "../components/GlitchText";
import { GlowButton } from "../components/GlowButton";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { ParticleBackground } from "../components/ParticleBackground";
import { APP_VERSION } from "../version";

export function HomeScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    navigate("/join?mode=create");
  };

  const handleJoinRoom = () => {
    navigate("/join");
  };

  return (
    <div className="relative min-h-screen bg-canvas overflow-hidden">
      <ParticleBackground />
      <LanguageSwitcher />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-resistance opacity-30 rounded-full" />
            <Shield className="relative w-24 h-24 text-resistance" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-display text-5xl mb-2 text-center tracking-wider"
          style={{
            background: "linear-gradient(to bottom, white, var(--color-resistance))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "0 0 2.5px rgba(0, 217, 255, 0.5)",
          }}
        >
          <GlitchText>{t("home.title")}</GlitchText>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-body text-neutral-light text-sm mb-16 tracking-widest uppercase"
        >
          {t("home.tagline")}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col gap-4 w-full max-w-xs"
        >
          <GlowButton variant="resistance" onClick={handleCreateRoom}>
            {t("home.createRoom")}
          </GlowButton>

          <GlowButton variant="neutral" onClick={handleJoinRoom}>
            {t("home.joinRoom")}
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
          className="absolute top-20 left-10 w-32 h-32 border border-resistance opacity-10 pointer-events-none"
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
          className="absolute bottom-32 right-10 w-24 h-24 border border-spy opacity-10 pointer-events-none"
          style={{
            transform: "rotate(25deg)",
          }}
        />

        {/* Versão do frontend; acima da barra do Safari iOS */}
        <p className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] font-body text-xs text-neutral tracking-widest pointer-events-none">
          v{APP_VERSION}
        </p>
      </div>
    </div>
  );
}
