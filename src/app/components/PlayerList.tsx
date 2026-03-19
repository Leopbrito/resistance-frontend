import { CheckCircle, Crown, Eye, EyeOff, User, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useContext, useState } from "react";
import { AppContext } from "../App";
import { GamePhase, SocketEvent, TeamVoteAction } from "../enums/enums";
import { Player } from "../interfaces/interfaces";
import { socket } from "../web-socket";

export function PlayerList() {
  const { gameState } = useContext(AppContext);
  const [showSpies, setShowSpies] = useState(false);

  const currentRound = () => {
    return gameState.rounds[gameState.currentRoundIndex];
  };

  const handleSelectPlayer = (player: Player) => {
    return () => {
      if (gameState.me?.isLeader) {
        if (!currentRound().selectedTeam.find((p) => p === player.id)) {
          if (currentRound().selectedTeam.length < currentRound().teamSize) {
            socket.emit(SocketEvent.SELECT_MISSION_TEAM, {
              selectedPlayers: [...currentRound().selectedTeam, player.id],
            });
          }
        }
      }
    };
  };

  const handleRemovePlayer = (player: Player) => {
    return () => {
      if (gameState.me?.isLeader) {
        if (currentRound().selectedTeam.find((p) => p === player.id)) {
          socket.emit(SocketEvent.SELECT_MISSION_TEAM, {
            selectedPlayers: currentRound().selectedTeam.filter(
              (p) => p !== player.id,
            ),
          });
        }
      }
    };
  };

  const hasVoted = (player: Player) => {
    return Boolean(currentRound().teamVotes[player.id]);
  };

  const hasApproved = (player: Player) => {
    return Boolean(
      currentRound().teamVotes[player.id] === TeamVoteAction.APPROVE,
    );
  };

  const teamVotesCount = () => {
    return Object.values(currentRound().teamVotes).filter((v) => Boolean(v))
      .length;
  };

  const missionVotesCount = () => {
    return Object.values(currentRound().missionVotes).filter((v) => Boolean(v))
      .length;
  };

	const title = () => {
		if (gameState.phase === GamePhase.TEAM_SELECTION) {
			return `Mission ${gameState.currentRoundIndex + 1} - Team Selection (${currentRound().selectedTeam.length}/${currentRound().teamSize} players)`;
		}
		if (gameState.phase === GamePhase.VOTING) {
			return `Mission ${gameState.currentRoundIndex + 1} - Team Approval (${teamVotesCount()}/${gameState.players.length} players)`;
		}
		if (gameState.phase === GamePhase.MISSION) {
			return `Mission ${gameState.currentRoundIndex + 1} - Mission Votes (${missionVotesCount()}/${currentRound().teamSize} players)`;
		}
		return `Mission ${gameState.currentRoundIndex + 1}`;
	};

  return (
    <>
      {/* Team Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-6 flex-1"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-['Inter'] text-[#9CA3AF] text-sm uppercase tracking-wide">
            {title()}
          </h3>
          <button
            onClick={() => setShowSpies(!showSpies)}
            className="text-[#9CA3AF] hover:text-white transition-colors"
            title={showSpies ? "Hide Spies" : "Show Spies"}
          >
            {showSpies ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="space-y-2">
          {gameState.players.map((player, index) => (
            <motion.div
              key={player.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.01 }}
              className={
                "bg-[#1A1F28] border-2 rounded-lg p-4 flex items-center justify-between " +
                (currentRound().selectedTeam.some((id) => id === player.id)
                  ? "border-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.3)]"
                  : "border-[#6B7280] opacity-50")
              }
              style={{
                cursor: gameState.me?.isLeader ? "pointer" : "default",
              }}
              onClick={
                gameState.me?.isLeader
                  ? currentRound().selectedTeam.some((id) => id === player.id)
                    ? handleRemovePlayer(player)
                    : handleSelectPlayer(player)
                  : () => {}
              }
            >
              <div className="flex items-center gap-3">
                <div
                  className={
                    "w-12 h-12 rounded-full flex items-center justify-center " +
                    (player.role === "SPY" && showSpies
                      ? " bg-gradient-to-br from-[#DC143C] to-[#8B0000]  shadow-[0_0_15px_rgba(220,20,60,0.4)]"
                      : currentRound().selectedTeam.some((id) => id === player.id)
                        ? " bg-gradient-to-br from-[#00D9FF] to-[#0088AA]  shadow-[0_0_15px_rgba(0,217,255,0.4)]"
                        : player.isLeader
                          ? "bg-gradient-to-br from-[#FFD700] to-[yellow]  shadow-[0_0_15px_rgba(0,217,255,0.4)]"
                          : " bg-[#6B7280]")
                  }
                >
                  {player.isLeader && (
                    <Crown className="w-5 h-5 text-[#0B0F14]" />
                  )}
                  {!player.isLeader && (
										<> {
											player.role === "SPY" && showSpies ? 
											(
												<Eye className="w-5 h-5 text-[#0B0F14]" />
											) : 
											(
												<User className="w-5 h-5 text-[#0B0F14]" />
											)
										}
										</>
                  )}
                </div>
                <div>
                  <p className="text-[#FFD700] font-['Inter'] text-sm tracking-wide">
                    {player.isLeader ? "Mission Leader" : ""}
                  </p>
                  <p className="font-['Inter'] text-[#9CA3AF]">
                    {player.name}
                  </p>
                </div>
              </div>
              <div>
                {hasVoted(player) ? (
                  <div>
                    {hasApproved(player) ? (
                      <CheckCircle className="w-6 h-6 text-[#00D9FF]" />
                    ) : (
                      <XCircle className="w-6 h-6 text-[#DC143C]" />
                    )}
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
