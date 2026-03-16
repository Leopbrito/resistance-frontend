import { motion } from "motion/react";
import { useContext } from "react";
import { AppContext } from "../App";
import { GlowButton } from "../components/GlowButton";
import { MissionTracker } from "../components/MissionTracker";
import { ParticleBackground } from "../components/ParticleBackground";
import { PlayerList } from "../components/PlayerList";
import { MissionVoteAction, SocketEvent, TeamVoteAction } from "../enums/enums";
import { socket } from "../web-socket";

export function MissionVotingScreen() {
  const { gameState } = useContext(AppContext);

  const handleSubmitTeam = () => {
    if (gameState.me?.isLeader) {
      socket.emit(SocketEvent.SUBMIT_SELECTED_MISSION_TEAM, {
        selectedPlayers:
          gameState.rounds[gameState.currentRoundIndex].selectedTeam,
      });
      handleVoteTeam(TeamVoteAction.APPROVE)()
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
          className="text-center mb-4"
        >
          <h2 className="font-['Orbitron'] text-2xl mb-2 text-white tracking-wider">
            MISSION PROGRESS
          </h2>
        </motion.div>

        <MissionTracker hideTitle={true} />

        {/* Team Section */}
        <PlayerList />

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
              disabled={
                gameState.rounds[gameState.currentRoundIndex].selectedTeam
                  .length <
                gameState.rounds[gameState.currentRoundIndex].teamSize
              }
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
          gameState.rounds[gameState.currentRoundIndex].selectedTeam.some(
            (p) => p === gameState.me?.id,
          ) &&
          !gameState.rounds[gameState.currentRoundIndex].missionVotes[
            gameState.me?.id!
          ] && (
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
          gameState.rounds[gameState.currentRoundIndex].selectedTeam.some(
            (p) => p === gameState.me?.id,
          ) &&
          gameState.rounds[gameState.currentRoundIndex].missionVotes[
            gameState.me?.id!
          ] && (
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
          !gameState.rounds[gameState.currentRoundIndex].selectedTeam.some(
            (p) => p === gameState.me?.id,
          ) && (
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
