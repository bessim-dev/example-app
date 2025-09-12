"use client";

import { useMemo, useState } from "react";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OnboardingProvider } from "@/contexts/onboarding-context";
import OrganizationOnboardingModal from "./onboarding/modal";
import type { Organization } from "better-auth/plugins/organization";
import { createColumns } from "@/columns/organizations";
import { DataTable } from "../data-table";

interface OrganizationsTableProps {
  data: Organization[];
}

export default function OrganizationsTable({ data }: OrganizationsTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // const handlePlanChange = async (orgId: string, newPlan: string) => {
  //   // API call to update organization plan
  //   setOrganizations((prev) =>
  //     prev.map((org) =>
  //       org.id === orgId ? { ...org, plan: newPlan as string } : org
  //     )
  //   );
  // };

  // const handleStatusChange = async (orgId: string, newStatus: string) => {
  //   // API call to update organization status
  //   setOrganizations((prev) =>
  //     prev.map((org) =>
  //       org.id === orgId
  //         ? { ...org, status: newStatus as Organization["status"] }
  //         : org
  //     )
  //   );
  // };

  // const handleDeleteOrganization = async (orgId: string) => {
  //   // API call to delete organization
  //   setOrganizations((prev) => prev.filter((org) => org.id !== orgId));
  // };

  const handleOnboardingSuccess = () => {
    // Refresh organizations list or add the new organization to state
    console.log("Organization created successfully!");
    // You would typically refetch the organizations here
  };

  const columns = useMemo(
    () =>
      createColumns({
        onViewDetails: () => {},
        onPlanChange: () => {},
        onStatusChange: () => {},
        onDelete: () => {},
      }),
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-muted-foreground">
            Manage all organizations and their settings
          </p>
        </div>
        <OnboardingProvider>
          <Button onClick={() => setIsOnboardingOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Organization
          </Button>
          <OrganizationOnboardingModal
            open={isOnboardingOpen}
            onOpenChange={setIsOnboardingOpen}
            onSuccess={handleOnboardingSuccess}
          />
        </OnboardingProvider>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization Management</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search organizations..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
