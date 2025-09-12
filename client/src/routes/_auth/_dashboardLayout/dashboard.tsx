import { createFileRoute } from "@tanstack/react-router";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import data from "@/lib/data.json";
import { columns } from "@/columns/dashboard";
export const Route = createFileRoute("/_auth/_dashboardLayout/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 md:gap-6 md:py-6">
          <SectionCards />
          <ChartAreaInteractive />
          <DataTable data={data} columns={columns} />
        </div>
      </div>
    </div>
  );
}
