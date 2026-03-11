import { Check, Clock, Crown, User } from "lucide-react";
import { motion } from "motion/react";
import { useContext } from "react";
import { AppContext } from "../App";
import { GlowButton } from "../components/GlowButton";
import { ParticleBackground } from "../components/ParticleBackground";
import { socket } from "../web-socket";
import { SocketEvent } from "../enums/enums";

export function LobbyScreen() {
  const { gameState } = useContext(AppContext);

  const handleStartGame = () => {
    socket.emit(SocketEvent.START_GAME, {}, () => {
      console.log("Jogo iniciado");
    });
  };

  console.log("Lobby: ", gameState);
  return (
    <>
      {gameState && (
        <div className="relative min-h-screen bg-[#0B0F14] overflow-hidden">
          <ParticleBackground />

          <div className="relative z-10 min-h-screen px-6 py-8 flex flex-col">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h2 className="font-['Orbitron'] text-2xl mb-2 text-white tracking-wider">
                WAITING ROOM
              </h2>
              <div className="flex items-center justify-center gap-2">
                <span className="text-[#9CA3AF] text-sm font-['Inter']">
                  Room Code:
                </span>
                <span className="font-['Orbitron'] text-[#00D9FF] tracking-widest">
                  {gameState.me?.roomCode}
                </span>
              </div>
            </motion.div>

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
                    className="bg-[#1A1F28] border border-[#6B7280] rounded-lg p-4
                  hover:border-[#00D9FF] hover:shadow-[0_0_15px_rgba(0,217,255,0.2)]
                  transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#0088AA]
                    flex items-center justify-center shadow-[0_0_15px_rgba(0,217,255,0.4)]"
                      >
                        <User className="w-6 h-6 text-[#0B0F14]" />
                      </div>

                      {/* Name */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-['Inter'] text-white">
                            {player.name}
                          </span>
                          {player.isHost && (
                            <Crown className="w-4 h-4 text-[#FFD700]" />
                          )}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {player.connected ? (
                          <div className="flex items-center gap-1 px-3 py-1 bg-[#00D9FF]/20 border border-[#00D9FF] rounded-full">
                            <Check className="w-3 h-3 text-[#00D9FF]" />
                            <span className="text-xs font-['Inter'] text-[#00D9FF] uppercase tracking-wide">
                              Connected
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-3 py-1 bg-[#6B7280]/20 border border-[#6B7280] rounded-full">
                            <Clock className="w-3 h-3 text-[#6B7280]" />
                            <span className="text-xs font-['Inter'] text-[#6B7280] uppercase tracking-wide">
                              Disconnected
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
              <p className="text-[#9CA3AF] font-['Inter'] text-sm">
                {gameState.players?.length} / 10 Players
              </p>
              <p className="text-[#6B7280] font-['Inter'] text-xs mt-1">
                Minimum 5 players required
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
                  Start Game
                </GlowButton>
              )}

              <p className="text-center text-[#9CA3AF] text-xs font-['Inter'] mt-4">
                Only the host can start the game
              </p>
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
}
