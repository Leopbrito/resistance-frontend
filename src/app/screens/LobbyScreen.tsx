import { useTranslation } from "react-i18next";
import { Check, Clock, Copy, Crown, User, QrCode } from "lucide-react";
import { motion } from "motion/react";
import { useContext, useState } from "react";
import { AppContext } from "../app-context";
import { GlowButton } from "../components/GlowButton";
import { LogoutButton } from "../components/LogoutButton";
import { ParticleBackground } from "../components/ParticleBackground";
import { socket } from "../web-socket";
import { SocketEvent } from "../enums/enums";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

export function LobbyScreen() {
  const { t } = useTranslation();
  const { gameState } = useContext(AppContext);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (gameState?.me?.roomCode) {
      const link = `${window.location.origin}/join?roomCode=${gameState.me.roomCode}`;
      navigator.clipboard.writeText(link).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleStartGame = () => {
    socket.emit(SocketEvent.START_GAME, {}, () => {
      console.log("Jogo iniciado");
    });
  };

  console.log("Lobby: ", gameState);
  return (
    <>
      {gameState && (
        <div className="relative min-h-screen bg-canvas overflow-hidden">
          <ParticleBackground />

          <div className="relative z-10 min-h-screen px-6 py-8 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start mb-8 relative">
              <LogoutButton />

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center w-full"
              >
                <h2 className="font-display text-2xl mb-2 text-white tracking-wider">
                  {t("lobby.waitingRoom")}
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-neutral-light text-sm font-body">
                    {t("lobby.roomCode")}
                  </span>
                  <div
                    className="flex items-center gap-2 cursor-pointer group px-3 py-1 bg-surface rounded-md border border-neutral hover:border-resistance transition-colors"
                    onClick={handleCopyLink}
                    title={t("lobby.copyInvite")}
                  >
                    <span className="font-display text-resistance tracking-widest text-lg">
                      {gameState.me?.roomCode}
                    </span>
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-neutral-light group-hover:text-resistance transition-colors" />
                    )}
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className="flex items-center justify-center px-3 py-1 bg-surface rounded-md border border-neutral hover:border-resistance transition-colors group"
                        title={t("lobby.showQr")}
                      >
                        <QrCode className="w-5 h-5 text-neutral-light group-hover:text-resistance transition-colors" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-canvas border border-resistance/50 text-white sm:max-w-md shadow-[0_0_15px_rgba(0,217,255,0.2)]">
                      <DialogHeader>
                        <DialogTitle className="font-display text-xl text-center text-resistance tracking-wider">
                          {t("lobby.shareRoom")}
                        </DialogTitle>
                        <DialogDescription className="text-center text-neutral-light font-body">
                          {t("lobby.scanQr")}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex items-center justify-center p-6 bg-white rounded-lg mx-auto w-fit mt-4 mb-2">
                        <QRCodeSVG
                          value={`${window.location.origin}/join?roomCode=${gameState.me?.roomCode}`}
                          size={200}
                          level="H"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </motion.div>
            </div>

            {/* Player List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-1 mb-8 overflow-y-auto"
            >
              <div className="space-y-3 max-w-md mx-auto">
                {gameState.players?.map((player, index) => (
                  <motion.div
                    key={player.socketId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-surface border border-neutral rounded-lg p-4
                  hover:border-resistance hover:shadow-[0_0_15px_rgba(0,217,255,0.2)]
                  transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-resistance to-resistance-dark
                    flex items-center justify-center shadow-[0_0_15px_rgba(0,217,255,0.4)]"
                      >
                        <User className="w-6 h-6 text-canvas" />
                      </div>

                      {/* Name */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-body text-white">{player.name}</span>
                          {player.isHost && <Crown className="w-4 h-4 text-gold" />}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {player.connected ? (
                          <div className="flex items-center gap-1 px-3 py-1 bg-resistance/20 border border-resistance rounded-full">
                            <Check className="w-3 h-3 text-resistance" />
                            <span className="text-xs font-body text-resistance uppercase tracking-wide">
                              {t("lobby.connected")}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-3 py-1 bg-neutral/20 border border-neutral rounded-full">
                            <Clock className="w-3 h-3 text-neutral" />
                            <span className="text-xs font-body text-neutral uppercase tracking-wide">
                              {t("lobby.disconnected")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Player Count */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-6"
            >
              <p className="text-neutral-light font-body text-sm">
                {t("lobby.playerCount", { count: gameState.players?.length ?? 0, max: 10 })}
              </p>
              <p className="text-neutral font-body text-xs mt-1">
                {t("lobby.minPlayers", { min: 5 })}
              </p>
            </motion.div>

            {/* Start Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-md mx-auto w-full"
            >
              {gameState.me?.isHost && (
                <GlowButton
                  variant="resistance"
                  onClick={handleStartGame}
                  className="w-full"
                  disabled={gameState.players?.length < 5}
                >
                  {t("lobby.startGame")}
                </GlowButton>
              )}

              <p className="text-center text-neutral-light text-xs font-body mt-4">
                {t("lobby.onlyHostStarts")}
              </p>
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
}
