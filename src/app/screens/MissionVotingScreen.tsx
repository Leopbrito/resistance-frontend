import { useTranslation } from "react-i18next";
import { Eye, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../app-context";
import { GlowButton } from "../components/GlowButton";
import { LogoutButton } from "../components/LogoutButton";
import { MissionTracker } from "../components/MissionTracker";
import { ParticleBackground } from "../components/ParticleBackground";
import { PlayerList } from "../components/PlayerList";
import { StatusMessage } from "../components/StatusMessage";
import { GamePhase, MissionVoteAction, Role, SocketEvent, TeamVoteAction } from "../enums/enums";
import { useCurrentRound } from "../hooks/useCurrentRound";
import { getRoundView } from "../services/round-view";
import { socket } from "../web-socket";

const SHOW_SPIES_KEY = "showSpies";

export function MissionVotingScreen() {
  const { t } = useTranslation();
  const { gameState } = useContext(AppContext);
  const round = useCurrentRound();
  const view = getRoundView(round, gameState.me?.id);
  const isLeader = !!gameState.me?.isLeader;
  const isTeamSelection = gameState.phase === GamePhase.TEAM_SELECTION;
  const isVoting = gameState.phase === GamePhase.VOTING;
  const isMission = gameState.phase === GamePhase.MISSION;
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
        selectedPlayers: round.selectedTeam,
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
                  gameState.me?.role === Role.SPY
                    ? "text-spy border-spy/50 bg-spy/10 shadow-[0_0_10px_rgba(220,20,60,0.1)]"
                    : "text-resistance border-resistance/50 bg-resistance/10 shadow-[0_0_10px_rgba(0,217,255,0.1)]"
                }`}
                title={t("roles.yourRoleTitle", { role: t(`roles.${gameState.me.role}.name`) })}
              >
                {gameState.me?.role === Role.SPY ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <Shield className="w-5 h-5" />
                )}
              </div>
            </motion.div>
          )}

          <LogoutButton />

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

        {isTeamSelection && !isLeader && <StatusMessage message={t("voting.awaitingLeader")} />}

        {isTeamSelection && isLeader && (
          <StatusMessage message={t("voting.submitQuestion")}>
            <GlowButton
              variant="resistance"
              onClick={handleSubmitTeam}
              disabled={round.selectedTeam.length < round.teamSize}
              className="w-full"
            >
              {t("voting.submitTeam")}
            </GlowButton>
          </StatusMessage>
        )}

        {isVoting && view.canVoteTeam && (
          <StatusMessage message={t("voting.approveQuestion")}>
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
          </StatusMessage>
        )}

        {isVoting && view.isAwaitingTeamVote && (
          <StatusMessage
            message={
              round.currentTeamVoterId
                ? t("voting.awaitingVoter", {
                    name: gameState.players.find((p) => p.id === round.currentTeamVoterId)?.name,
                  })
                : t("voting.awaitingOthers")
            }
          />
        )}

        {isMission && view.canVoteMission && (
          <StatusMessage message={t("voting.missionQuestion")}>
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
          </StatusMessage>
        )}

        {isMission && view.isOnMissionTeam && view.hasVotedMission && (
          <StatusMessage message={t("voting.alreadyVoted")} />
        )}

        {isMission && !view.isOnMissionTeam && (
          <StatusMessage message={t("voting.awaitingMission")} />
        )}
      </div>
    </div>
  );
}
