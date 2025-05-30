import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "sonner";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
  beforeLoad: async ({ context, location }) => {
    // This will be handled by the auth check in the component
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",

        search: { redirect: location.href },
      });
    }
  },
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex-1 px-4 lg:px-6 py-6">
          <Outlet />
          <Toaster />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
