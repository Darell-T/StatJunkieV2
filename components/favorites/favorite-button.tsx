"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface FavoriteButtonProps {
  type: "team" | "player";
  id: string;
  name: string;
  abbreviation?: string; // For teams
  team?: string; // For players
  className?: string;
  size?: "sm" | "md" | "lg";
  asIcon?: boolean; // Render as icon only (no button wrapper) for nesting in buttons
}

export function FavoriteButton({
  type,
  id,
  name,
  abbreviation,
  team,
  className,
  size = "md",
  asIcon = false,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthAndFavorite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type]);

  const checkAuthAndFavorite = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setIsAuthenticated(false);
        setIsFavorited(false);
        return;
      }

      setIsAuthenticated(true);

      // Check if already favorited
      const endpoint =
        type === "team"
          ? `/api/favorites/teams?team_id=${encodeURIComponent(id)}`
          : `/api/favorites/players?player_id=${encodeURIComponent(id)}`;

      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setIsFavorited((data.favorites?.length || 0) > 0);
      } else if (response.status === 401) {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking favorite status:", error);
      setIsAuthenticated(false);
    }
  };

  const handleToggle = async (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (!isAuthenticated) {
      window.location.href = "/sign-in";
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorited) {
        // Remove favorite
        const endpoint =
          type === "team"
            ? `/api/favorites/teams?team_id=${encodeURIComponent(id)}`
            : `/api/favorites/players?player_id=${encodeURIComponent(id)}`;

        const response = await fetch(endpoint, { method: "DELETE" });
        if (response.ok) {
          setIsFavorited(false);
          setTimeout(() => checkAuthAndFavorite(), 100);
        }
      } else {
        // Add favorite
        const endpoint =
          type === "team" ? "/api/favorites/teams" : "/api/favorites/players";

        const body =
          type === "team"
            ? {
                team_id: id,
                team_name: name,
                team_abbreviation: abbreviation || "",
              }
            : {
                player_id: id,
                player_name: name,
                player_team: team || null,
              };

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (response.ok || response.status === 409) {
          setIsFavorited(true);
          setTimeout(() => checkAuthAndFavorite(), 100);
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Don't show button if not logged in
  }

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const starElement = (
    <Star
      className={cn(
        sizeClasses[size],
        isFavorited
          ? "fill-yellow-400 text-yellow-400"
          : "fill-none text-muted-foreground",
        "transition-all cursor-pointer",
        isLoading && "opacity-50"
      )}
    />
  );

  // If asIcon is true, render just the star (for nesting in buttons)
  if (asIcon) {
    return (
      <span
        onClick={handleToggle}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle(e);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={
          isFavorited
            ? `Remove ${name} from favorites`
            : `Add ${name} to favorites`
        }
        className={cn("inline-flex items-center justify-center", className)}
      >
        {starElement}
      </span>
    );
  }

  // Otherwise render as a button
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "hover:bg-transparent",
        size === "sm" ? "h-6 w-6" : size === "md" ? "h-8 w-8" : "h-10 w-10",
        className
      )}
      aria-label={
        isFavorited
          ? `Remove ${name} from favorites`
          : `Add ${name} to favorites`
      }
    >
      {starElement}
    </Button>
  );
}
