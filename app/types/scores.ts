// Scores and recent games related types

export type Competitor = {
  id: string;
  homeAway: "home" | "away";
  score: string;
  team: {
    id: string;
    displayName: string;
    abbreviation: string;
    logo: string;
  };
  leaders?: Array<{
    leaders?: Array<{
      athlete?: {
        displayName: string;
        headshot?: string;
      };
    }>;
  }>;
};

export type Competition = {
  id: string;
  date?: string;
  competitors: Competitor[];
  venue?: {
    fullName: string;
  };
  status?: {
    period: number;
    displayClock: string;
    type?: {
      shortDetail: string;
      completed?: boolean;
      state?: string;
    };
  };
};

export type Event = {
  id: string;
  date?: string;
  name?: string;
  competitions: Competition[];
};

export type ScoreboardResponse = {
  events: Event[];
};

export type GameData = {
  id: string;
  homeTeam: string;
  homeAbbreviation: string;
  homeLogo: string;
  awayTeam: string;
  awayAbbreviation: string;
  awayLogo: string;
  homeScore: string;
  awayScore: string;
  homeLeader?: string;
  awayLeader?: string;
  homeLeaderImg?: string;
  awayLeaderImg?: string;
  arena?: string;
  quarter?: number;
  time?: string;
  scheduledTime?: string;
};

// Recent games specific types
export type TeamCompetitor = {
  id: string;
  homeAway: "home" | "away";
  score: string | number | { value: number; displayValue: string };
  winner?: boolean;
  team: {
    id: string;
    displayName: string;
    abbreviation: string;
  };
};

export type CompetitionForSchedule = {
  id: string;
  date: string;
  status: {
    type: {
      completed: boolean;
      state: string;
    };
  };
  competitors: TeamCompetitor[];
};

export type EventForSchedule = {
  id: string;
  date: string;
  name: string;
  competitions: CompetitionForSchedule[];
};

export type ScheduleResponse = {
  team: {
    id: string;
    displayName: string;
  };
  events: EventForSchedule[];
};

export type Game = {
  id: string;
  won: boolean;
  opponent: string;
  opponentAbbreviation: string;
  score: string;
  date: string;
  homeAway: "home" | "away";
};
