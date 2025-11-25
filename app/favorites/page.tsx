"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { FavoriteButton } from "@/components/favorites/favorite-button";
import * as NBAIcons from "react-nba-logos";
import { Star, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FavoriteTeam {
  id: string;
  team_id: string;
  team_name: string;
  team_abbreviation: string;
  created_at: string;
}

interface FavoritePlayer {
  id: string;
  player_id: string;
  player_name: string;
  player_team: string | null;
  created_at: string;
}

export default function FavoritesPage() {
  const [favoriteTeams, setFavoriteTeams] = useState<FavoriteTeam[]>([]);
  const [favoritePlayers, setFavoritePlayers] = useState<FavoritePlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const teamsRes = await fetch("/api/favorites/teams");
      const playersRes = await fetch("/api/favorites/players");

      if (teamsRes.status === 401 || playersRes.status === 401) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);

      if (teamsRes.ok) {
        const teamsData = await teamsRes.json();
        setFavoriteTeams(teamsData.favorites || []);
      }

      if (playersRes.ok) {
        const playersData = await playersRes.json();
        setFavoritePlayers(playersData.favorites || []);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="px-4 lg:px-6 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Spinner className="h-12 w-12 mb-4" />
            <p className="text-muted-foreground">Loading favorites...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="px-4 lg:px-6 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Star className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Sign in to view favorites</h2>
            <p className="text-muted-foreground mb-6">
              Create an account or sign in to save your favorite teams and players.
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
        <p className="text-muted-foreground">
          Your favorite teams and players
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Favorite Teams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              Favorite Teams ({favoriteTeams.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {favoriteTeams.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No favorite teams yet. Star a team to add it here.
              </p>
            ) : (
              <div className="space-y-3">
                {favoriteTeams.map((team) => {
                  const TeamIcon =
                    NBAIcons[team.team_abbreviation as keyof typeof NBAIcons];
                  return (
                    <div
                      key={team.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {TeamIcon && (
                          <div className="h-10 w-10">
                            <TeamIcon />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{team.team_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {team.team_abbreviation}
                          </p>
                        </div>
                      </div>
                      <FavoriteButton
                        type="team"
                        id={team.team_id}
                        name={team.team_name}
                        abbreviation={team.team_abbreviation}
                        size="sm"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Favorite Players */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Favorite Players ({favoritePlayers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {favoritePlayers.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No favorite players yet. Star a player to add it here.
              </p>
            ) : (
              <div className="space-y-3">
                {favoritePlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{player.player_name}</p>
                      {player.player_team && (
                        <p className="text-sm text-muted-foreground">
                          {player.player_team}
                        </p>
                      )}
                    </div>
                    <FavoriteButton
                      type="player"
                      id={player.player_id}
                      name={player.player_name}
                      team={player.player_team || undefined}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

