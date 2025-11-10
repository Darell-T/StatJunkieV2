//standings route for eastern and western conference teams
type Division = {
  name: string;
  standings: {
    entries: TeamEntry[]; // stop using any you fool
  };
};

type TeamEntry = {
  team: {
    id: string;
    displayName: string;
    abbreviation: string;
    logos?: { href: string }[];
  };
  stats: any[];
};

export async function GET() {
  try {
    const [easternResponse, westernResponse] = await Promise.all([
      fetch(
        "https://site.api.espn.com/apis/v2/sports/basketball/nba/standings?group=5"
      ),
      fetch(
        "https://site.api.espn.com/apis/v2/sports/basketball/nba/standings?group=6"
      ),
    ]);

    if (!easternResponse.ok || !westernResponse.ok) {
      throw new Error("Failed to fetch standings");
    }

    const easternData = await easternResponse.json();
    const westernData = await westernResponse.json();

    Response.json({
      eastern: easternData,
      western: westernData,
    });

    //create a function that formats the teams data that we need

    const formatTeams = (entries: TeamEntry[]) => {
      return entries.map((entry) => {
        const team = entry.team;

        const stats: Record<string, string | number> = {};
        entry.stats.forEach((stat) => {
          stats[stat.name] = stat.value;
        });

        return {
          id: team.id,
          name: team.displayName,
          abbreviation: team.abbreviation,
          logo: team.logos ? team.logos[0].href : null,
          wins: stats.wins || "0",
          losses: stats.losses || "0",
          streak: Number(stats.streak) > 0 ? stats.streak : "0",
          gamesBack: Number(stats.gamesBack) > 0 ? stats.gamesBack : "0",
        };
      });
    };

    //flatten the all divisions in the eastern conference
    const easternTeams = easternData.children.flatMap(
      (division: Division) => division.standings.entries
    );
    // flatten all the divisions in the western conference
    const westernTeams = westernData.children.flatMap(
      (division: Division) => division.standings.entries
    );

    const formattedEastern = formatTeams(easternTeams);
    const formattedWestern = formatTeams(westernTeams);

    // sort the teams based on wins for the TABLES MAN

    const sortedEastern = [...formattedEastern].sort(
      (a, b) => Number(b.wins) - Number(a.wins)
    );
    const sortedWestern = [...formattedWestern].sort(
      (a, b) => Number(b.wins) - Number(a.wins)
    );

    return Response.json({
      eastern: sortedEastern,
      western: sortedWestern,
    });
  } catch (error) {
    console.error("Error fetching NBA standings: ", error);
    return Response.json(
      { error: "Failed to fetch standings" },
      { status: 500 }
    );
  }
}
