import { useTranslation } from "react-i18next";
import { Eye, LogOut, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { GlowButton } from "../components/GlowButton";
import { MissionTracker } from "../components/MissionTracker";
import { ParticleBackground } from "../components/ParticleBackground";
import { PlayerList } from "../components/PlayerList";
import { MissionVoteAction, SocketEvent, TeamVoteAction } from "../enums/enums";
import { clearPlayerId, socket } from "../web-socket";

const SHOW_SPIES_KEY = "showSpies";

export function MissionVotingScreen() {
  const { t } = useTranslation();
  const { gameState } = useContext(AppContext);
  // Convenção por aba (sessionStorage): sobrevive ao refresh, mas não vaza o papel para outras abas
  const [showSpies, setShowSpies] = useState(() => {
    try {
      return sessionStorage.getItem(SHOW_SPIES_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(SHOW_SPIES_KEY, String(showSpies));
    } catch {
      // sem storage: volta oculto após o refresh
    }
  }, [showSpies]);

  const handleSubmitTeam = () => {
    if (gameState.me?.isLeader) {
      socket.emit(SocketEvent.SUBMIT_SELECTED_MISSION_TEAM, {
        selectedPlayers: gameState.rounds[gameState.currentRoundIndex].selectedTeam,
      });
      handleVoteTeam(TeamVoteAction.APPROVE)();
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
    <div className="relative min-h-screen bg-canvas overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 min-h-screen px-6 py-8 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 relative z-20 h-10">
          {showSpies && gameState.me?.role && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute left-0 top-0"
            >
              <div
                className={`flex items-center justify-center p-2 rounded-lg border ${
                  gameState.me?.role === "SPY"
                    ? "text-spy border-spy/50 bg-spy/10 shadow-[0_0_10px_rgba(220,20,60,0.1)]"
                    : "text-resistance border-resistance/50 bg-resistance/10 shadow-[0_0_10px_rgba(0,217,255,0.1)]"
                }`}
                title={t("roles.yourRoleTitle", { role: t(`roles.${gameState.me.role}.name`) })}
              >
                {gameState.me?.role === "SPY" ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <Shield className="w-5 h-5" />
                )}
              </div>
            </motion.div>
          )}

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => {
              clearPlayerId();
              window.location.href = "/";
            }}
            className="absolute right-0 top-0 flex items-center justify-center p-2 bg-spy/10 border border-spy/50 rounded-lg text-spy hover:bg-spy/20 hover:border-spy transition-all shadow-[0_0_10px_rgba(220,20,60,0.1)] hover:shadow-[0_0_15px_rgba(220,20,60,0.3)] z-50"
            title={t("common.logout")}
          >
            <LogOut className="w-5 h-5" />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center w-full"
          >
            <h2 className="font-display text-2xl mb-2 text-white tracking-wider">
              {t("voting.missionProgress")}
            </h2>
          </motion.div>
        </div>

        <MissionTracker hideTitle={true} />

        {/* Team Section */}
        <PlayerList showSpies={showSpies} setShowSpies={setShowSpies} />

        {/* Player Message */}
        {gameState.phase === "TEAM_SELECTION" && !gameState.me?.isLeader && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <p className="text-center text-neutral-light text-sm font-body mb-4">
              {t("voting.awaitingLeader")}
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
            <p className="text-center text-neutral-light text-sm font-body mb-4">
              {t("voting.submitQuestion")}
            </p>

            <GlowButton
              variant="resistance"
              onClick={handleSubmitTeam}
              disabled={
                gameState.rounds[gameState.currentRoundIndex].selectedTeam.length <
                gameState.rounds[gameState.currentRoundIndex].teamSize
              }
              className="w-full"
            >
              {t("voting.submitTeam")}
            </GlowButton>
          </motion.div>
        )}

        {/* Vote Buttons */}
        {gameState.phase === "VOTING" &&
          (!gameState.rounds[gameState.currentRoundIndex].currentTeamVoterId ||
            gameState.rounds[gameState.currentRoundIndex].currentTeamVoterId ===
              gameState.me?.id) &&
          !gameState.rounds[gameState.currentRoundIndex].teamVotes[gameState.me?.id!] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <p className="text-center text-neutral-light text-sm font-body mb-4">
                {t("voting.approveQuestion")}
              </p>

              <GlowButton
                variant="resistance"
                onClick={handleVoteTeam(TeamVoteAction.APPROVE)}
                className="w-full"
              >
                {t("voting.approveTeam")}
              </GlowButton>

              <GlowButton
                variant="spy"
                onClick={handleVoteTeam(TeamVoteAction.REJECT)}
                className="w-full"
              >
                {t("voting.rejectTeam")}
              </GlowButton>
            </motion.div>
          )}

        {/* Player Message */}
        {gameState.phase === "VOTING" &&
          ((gameState.rounds[gameState.currentRoundIndex].currentTeamVoterId &&
            gameState.rounds[gameState.currentRoundIndex].currentTeamVoterId !== gameState.me?.id &&
            !gameState.rounds[gameState.currentRoundIndex].teamVotes[gameState.me?.id!]) ||
            gameState.rounds[gameState.currentRoundIndex].teamVotes[gameState.me?.id!]) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <p className="text-center text-neutral-light text-sm font-body mb-4">
                {gameState.rounds[gameState.currentRoundIndex].currentTeamVoterId
                  ? t("voting.awaitingVoter", {
                      name: gameState.players.find(
                        (p) =>
                          p.id === gameState.rounds[gameState.currentRoundIndex].currentTeamVoterId,
                      )?.name,
                    })
                  : t("voting.awaitingOthers")}
              </p>
            </motion.div>
          )}

        {/* Vote Buttons */}
        {gameState.phase === "MISSION" &&
          gameState.rounds[gameState.currentRoundIndex].selectedTeam.some(
            (p) => p === gameState.me?.id,
          ) &&
          !gameState.rounds[gameState.currentRoundIndex].missionVotes[gameState.me?.id!] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <p className="text-center text-neutral-light text-sm font-body mb-4">
                {t("voting.missionQuestion")}
              </p>

              <GlowButton
                variant="resistance"
                onClick={handleVoteMission(MissionVoteAction.SUCCESS)}
                className="w-full"
              >
                {t("voting.success")}
              </GlowButton>

              <GlowButton
                variant="spy"
                onClick={handleVoteMission(MissionVoteAction.FAIL)}
                className="w-full"
              >
                {t("voting.fail")}
              </GlowButton>
            </motion.div>
          )}

        {/* Player Message */}
        {gameState.phase === "MISSION" &&
          gameState.rounds[gameState.currentRoundIndex].selectedTeam.some(
            (p) => p === gameState.me?.id,
          ) &&
          gameState.rounds[gameState.currentRoundIndex].missionVotes[gameState.me?.id!] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <p className="text-center text-neutral-light text-sm font-body mb-4">
                {t("voting.alreadyVoted")}
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
              <p className="text-center text-neutral-light text-sm font-body mb-4">
                {t("voting.awaitingMission")}
              </p>
            </motion.div>
          )}
      </div>
    </div>
  );
}
