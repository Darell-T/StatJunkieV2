// scores api that will show game scores and upcoming games

export async function GET() {
  try {
    const response = await fetch(
      "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard"
    );

    if (!response.ok) {
      throw new Error(`Error fetching scores! status: ${response.status}`);
    }
    const data = await response.json();

    const gamesData = data?.events.map((event) => {
      const competition = event.competitions?.[0];
      const competitors = competition?.competitors || [];

      const homeTeam =
        competitors.find((comp) => comp.homeAway === "home") || competitors[0];
      const awayTeam =
        competitors.find((comp) => comp.homeAway === "away") || competitors[1];
      const homeScore = competitors[0]; // home team score
      const awayScore = competitors[1]; // away team score

      const homeLeader = competitors[0].leaders[0]?.leaders[0]; // home points per game leader
      const homeLeaderImg = competitors[0]?.leaders[0]?.leaders[0]?.athlete; // headshot
      const homeLogo = homeTeam;

      const awayLeader = competitors[1]?.leaders[0]?.leaders[0]; // away points per game leader
      const awayLeaderImg = competitors[1]?.leaders[0]?.leaders[0]?.athlete;
      const awayLogo = awayTeam;

      //game metadata
      const arena = competition?.venue;
      const quarter = competition?.status;
      const time = competition?.status;
      const scheduledTime = competition?.status?.type;

      console.log("Competitors Keys: ", Object.keys(competitors));
      console.log(competitors[0]);

      return {
        homeTeam: homeTeam?.team?.displayName,
        homeLogo: homeLogo?.team?.logo,
        awayTeam: awayTeam?.team?.displayName,
        awayLogo: awayLogo?.team?.logo,
        homeScore: homeScore?.score,
        awayScore: awayScore?.score,
        homeLeader: homeLeader?.athlete?.displayName,
        awayLeader: awayLeader?.athlete?.displayName,
        homeLeaderImg: homeLeaderImg?.headshot,
        awayLeaderImg: awayLeaderImg?.headshot,
        arena: arena?.fullName,
        quarter: quarter?.period,
        time: time?.displayClock,
        scheduledTime: scheduledTime?.shortDetail, // will convert this to user local time in frontend
      };
    });

    return Response.json(gamesData);
  } catch (error) {
    console.error("Error: ", error);
    return Response.json({ error: "Failed to fetch scores" }, { status: 500 });
  }
}
