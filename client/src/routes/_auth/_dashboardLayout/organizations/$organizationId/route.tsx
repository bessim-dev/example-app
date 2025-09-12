import { Button } from "@/components/ui/button";
import { Tabs, TabsTrigger } from "@/components/ui/tabs";
import { TabsList } from "@/components/ui/tabs";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_auth/_dashboardLayout/organizations/$organizationId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { organizationId } = Route.useParams();
  const navigate = Route.useNavigate();
  const onBack = () => {
    navigate({ to: "/organizations" });
  };
  const organization = {
    name: "Acme Corp",
    email: "admin@acme.com",
  };
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{organization.name}</h1>
            <p className="text-muted-foreground">{organization.email}</p>
          </div>
        </div>
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details" asChild>
              <Link
                to="/organizations/$organizationId"
                params={{ organizationId }}>
                Organization Details
              </Link>
            </TabsTrigger>
            <TabsTrigger value="members" asChild>
              <Link
                to="/organizations/$organizationId/members"
                params={{ organizationId }}>
                Members ({15})
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Outlet />
    </div>
  );
}
