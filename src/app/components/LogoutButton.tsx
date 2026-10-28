import { LogOut } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { clearPlayerId } from "../web-socket";

export function LogoutButton() {
  const { t } = useTranslation();

  const handleLogout = () => {
    clearPlayerId();
    window.location.href = "/";
  };

  return (
    <motion.button
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={handleLogout}
      className="absolute right-0 top-0 flex items-center justify-center p-2 bg-spy/10 border border-spy/50 rounded-lg text-spy hover:bg-spy/20 hover:border-spy transition-all shadow-[0_0_10px_rgba(220,20,60,0.1)] hover:shadow-[0_0_15px_rgba(220,20,60,0.3)] z-50"
      title={t("common.logout")}
    >
      <LogOut className="w-5 h-5" />
    </motion.button>
  );
}
