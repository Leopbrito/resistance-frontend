import { describe, expect, it } from "vitest";
import { MissionVoteAction, RoundStatus, TeamVoteAction } from "../enums/enums";
import { Round } from "../interfaces/interfaces";
import { getRoundView } from "./round-view";

const makeRound = (overrides: Partial<Round> = {}): Round => ({
  roundNumber: 1,
  leaderId: "leader",
  teamSize: 2,
  selectedTeam: [],
  teamVotes: {},
  missionVotes: {},
  missionVoteResult: [],
  status: RoundStatus.PENDING,
  ...overrides,
});

describe("getRoundView: votação do time", () => {
  it("permite votar quando é a minha vez e ainda não votei", () => {
    const view = getRoundView(makeRound({ currentTeamVoterId: "me" }), "me");
    expect(view.canVoteTeam).toBe(true);
    expect(view.isAwaitingTeamVote).toBe(false);
  });

  it("aguarda quando é a vez de outro jogador", () => {
    const view = getRoundView(makeRound({ currentTeamVoterId: "other" }), "me");
    expect(view.canVoteTeam).toBe(false);
    expect(view.isAwaitingTeamVote).toBe(true);
  });

  it("aguarda depois de votar, mesmo sendo minha vez", () => {
    const round = makeRound({
      currentTeamVoterId: "me",
      teamVotes: { me: TeamVoteAction.APPROVE },
    });
    const view = getRoundView(round, "me");
    expect(view.canVoteTeam).toBe(false);
    expect(view.isAwaitingTeamVote).toBe(true);
  });

  it("sem votante definido qualquer um que não votou pode votar", () => {
    const view = getRoundView(makeRound(), "me");
    expect(view.canVoteTeam).toBe(true);
    expect(view.isAwaitingTeamVote).toBe(false);
  });

  it("sem jogador local não vota quando há votante definido", () => {
    const view = getRoundView(makeRound({ currentTeamVoterId: "other" }), undefined);
    expect(view.canVoteTeam).toBe(false);
    expect(view.isAwaitingTeamVote).toBe(true);
  });
});

describe("getRoundView: missão", () => {
  it("jogador no time que não votou pode votar na missão", () => {
    const view = getRoundView(makeRound({ selectedTeam: ["me", "other"] }), "me");
    expect(view.isOnMissionTeam).toBe(true);
    expect(view.canVoteMission).toBe(true);
    expect(view.hasVotedMission).toBe(false);
  });

  it("jogador no time que já votou não pode votar de novo", () => {
    const round = makeRound({
      selectedTeam: ["me"],
      missionVotes: { me: MissionVoteAction.SUCCESS },
    });
    const view = getRoundView(round, "me");
    expect(view.canVoteMission).toBe(false);
    expect(view.hasVotedMission).toBe(true);
  });

  it("jogador fora do time não vota na missão", () => {
    const view = getRoundView(makeRound({ selectedTeam: ["other"] }), "me");
    expect(view.isOnMissionTeam).toBe(false);
    expect(view.canVoteMission).toBe(false);
  });

  it("sem jogador local não está no time", () => {
    const view = getRoundView(makeRound({ selectedTeam: ["other"] }), undefined);
    expect(view.isOnMissionTeam).toBe(false);
  });
});
