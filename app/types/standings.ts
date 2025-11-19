// Standings-related types for NBA standings API

export type Stat = {
  name: string;
  displayName: string;
  shortDisplayName: string;
  description: string;
  abbreviation: string;
  type: string;
  value: number;
  displayValue: string;
};

export type Division = {
  name: string;
  standings: {
    entries: TeamEntry[];
  };
};

export type TeamEntry = {
  team: {
    id: string;
    displayName: string;
    abbreviation: string;
    logos?: { href: string }[];
  };
  stats: Stat[];
};

export type ConferenceResponse = {
  children: Division[];
};
