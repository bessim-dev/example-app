import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Toaster } from "sonner";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
  beforeLoad: async ({ context, location }) => {
    // This will be handled by the auth check in the component
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href, },
      });
    } else if (!context.auth.activeOrganization || !context.auth.activeOrganization.metadata?.subscriptionId) {
      // throw redirect({
      //   to: "/on-boarding",
      //   search: {
      //     redirect: location.href,
      //   },
      // });
    }
  },
});

function RouteComponent() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}
