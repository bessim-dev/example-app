"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, Calendar, TrendingUp } from "lucide-react";

// Mock data - in a real app this would come from your API
const usageStats = {
  currentPlan: "Pro",
  billingCycle: "Monthly",
  requestsUsed: 8750,
  requestsLimit: 10000,
  rateLimit: 100,
  rateLimitWindow: "per minute",
  requestsToday: 245,
  resetDate: new Date("2024-01-01"),
};

export function UsageStatsCards() {
  const usagePercentage =
    (usageStats.requestsUsed / usageStats.requestsLimit) * 100;
  const requestsRemaining = usageStats.requestsLimit - usageStats.requestsUsed;

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-500";
    if (percentage >= 75) return "text-yellow-500";
    return "text-green-500";
  };

  const getUsageBadgeVariant = (percentage: number) => {
    if (percentage >= 90) return "destructive" as const;
    if (percentage >= 75) return "secondary" as const;
    return "default" as const;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Requests Used */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Requests Used</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {usageStats.requestsUsed.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            of {usageStats.requestsLimit.toLocaleString()} this month
          </p>
          <div className="mt-3">
            <Progress value={usagePercentage} className="h-2" />
            <div className="mt-1 flex justify-between text-xs">
              <span className={getUsageColor(usagePercentage)}>
                {usagePercentage.toFixed(1)}% used
              </span>
              <Badge
                variant={getUsageBadgeVariant(usagePercentage)}
                className="text-xs">
                {usageStats.currentPlan}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Remaining */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Requests Remaining
          </CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {requestsRemaining.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            until {usageStats.resetDate.toLocaleDateString()}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div
                className={`h-2 w-2 rounded-full ${requestsRemaining > 1000 ? "bg-green-500" : requestsRemaining > 500 ? "bg-yellow-500" : "bg-red-500"}`}
              />
              <span className="text-xs text-muted-foreground">
                {requestsRemaining > 1000
                  ? "Healthy"
                  : requestsRemaining > 500
                    ? "Moderate"
                    : "Low"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rate Limit */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rate Limit</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{usageStats.rateLimit}</div>
          <p className="text-xs text-muted-foreground">
            requests {usageStats.rateLimitWindow}
          </p>
          <div className="mt-3">
            <Badge variant="outline" className="text-xs">
              Current limit
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Today's Usage */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Today's Requests
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{usageStats.requestsToday}</div>
          <p className="text-xs text-muted-foreground">requests made today</p>
          <div className="mt-3">
            <div className="text-xs text-muted-foreground">
              {(
                (usageStats.requestsToday / usageStats.requestsUsed) *
                100
              ).toFixed(1)}
              % of monthly usage
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
