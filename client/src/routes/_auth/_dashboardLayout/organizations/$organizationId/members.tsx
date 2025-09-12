import Members from "@/components/organizations/members";
import { createFileRoute } from "@tanstack/react-router";

const mockMembers: Member[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@acme.com",
    role: "admin",
    status: "active",
    requestCount: 2340,
    lastActive: "2024-12-01",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@acme.com",
    role: "member",
    status: "active",
    requestCount: 1890,
    lastActive: "2024-11-30",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@acme.com",
    role: "viewer",
    status: "inactive",
    requestCount: 450,
    lastActive: "2024-11-15",
    createdAt: "2024-03-10",
  },
];

export const Route = createFileRoute(
  "/_auth/_dashboardLayout/organizations/$organizationId/members"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <Members data={mockMembers} />;
}
