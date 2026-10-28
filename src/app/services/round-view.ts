import { Round } from "../interfaces/interfaces";

// Condições de tela derivadas do round atual e do jogador local
export function getRoundView(round: Round, myId: string | undefined) {
  const id = myId ?? "";
  const voterId = round.currentTeamVoterId;

  const hasVotedTeam = !!round.teamVotes[id];
  // Sem votante definido qualquer um pode votar; com votante, só o da vez
  const isMyTurnToVote = !voterId || voterId === myId;
  const isOnMissionTeam = round.selectedTeam.some((playerId) => playerId === myId);
  const hasVotedMission = !!round.missionVotes[id];

  return {
    canVoteTeam: isMyTurnToVote && !hasVotedTeam,
    // Esperando outro votar (ou já votei e aguardo os demais)
    isAwaitingTeamVote: (!!voterId && voterId !== myId && !hasVotedTeam) || hasVotedTeam,
    isOnMissionTeam,
    hasVotedMission,
    canVoteMission: isOnMissionTeam && !hasVotedMission,
  };
}
