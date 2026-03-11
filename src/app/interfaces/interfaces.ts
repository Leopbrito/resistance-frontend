import { Role, GamePhase, TeamVoteAction, MissionVoteAction, SocketEvent } from '../enums/enums';

export interface Player {
  id: string;
  socketId: string;
  name: string;
  role?: Role;
  isLeader: boolean;
  isHost: boolean;
  roomCode: string;
  connected: boolean
}

export interface Round {
  roundNumber: number; // 1 to 5
  leaderSocketId: string;
  teamSize: number;
  selectedTeam: string[]; // socketIds
  teamVotes: Record<string, TeamVoteAction>; // Mapping socketId -> Vote
  missionVotes: Record<string, MissionVoteAction>; // Mapping socketId -> Vote
  status: 'PENDING' | 'TEAM_APPROVED' | 'TEAM_REJECTED' | 'MISSION_SUCCESS' | 'MISSION_FAILED';
  failedVotesCount?: number;
}

export interface GameState {
  phase: GamePhase;
  me: Player | null;
  players: Player[];
  resistanceWins: number;
  spyWins: number;
  rounds: Round[];
  currentRoundIndex: number; // 0 to 4
  failedTeamsInRow: number; // Se chegar a 5, espiões vencem (regra opcional, mas boa para se ter)
  revealRolesStep: boolean;
  revealMissionResultStep: boolean;
}

export interface Room {
  code: string;
  hostSocketId: string;
  gameState: GameState;
}

export interface ServerToClientEvents {
  [SocketEvent.ERROR]: (error: { message: string } | string) => void;
  [SocketEvent.GAME_STATE_UPDATE]: (gameState: GameState) => void;
  [SocketEvent.REVEAL_ROLES]: () => void;
  [SocketEvent.REVEAL_MISSION_RESULT]: () => void;
  [SocketEvent.RECONNECT]: (gameState: GameState) => void;
}

export interface ClientToServerEvents {
  [SocketEvent.CREATE_ROOM]: (data: { playerName: string }, callback: (response: { roomCode: string, playerId: string }) => void) => void;
  [SocketEvent.JOIN_ROOM]: (data: { playerName: string; roomCode: string }, callback: (response: { roomCode: string, playerId: string }) => void) => void;
  [SocketEvent.START_GAME]: (data: {}, callback: () => void) => void;
  [SocketEvent.SELECT_MISSION_TEAM]: (data: { selectedPlayers: string[] }) => void;
  [SocketEvent.SUBMIT_SELECTED_MISSION_TEAM]: (data: { selectedPlayers: string[] }) => void;
  [SocketEvent.VOTE_TEAM_APPROVAL]: (data: { vote: TeamVoteAction }) => void;
  [SocketEvent.SUBMIT_MISSION_VOTE]: (data: { vote: MissionVoteAction }) => void;
}
