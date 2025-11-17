import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Game = {
  id: string;
  won: boolean;
  opponent: string;
  score: string;
  date: string;
  location?: string;
  homeAway?: "home" | "away";
  opponentLogo?: React.ComponentType;
};

export function RecentGames({ games }: { games: Game[] }) {
  return (
    <div className="px-4 lg:px-6">
      <h2 className="text-xl font-semibold mb-4">Last 5 Games</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {games.map((game) => (
          <Card key={game.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant={game.won ? "default" : "destructive"}>
                  {game.won ? "W" : "L"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {game.date}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{game.opponent}</p>
                  <p className="text-sm text-muted-foreground">
                    {game.location}
                  </p>
                </div>
                <p className="text-2xl font-bold">{game.score}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
