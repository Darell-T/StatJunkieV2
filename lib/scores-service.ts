type GameData = {
  id: string;
  homeTeam: string;
  homeLogo: string;
  awayTeam: string;
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

export async function fetchAndParseScores(): Promise<GameData[]> {
  const response = await fetch(
    "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard"
  );

  if (!response.ok) {
    throw new Error(`Error fetching scores! status: ${response.status}`);
  }

  const data = await response.json();

  const gamesData = data?.events.map((event: any) => {
    const competition = event.competitions?.[0];
    const competitors = competition?.competitors || [];

    const homeTeam =
      competitors.find((comp: any) => comp.homeAway === "home") ||
      competitors[0];
    const awayTeam =
      competitors.find((comp: any) => comp.homeAway === "away") ||
      competitors[1];
    const homeScore = competitors[0];
    const awayScore = competitors[1];

    const homeLeader = competitors[0]?.leaders?.[0]?.leaders?.[0];
    const homeLeaderImg = competitors[0]?.leaders?.[0]?.leaders?.[0]?.athlete;
    const homeLogo = homeTeam;

    const awayLeader = competitors[1]?.leaders?.[0]?.leaders?.[0];
    const awayLeaderImg = competitors[1]?.leaders?.[0]?.leaders?.[0]?.athlete;
    const awayLogo = awayTeam;

    const arena = competition?.venue;
    const quarter = competition?.status;
    const time = competition?.status;
    const scheduledTime = competition?.status?.type;

    return {
      id: event.id,
      homeTeam: homeTeam?.team?.displayName || "Unknown",
      homeLogo: homeLogo?.team?.logo || "",
      awayTeam: awayTeam?.team?.displayName || "Unknown",
      awayLogo: awayLogo?.team?.logo || "",
      homeScore: homeScore?.score || "0",
      awayScore: awayScore?.score || "0",
      homeLeader: homeLeader?.athlete?.displayName,
      awayLeader: awayLeader?.athlete?.displayName,
      homeLeaderImg: homeLeaderImg?.headshot,
      awayLeaderImg: awayLeaderImg?.headshot,
      arena: arena?.fullName,
      quarter: quarter?.period,
      time: time?.displayClock,
      scheduledTime: scheduledTime?.shortDetail,
    };
  });

  return gamesData;
}
