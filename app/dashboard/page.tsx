"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import data from "./data.json";

type SelectedTeam = {
  name: string;
  abbreviation: string;
  logo: React.ComponentType;
  wins: string | number;
  losses: string | number;
  pointsPerGame?: number;
  pointsAllowed?: number;
  pointDiff?: number;
};

export default function Page() {
  const [selectedTeam, setSelectedTeam] = useState<SelectedTeam | null>(null);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" onTeamSelect={setSelectedTeam} />
      <SidebarInset>
        <SiteHeader selectedTeam={selectedTeam} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
