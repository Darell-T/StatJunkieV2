"use client";
import { Input } from "@/components/ui/input";
import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import type { PlayerSummary } from "@/app/types/player";

interface InputWithButtonProps {
  onPlayerSelect?: (player: PlayerSummary) => void;
}

export function InputWithButton({ onPlayerSelect }: InputWithButtonProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlayerSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch search results
  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/players/index?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setResults(data.results || []);
      setIsOpen(true);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectPlayer = (player: PlayerSummary) => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    onPlayerSelect?.(player);
  };

  return (
    <div className="w-full max-w-2xl relative" ref={searchRef}>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search player name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          className="w-full h-12 text-base"
        />
        {isLoading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-gray-900 rounded-full" />
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {results.map((player) => (
            <button
              key={player.id}
              onClick={() => handleSelectPlayer(player)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-4 border-b last:border-b-0 transition"
            >
              {player.headshot && (
                <Image
                  src={player.headshot}
                  alt={player.displayName}
                  width={48}
                  height={48}
                  className="rounded-full object-cover shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-base text-gray-900">
                  {player.displayName || "Unknown"}
                </div>
                <div className="text-sm text-gray-600">{player.team}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {isOpen && query && results.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-sm text-gray-500 z-50">
          No players found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
