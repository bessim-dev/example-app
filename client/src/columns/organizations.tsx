"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Organization } from "better-auth/plugins/organization";
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useDeleteOrganization } from "@/lib/admin";
import React, { useState } from "react";
interface ActionsProps {
  organization: Organization;
  onViewDetails: (orgId: string) => void;
  onPlanChange: (orgId: string, newPlan: string) => void;
  onStatusChange: (orgId: string, newStatus: string) => void;
  onDelete: (orgId: string) => void;
}

function ActionsCell({
  organization,
  onViewDetails,
  onPlanChange,
  onStatusChange,
}: ActionsProps) {
  const { mutateAsync: deleteOrganization, isPending } =
    useDeleteOrganization();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(organization.id)}>
          Copy organization ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onViewDetails(organization.id)}>
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem>Edit Organization</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            onStatusChange(
              organization.id,
              organization.status === "active" ? "suspended" : "active"
            )
          }>
          {organization.status === "active" ? "Suspend" : "Activate"}
        </DropdownMenuItem>
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="text-destructive"
              onSelect={(e) => e.preventDefault()}>
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isPending}
                onClick={async () => {
                  await deleteOrganization(organization.id);
                  setDeleteDialogOpen(false);
                }}>
                {isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PlanCell({
  organization,
  onPlanChange,
}: {
  organization: Organization;
  onPlanChange: (orgId: string, newPlan: string) => void;
}) {
  const metadata = JSON.parse(organization.metadata) ?? { plan: "--" };

  console.log("metadata", metadata);
  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return "default";
      case "pro":
        return "secondary";
      case "free":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Select
      value={metadata.plan}
      onValueChange={(value) => onPlanChange(organization.id, value)}>
      <SelectTrigger className="w-32">
        <SelectValue>
          <Badge variant={getPlanBadgeVariant(metadata.plan)}>
            {metadata.plan}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="free">Free</SelectItem>
        <SelectItem value="pro">Pro</SelectItem>
        <SelectItem value="enterprise">Enterprise</SelectItem>
      </SelectContent>
    </Select>
  );
}

function StatusBadge({ status }: { status: Organization["status"] }) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "suspended":
        return "destructive";
      default:
        return "outline";
    }
  };

  return <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>;
}

export function createColumns({
  onViewDetails,
  onPlanChange,
  onStatusChange,
  onDelete,
}: {
  onViewDetails: (orgId: string) => void;
  onPlanChange: (orgId: string, newPlan: string) => void;
  onStatusChange: (orgId: string, newStatus: string) => void;
  onDelete: (orgId: string) => void;
}): ColumnDef<Organization>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Organization
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const organization = row.original;
        const metadata = JSON.parse(organization.metadata || "{}");
        return (
          <div>
            <div className="font-medium">{organization.name}</div>
            <div className="text-sm text-muted-foreground">
              {metadata.customerId}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "metadata",
      header: "Plan",
      cell: ({ row }) => {
        const organization = row.original;
        return (
          <PlanCell organization={organization} onPlanChange={onPlanChange} />
        );
      },
    },
    {
      accessorKey: "members",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Members
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const members = row.original.members;
        return <div className="text-center">{members.length}</div>;
      },
    },
    {
      accessorKey: "metadata",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Requests
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const metadata = JSON.parse(row.original.metadata || "{}");
        const amount = Number.parseFloat(metadata.limits?.requests ?? "0") || 0;
        return <div className="text-center">{amount.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const organization = row.original;
        return (
          <ActionsCell
            organization={organization}
            onViewDetails={onViewDetails}
            onPlanChange={onPlanChange}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        );
      },
    },
  ];
}
