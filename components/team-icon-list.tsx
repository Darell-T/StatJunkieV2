"use client";

import * as NBAIcons from "react-nba-logos";

export default function TeamIconList() {
  // Create a named mapping of team icons
  const teamIcons = Object.entries(NBAIcons)
    .filter(([, value]) => typeof value === "function")
    .map(([name, Icon]) => ({ name, Icon }));

  return (
    <div className="flex">
      {teamIcons.map(({ name, Icon }) => (
        <Icon key={name} className="mx-auto h-4 w-fit dark:invert" size={100} />
      ))}
    </div>
  );
}
