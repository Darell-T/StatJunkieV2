// Component-related types
import * as React from "react";

export type Team = {
  id: string;
  name: string;
  abbreviation: string;
  logo: string | null;
  wins: string | number;
  losses: string | number;
  streak: string | number;
  gamesBack: string | number;
  pointsPerGame: number;
  pointsAllowed: number;
  pointDiff: number;
};

export type SelectedTeam = {
  id: string;
  name: string;
  abbreviation: string;
  logo: React.ComponentType;
  wins: string | number;
  losses: string | number;
  pointsPerGame?: number;
  pointsAllowed?: number;
  pointDiff?: number;
};

export type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
};

export type ChartContextProps = {
  config: ChartConfig;
};

export type ChartConfig = {
  [key: string]: {
    label: string;
    color?: string;
    icon?: React.ComponentType<{ className?: string }>;
  };
};

export type InfiniteSliderProps = {
  children: React.ReactNode;
  className?: string;
  speed?: number;
};

export type ProgressiveBlurProps = {
  children: React.ReactNode;
  className?: string;
};
