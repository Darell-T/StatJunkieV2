// Player-related types for ESPN API integration

export type CachedPlayer = {
  player: Player;
  source: string;
};

export type Player = {
  name: string;
  team: string;
  headshot: string;
  position: string;
  avgPoints?: string;
  avgRebounds?: string;
  avgAssists?: string;
  fieldGoalPct?: string;
};

export interface RosterAthlete {
  id: string;
  displayName: string;
  // Add these optional fields:
  headshot?: {
    href: string;
    alt?: string;
  };
  position?: {
    displayName: string;
  };
}

export interface Roster {
  // Add the team object:
  team: {
    id: string;
    displayName: string;
    abbreviation?: string;
  };

  athletes: RosterAthlete[];
}

export type StatSummary = {
  name: string;
  displayValue: string;
};

export type PlayerDetailResponse = {
  athlete?: {
    displayName: string;
    headshot?: {
      href: string;
    };
    position?: {
      displayName: string;
    };
    team?: {
      displayName: string;
    };
    statsSummary?: {
      statistics: StatSummary[];
    };
  };
};

export type PlayerSummary = {
  displayName: string;
  id: string;
  team: string;
  headshot: string;
};
