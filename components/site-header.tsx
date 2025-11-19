import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { SelectedTeam } from "@/app/types/components";

export function SiteHeader({
  selectedTeam,
}: {
  selectedTeam: SelectedTeam | null;
}) {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        {selectedTeam ? (
          <div className="flex items-center gap-2">
            <div className="h-11 w-11">
              <selectedTeam.logo />
            </div>
            <h1 className="text-base font-medium">
              {selectedTeam.name} ({selectedTeam.wins}-{selectedTeam.losses})
            </h1>
          </div>
        ) : (
          <h1 className="text-base font-medium">Select a team</h1>
        )}
      </div>
    </header>
  );
}
