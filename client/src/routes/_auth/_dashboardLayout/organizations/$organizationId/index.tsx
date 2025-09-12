import OrganizationDetails from "@/components/organizations/details";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_dashboardLayout/organizations/$organizationId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <OrganizationDetails />;
}
