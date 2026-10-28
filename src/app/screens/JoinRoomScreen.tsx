import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { GlowButton } from "../components/GlowButton";
import { ParticleBackground } from "../components/ParticleBackground";
import { ROOM_CODE_LENGTH, SocketEvent } from "../enums/enums";
import { RoomAck } from "../interfaces/interfaces";
import { setPlayerId, socket, startNewSession } from "../web-socket";

export function JoinRoomScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isCreateMode = searchParams.get("mode") === "create";

  const [roomCode, setRoomCode] = useState(searchParams.get("roomCode") || "");
  const [username, setUsername] = useState("");

  const handleRoomAck = (response: RoomAck) => {
    // Em falha o servidor já emitiu o erro (toast): sem sessão para gravar nem lobby para abrir
    if (!("playerId" in response)) return;

    setPlayerId(response.playerId);
    navigate("/lobby");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const playerName = username.trim();
    if (!playerName) return;

    startNewSession();
    if (isCreateMode) {
      socket.emit(SocketEvent.CREATE_ROOM, { playerName }, handleRoomAck);
    } else {
      socket.emit(SocketEvent.JOIN_ROOM, { playerName, roomCode }, handleRoomAck);
    }
  };

  return (
    <div className="relative min-h-screen bg-canvas overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 min-h-screen px-6 py-8">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-neutral-light hover:text-resistance transition-colors mb-12"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-body">{t("common.back")}</span>
        </motion.button>

        <div className="flex flex-col items-center pt-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl mb-12 text-center tracking-wider text-white"
          >
            {isCreateMode ? t("join.createTitle") : t("join.joinTitle")}
          </motion.h2>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="w-full max-w-sm space-y-8"
          >
            {/* Username Input */}
            <div className="space-y-3">
              <label
                htmlFor="username"
                className="block font-body text-neutral-light text-sm tracking-wide uppercase"
              >
                {t("join.username")}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("join.usernamePlaceholder")}
                className="w-full px-5 py-4 bg-surface border-2 border-neutral rounded-lg
                  text-white font-body placeholder-neutral
                  focus:border-resistance focus:outline-none focus:shadow-[0_0_20px_rgba(0,217,255,0.3)]
                  transition-all duration-300"
              />
            </div>

            {/* Room Code Input (only for join mode) */}
            {!isCreateMode && (
              <div className="space-y-3">
                <label
                  htmlFor="roomCode"
                  className="block font-body text-neutral-light text-sm tracking-wide uppercase"
                >
                  {t("join.roomCode")}
                </label>
                <div className="flex gap-2">
                  <input
                    id="roomCode"
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    placeholder="ABCD-1234"
                    className="w-full px-5 py-4 bg-surface border-2 border-neutral rounded-lg
                  text-white font-body placeholder-neutral
                  focus:border-resistance focus:outline-none focus:shadow-[0_0_20px_rgba(0,217,255,0.3)]
                  transition-all duration-300"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <GlowButton
                type="submit"
                variant="resistance"
                className="w-full"
                disabled={
                  !username.trim() || (!isCreateMode && roomCode.length !== ROOM_CODE_LENGTH)
                }
              >
                {isCreateMode ? t("join.createSubmit") : t("join.joinSubmit")}
              </GlowButton>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
