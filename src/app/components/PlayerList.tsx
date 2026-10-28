import { useTranslation } from "react-i18next";
import { CheckCircle, Crown, Eye, EyeOff, User, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useContext } from "react";
import { AppContext } from "../app-context";
import { GamePhase, Role, SocketEvent, TeamVoteAction } from "../enums/enums";
import { useCurrentRound } from "../hooks/useCurrentRound";
import { Player } from "../interfaces/interfaces";
import { socket } from "../web-socket";

interface PlayerListProps {
  showSpies: boolean;
  setShowSpies: (show: boolean) => void;
}

export function PlayerList({ showSpies, setShowSpies }: PlayerListProps) {
  const { t } = useTranslation();
  const { gameState } = useContext(AppContext);

  const round = useCurrentRound();

  const handleSelectPlayer = (player: Player) => {
    return () => {
      if (gameState.me?.isLeader) {
        if (!round.selectedTeam.find((p) => p === player.id)) {
          if (round.selectedTeam.length < round.teamSize) {
            socket.emit(SocketEvent.SELECT_MISSION_TEAM, {
              selectedPlayers: [...round.selectedTeam, player.id],
            });
          }
        }
      }
    };
  };

  const handleRemovePlayer = (player: Player) => {
    return () => {
      if (gameState.me?.isLeader) {
        if (round.selectedTeam.find((p) => p === player.id)) {
          socket.emit(SocketEvent.SELECT_MISSION_TEAM, {
            selectedPlayers: round.selectedTeam.filter((p) => p !== player.id),
          });
        }
      }
    };
  };

  const hasVoted = (player: Player) => {
    return Boolean(round.teamVotes[player.id]);
  };

  const hasApproved = (player: Player) => {
    return Boolean(round.teamVotes[player.id] === TeamVoteAction.APPROVE);
  };

  const teamVotesCount = () => {
    return Object.values(round.teamVotes).filter((v) => Boolean(v)).length;
  };

  const missionVotesCount = () => {
    return Object.values(round.missionVotes).filter((v) => Boolean(v)).length;
  };

  const title = () => {
    const n = gameState.currentRoundIndex + 1;
    if (gameState.phase === GamePhase.TEAM_SELECTION) {
      return t("players.teamSelection", {
        n,
        current: round.selectedTeam.length,
        total: round.teamSize,
      });
    }
    if (gameState.phase === GamePhase.VOTING) {
      return t("players.teamApproval", {
        n,
        current: teamVotesCount(),
        total: gameState.players.length,
      });
    }
    if (gameState.phase === GamePhase.MISSION) {
      return t("players.missionVotes", {
        n,
        current: missionVotesCount(),
        total: round.teamSize,
      });
    }
    return t("players.mission", { n });
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
          <h3 className="font-body text-neutral-light text-sm uppercase tracking-wide">
            {title()}
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSpies(!showSpies)}
              className="text-neutral-light hover:text-white transition-colors"
              title={showSpies ? t("players.hideSpies") : t("players.showSpies")}
            >
              {showSpies ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {gameState.players.map((player) => (
            <motion.div
              key={player.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.01 }}
              className={
                "bg-surface border-2 rounded-lg p-4 flex items-center justify-between " +
                (round.selectedTeam.some((id) => id === player.id)
                  ? "border-resistance shadow-[0_0_15px_rgba(0,217,255,0.3)]"
                  : "border-neutral opacity-50")
              }
              style={{
                cursor: gameState.me?.isLeader ? "pointer" : "default",
              }}
              onClick={
                gameState.me?.isLeader
                  ? round.selectedTeam.some((id) => id === player.id)
                    ? handleRemovePlayer(player)
                    : handleSelectPlayer(player)
                  : () => {}
              }
            >
              <div className="flex items-center gap-3">
                <div
                  className={
                    "w-12 h-12 rounded-full flex items-center justify-center " +
                    (player.role === Role.SPY && showSpies
                      ? " bg-gradient-to-br from-spy to-spy-dark  shadow-[0_0_15px_rgba(220,20,60,0.4)]"
                      : round.selectedTeam.some((id) => id === player.id)
                        ? " bg-gradient-to-br from-resistance to-resistance-dark  shadow-[0_0_15px_rgba(0,217,255,0.4)]"
                        : player.isLeader
                          ? "bg-gradient-to-br from-gold to-[yellow]  shadow-[0_0_15px_rgba(0,217,255,0.4)]"
                          : " bg-neutral")
                  }
                >
                  {player.isLeader && <Crown className="w-5 h-5 text-canvas" />}
                  {!player.isLeader && (
                    <>
                      {" "}
                      {player.role === Role.SPY && showSpies ? (
                        <Eye className="w-5 h-5 text-canvas" />
                      ) : (
                        <User className="w-5 h-5 text-canvas" />
                      )}
                    </>
                  )}
                </div>
                <div>
                  <p className="text-gold font-body text-sm tracking-wide">
                    {player.isLeader ? t("players.missionLeader") : ""}
                  </p>
                  <p className="font-body text-neutral-light">{player.name}</p>
                </div>
              </div>
              <div>
                {hasVoted(player) ? (
                  <div>
                    {hasApproved(player) ? (
                      <CheckCircle className="w-6 h-6 text-resistance" />
                    ) : (
                      <XCircle className="w-6 h-6 text-spy" />
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
