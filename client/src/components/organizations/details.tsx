import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { Organization } from "better-auth/plugins/organization";

// Mock data
const mockOrganization: Organization = {
  id: "1",
  name: "Acme Corp",
  email: "admin@acme.com",
  plan: "enterprise",
  status: "active",
  memberCount: 25,
  requestCount: 15420,
  createdAt: "2024-01-15",
  updatedAt: "2024-12-01",
};

interface OrganizationDetailsProps {
  organizationId: string;
  onBack: () => void;
}

export default function OrganizationDetails({}: OrganizationDetailsProps) {
  const [organization, setOrganization] =
    useState<Organization>(mockOrganization);

  const handlePlanChange = async (newPlan: string) => {
    // API call to update organization plan
    setOrganization((prev) => ({
      ...prev,
      plan: newPlan as Organization["plan"],
    }));
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Organization Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input value={organization.name} readOnly />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input value={organization.email} readOnly />
            </div>
            <div className="grid gap-2">
              <Label>Plan</Label>
              <Select
                value={organization.plan}
                onValueChange={handlePlanChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Badge variant={getStatusBadgeVariant(organization.status)}>
                {organization.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Total Members:</span>
              <span className="font-medium">{organization.memberCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Requests:</span>
              <span className="font-medium">
                {organization.requestCount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Created:</span>
              <span className="font-medium">
                {new Date(organization.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Last Updated:</span>
              <span className="font-medium">
                {new Date(organization.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
