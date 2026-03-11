import { CheckCircle, Crown, User } from "lucide-react";
import { motion } from "motion/react";
import { useContext } from "react";
import { AppContext } from "../App";
import { GlowButton } from "../components/GlowButton";
import { ParticleBackground } from "../components/ParticleBackground";
import { MissionVoteAction, TeamVoteAction, SocketEvent } from "../enums/enums";
import { Player } from "../interfaces/interfaces";
import { socket } from "../web-socket";

export function MissionVotingScreen() {
  const { gameState } = useContext(AppContext);

  const leader = gameState.players.find((player) => player.isLeader);

  const handleSelectPlayer = (player: Player) => {
    return () => {
      if (gameState.me?.isLeader) {
        if (
          !gameState.rounds[gameState.currentRoundIndex].selectedTeam.find(
            (p) => p === player.id,
          )
        ) {
          if (
            gameState.rounds[gameState.currentRoundIndex].selectedTeam.length <
            gameState.rounds[gameState.currentRoundIndex].teamSize
          ) {
            socket.emit(SocketEvent.SELECT_MISSION_TEAM, {
              selectedPlayers: [
                ...gameState.rounds[gameState.currentRoundIndex].selectedTeam,
                player.id,
              ],
            });
          }
        }
      }
    };
  };

  const handleRemovePlayer = (player: Player) => {
    return () => {
      if (gameState.me?.isLeader) {
        if (
          gameState.rounds[gameState.currentRoundIndex].selectedTeam.find(
            (p) => p === player.id,
          )
        ) {
          socket.emit(SocketEvent.SELECT_MISSION_TEAM, {
            selectedPlayers: gameState.rounds[
              gameState.currentRoundIndex
            ].selectedTeam.filter((p) => p !== player.id),
          });
        }
      }
    };
  };

  const handleSubmitTeam = () => {
    if (gameState.me?.isLeader) {
      socket.emit(SocketEvent.SUBMIT_SELECTED_MISSION_TEAM, {
        selectedPlayers:
          gameState.rounds[gameState.currentRoundIndex].selectedTeam,
      });
    }
  };

  const handleVoteTeam = (vote: TeamVoteAction) => {
    return () => {
      socket.emit(SocketEvent.VOTE_TEAM_APPROVAL, {
        vote,
      });
    };
  };
  const handleVoteMission = (vote: MissionVoteAction) => {
    return () => {
      socket.emit(SocketEvent.SUBMIT_MISSION_VOTE, {
        vote,
      });
    };
  };

  return (
    <div className="relative min-h-screen bg-[#0B0F14] overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 min-h-screen px-6 py-8 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h2 className="font-['Orbitron'] text-2xl mb-2 text-white tracking-wider">
            MISSION VOTE
          </h2>
          <p className="text-[#9CA3AF] text-sm font-['Inter']">
            Mission #{gameState.currentRoundIndex + 1} - Team Selection
          </p>
        </motion.div>

        {/* Leader Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1A1F28] border border-[#FFD700] rounded-lg p-4 mb-6
            shadow-[0_0_20px_rgba(255,215,0,0.2)]"
        >
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-[#FFD700]" />
            <div>
              <p className="text-[#FFD700] font-['Inter'] text-sm uppercase tracking-wide">
                Mission Leader
              </p>
              <p className="text-white font-['Orbitron']">
                {leader?.name}
                {gameState.me?.isLeader ? " (You)" : ""}{" "}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6 flex-1"
        >
          <h3 className="font-['Inter'] text-[#9CA3AF] text-sm uppercase tracking-wide mb-4">
            Selected Team (
            {gameState.rounds[gameState.currentRoundIndex].selectedTeam.length}/{gameState.rounds[gameState.currentRoundIndex].teamSize} players)
          </h3>

          <div className="space-y-3 mb-8">
            {gameState.players
              .filter((p) =>
                gameState.rounds[gameState.currentRoundIndex].selectedTeam.some(
                  (id) => p.id === id,
                ),
              )
              .map((player, index) => (
                <motion.div
                  key={player.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-[#1A1F28] border-2 border-[#00D9FF] rounded-lg p-4
                  shadow-[0_0_15px_rgba(0,217,255,0.3)]"
                  onClick={handleRemovePlayer(player)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#0088AA]
                    flex items-center justify-center shadow-[0_0_15px_rgba(0,217,255,0.4)]"
                    >
                      <User className="w-6 h-6 text-[#0B0F14]" />
                    </div>
                    <span className="font-['Inter'] text-white flex-1">
                      {player.name}
                      {player.role === "SPY" ? " - Spy" : ""}
                    </span>
                    <CheckCircle className="w-5 h-5 text-[#00D9FF]" />
                  </div>
                </motion.div>
              ))}
          </div>

          <h3 className="font-['Inter'] text-[#6B7280] text-sm uppercase tracking-wide mb-3">
            Not Selected
          </h3>

          <div className="space-y-2">
            {gameState.players
              .filter(
                (p) =>
                  !gameState.rounds[
                    gameState.currentRoundIndex
                  ].selectedTeam.some((id) => p.id === id),
              )
              .map((player, index) => (
                <motion.div
                  key={player.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.01 }}
                  className="bg-[#1A1F28] border border-[#6B7280] rounded-lg p-3 opacity-50"
                  onClick={handleSelectPlayer(player)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full bg-[#6B7280]
                      flex items-center justify-center"
                    >
                      <User className="w-5 h-5 text-[#0B0F14]" />
                    </div>
                    <span className="font-['Inter'] text-[#9CA3AF]">
                      {player.name}
                      {player.role === "SPY" ? " - Spy" : ""}
                    </span>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* Player Message */}
        {gameState.phase === "TEAM_SELECTION" && !gameState.me?.isLeader && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <p className="text-center text-[#9CA3AF] text-sm font-['Inter'] mb-4">
              Awaiting leader selection
            </p>
          </motion.div>
        )}

        {/* Leader Buttons */}
        {gameState.phase === "TEAM_SELECTION" && gameState.me?.isLeader && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <p className="text-center text-[#9CA3AF] text-sm font-['Inter'] mb-4">
              Do you submit this team?
            </p>

            <GlowButton
              variant="resistance"
              onClick={handleSubmitTeam}
              disabled={gameState.rounds[gameState.currentRoundIndex].selectedTeam.length < gameState.rounds[gameState.currentRoundIndex].teamSize}
              className="w-full"
            >
              Submit Team
            </GlowButton>
          </motion.div>
        )}

        {/* Vote Buttons */}
        {gameState.phase === "VOTING" &&
          !gameState.rounds[gameState.currentRoundIndex].teamVotes[
            gameState.me?.id!
          ] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <p className="text-center text-[#9CA3AF] text-sm font-['Inter'] mb-4">
                Do you approve this team?
              </p>

              <GlowButton
                variant="resistance"
                onClick={handleVoteTeam(TeamVoteAction.APPROVE)}
                className="w-full"
              >
                Approve Team
              </GlowButton>

              <GlowButton
                variant="spy"
                onClick={handleVoteTeam(TeamVoteAction.REJECT)}
                className="w-full"
              >
                Reject Team
              </GlowButton>
            </motion.div>
          )}

        {/* Player Message */}
        {gameState.phase === "VOTING" &&
          gameState.rounds[gameState.currentRoundIndex].teamVotes[
            gameState.me?.id!
          ] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <p className="text-center text-[#9CA3AF] text-sm font-['Inter'] mb-4">
                Awaiting others players votes
              </p>
            </motion.div>
          )}

        {/* Vote Buttons */}
        {gameState.phase === "MISSION" &&
          gameState.rounds[gameState.currentRoundIndex].selectedTeam.some(p => p === gameState.me?.id) && 
          !gameState.rounds[gameState.currentRoundIndex].missionVotes[gameState.me?.id!] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <p className="text-center text-[#9CA3AF] text-sm font-['Inter'] mb-4">
                vote for misson?
              </p>

              <GlowButton
                variant="resistance"
                onClick={handleVoteMission(MissionVoteAction.SUCCESS)}
                className="w-full"
              >
                SUCCESS
              </GlowButton>

              <GlowButton
                variant="spy"
                onClick={handleVoteMission(MissionVoteAction.FAIL)}
                className="w-full"
              >
                FAIL
              </GlowButton>
            </motion.div>
          )}

        {/* Player Message */}
        {gameState.phase === "MISSION" &&
          gameState.rounds[gameState.currentRoundIndex].selectedTeam.some(p => p === gameState.me?.id) &&
          gameState.rounds[gameState.currentRoundIndex].missionVotes[gameState.me?.id!] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <p className="text-center text-[#9CA3AF] text-sm font-['Inter'] mb-4">
                You have already voted, Awaiting others players votes...
              </p>
            </motion.div>
          )}

        {/* Player Message */}
        {gameState.phase === "MISSION" &&
          !gameState.rounds[gameState.currentRoundIndex].selectedTeam.some(p => p === gameState.me?.id) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <p className="text-center text-[#9CA3AF] text-sm font-['Inter'] mb-4">
                Awaiting mission finish
              </p>
            </motion.div>
          )}
      </div>
    </div>
  );
}
