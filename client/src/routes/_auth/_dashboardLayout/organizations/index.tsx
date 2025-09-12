import { createFileRoute } from "@tanstack/react-router";
import OrganizationsTable from "@/components/organizations/table";
import { organizationsListQueryOptions } from "@/lib/admin";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_auth/_dashboardLayout/organizations/")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(organizationsListQueryOptions);
  },
});

function RouteComponent() {
  const { data: organizations } = useSuspenseQuery(
    organizationsListQueryOptions
  );
  return (
    <>
      <OrganizationsTable data={organizations} />
    </>
  );
}
