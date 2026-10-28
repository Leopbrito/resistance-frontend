import { useTranslation } from "react-i18next";
import { Circle, Eye, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useContext } from "react";
import { AppContext } from "../App";

export function MissionTracker({ hideTitle = false }: { hideTitle?: boolean }) {
  const { t } = useTranslation();
  const { gameState } = useContext(AppContext);

  while (gameState.rounds.length < 5) {
    gameState.rounds.push({} as any);
  }

  return (
    <>
      {/* Mission Progress Tracker */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full mb-6"
      >
        {!hideTitle && (
          <h3 className="text-center font-body text-neutral-light text-sm uppercase tracking-wide mb-4">
            {t("tracker.title")}
          </h3>
        )}
        <div className="flex justify-center gap-3">
          {gameState.rounds
            .map((m) => {
              return {
                completed: m.status === "MISSION_SUCCESS" || m.status === "MISSION_FAILED",
                success: m.status === "MISSION_SUCCESS",
              };
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
                      className="w-12 h-12 rounded-full border-2 border-resistance 
                      bg-resistance/20 flex items-center justify-center
                      shadow-[0_0_15px_rgba(0,217,255,0.4)]"
                    >
                      <Shield className="w-6 h-6 text-resistance" />
                    </div>
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full border-2 border-spy 
                      bg-spy/20 flex items-center justify-center
                      shadow-[0_0_15px_rgba(220,20,60,0.4)]"
                    >
                      <Eye className="w-6 h-6 text-spy" />
                    </div>
                  )
                ) : (
                  <div
                    className="w-12 h-12 rounded-full border-2 border-neutral 
                    bg-surface flex items-center justify-center"
                  >
                    <Circle className="w-6 h-6 text-neutral" />
                  </div>
                )}
              </motion.div>
            ))}
        </div>
      </motion.div>
    </>
  );
}
