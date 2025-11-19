import { TrendingDownIcon, TrendingUpIcon, MinusIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SelectedTeam } from "@/app/types/components";

export function SectionCards({
  selectedTeam,
}: {
  selectedTeam: SelectedTeam | null;
}) {
  // Calculate win percentage
  const winPercentage = selectedTeam
    ? (
        (Number(selectedTeam.wins) /
          (Number(selectedTeam.wins) + Number(selectedTeam.losses))) *
        100
      ).toFixed(1)
    : null;

  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Record</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {selectedTeam
              ? `${selectedTeam.wins}-${selectedTeam.losses}`
              : "--"}
          </CardTitle>
          <div className="absolute right-4 top-4">
            {selectedTeam && winPercentage && (
              <Badge
                variant="outline"
                className="flex gap-1 rounded-lg text-xs"
              >
                {Number(winPercentage) >= 50 ? (
                  <TrendingUpIcon className="size-3 text-green-600" />
                ) : (
                  <TrendingDownIcon className="size-3 text-red-600" />
                )}
                {winPercentage}%
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {selectedTeam ? "Win percentage" : "Team performance"}
          </div>
          <div className="text-muted-foreground">
            {selectedTeam ? selectedTeam.name : "Select a team"}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Points Per Game</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {selectedTeam?.pointsPerGame || "--"}
          </CardTitle>
          <div className="absolute right-4 top-4">
            {selectedTeam?.pointsPerGame && (
              <Badge
                variant="outline"
                className="flex gap-1 rounded-lg text-xs"
              >
                {Number(selectedTeam.pointsPerGame) >= 110 ? (
                  <TrendingUpIcon className="size-3 text-green-600" />
                ) : Number(selectedTeam.pointsPerGame) >= 105 ? (
                  <MinusIcon className="size-3 text-yellow-600" />
                ) : (
                  <TrendingDownIcon className="size-3 text-red-600" />
                )}
                {Number(selectedTeam.pointsPerGame) >= 110
                  ? "High"
                  : Number(selectedTeam.pointsPerGame) >= 105
                  ? "Avg"
                  : "Low"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {selectedTeam ? "Offensive output" : "Scoring average"}
          </div>
          <div className="text-muted-foreground">
            {selectedTeam ? "Average scoring per game" : "Select a team"}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Points Allowed</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {selectedTeam?.pointsAllowed || "--"}
          </CardTitle>
          <div className="absolute right-4 top-4">
            {selectedTeam?.pointsAllowed && (
              <Badge
                variant="outline"
                className="flex gap-1 rounded-lg text-xs"
              >
                {Number(selectedTeam.pointsAllowed) <= 105 ? (
                  <TrendingDownIcon className="size-3 text-green-600" />
                ) : Number(selectedTeam.pointsAllowed) <= 110 ? (
                  <MinusIcon className="size-3 text-yellow-600" />
                ) : (
                  <TrendingUpIcon className="size-3 text-red-600" />
                )}
                {Number(selectedTeam.pointsAllowed) <= 105
                  ? "Strong"
                  : Number(selectedTeam.pointsAllowed) <= 110
                  ? "Avg"
                  : "Weak"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {selectedTeam ? "Defensive rating" : "Defense metrics"}
          </div>
          <div className="text-muted-foreground">
            {selectedTeam ? "Average points allowed per game" : "Select a team"}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Points Differential</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {selectedTeam?.pointDiff !== undefined
              ? selectedTeam.pointDiff > 0
                ? `+${selectedTeam.pointDiff}`
                : selectedTeam.pointDiff
              : "--"}
          </CardTitle>
          <div className="absolute right-4 top-4">
            {selectedTeam?.pointDiff !== undefined && (
              <Badge
                variant="outline"
                className="flex gap-1 rounded-lg text-xs"
              >
                {selectedTeam.pointDiff > 0 ? (
                  <TrendingUpIcon className="size-3 text-green-600" />
                ) : selectedTeam.pointDiff < 0 ? (
                  <TrendingDownIcon className="size-3 text-red-600" />
                ) : (
                  <MinusIcon className="size-3 text-gray-600" />
                )}
                {selectedTeam.pointDiff > 0
                  ? "Positive"
                  : selectedTeam.pointDiff < 0
                  ? "Negative"
                  : "Even"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {selectedTeam ? "Net rating" : "Point margin"}
          </div>
          <div className="text-muted-foreground">
            {selectedTeam ? "Overall scoring margin per game" : "Select a team"}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
