"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import * as NBAIcons from "react-nba-logos";
import type { NBALogo } from "react-nba-logos";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    icon?: LucideIcon | (typeof NBAIcons)[keyof typeof NBAIcons];
    rank?: number;
    abbreviation?: string;
    wins?: string | number;
    losses?: string | number;
    title?: string;
    url: string;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem
              key={item.title || `${item.rank}-${item.abbreviation}`}
            >
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  {item.rank && <span>{item.rank}.</span>}
                  {item.icon && (
                    <div className="h-11 w-11">
                      <item.icon />
                    </div>
                  )}
                  {item.abbreviation && <span>{item.abbreviation}</span>}
                  {item.wins !== undefined && item.losses !== undefined && (
                    <span>
                      {item.wins}-{item.losses}
                    </span>
                  )}
                  {item.title && <span>{item.title}</span>}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
