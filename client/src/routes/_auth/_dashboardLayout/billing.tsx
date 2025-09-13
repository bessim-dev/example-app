import { createFileRoute, useRouteContext } from '@tanstack/react-router'
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Download, Calendar, TrendingUp, Users, Zap, Check, Crown, Building2 } from "lucide-react"
import { UsageChart } from "@/components/usage-chart"
import { ReceiptsList } from "@/components/receipts-list"
import { useGetPlans } from '@/lib/plans'


export const Route = createFileRoute('/_auth/_dashboardLayout/billing')({
  component: RouteComponent,
})

function RouteComponent() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")
  const [currentPlan, setCurrentPlan] = useState("pro")
  const organizationId = useRouteContext({
    from: "/_auth/_dashboardLayout/billing",
    select: (context) => context.auth.activeOrganization?.id,
  })
  const { data } = useGetPlans(organizationId)
  console.log("data", data)
  const plans = [
    {
      id: "starter",
      name: "Starter",
      icon: Zap,
      description: "Perfect for individuals and small projects",
      monthlyPrice: 9,
      annualPrice: 90,
      features: ["10,000 API calls/month", "5 team members", "Basic analytics", "Email support", "99.9% uptime SLA"],
      limits: {
        apiCalls: 10000,
        teamMembers: 5,
        storage: "10GB",
      },
    },
    {
      id: "pro",
      name: "Pro",
      icon: Crown,
      description: "Ideal for growing teams and businesses",
      monthlyPrice: 29,
      annualPrice: 290,
      popular: true,
      features: [
        "100,000 API calls/month",
        "25 team members",
        "Advanced analytics",
        "Priority support",
        "99.95% uptime SLA",
        "Custom integrations",
      ],
      limits: {
        apiCalls: 100000,
        teamMembers: 25,
        storage: "100GB",
      },
    },
    {
      id: "enterprise",
      name: "Enterprise",
      icon: Building2,
      description: "For large organizations with custom needs",
      monthlyPrice: 99,
      annualPrice: 990,
      features: [
        "Unlimited API calls",
        "Unlimited team members",
        "Custom analytics",
        "Dedicated support",
        "99.99% uptime SLA",
        "Custom integrations",
        "SSO & advanced security",
      ],
      limits: {
        apiCalls: "Unlimited",
        teamMembers: "Unlimited",
        storage: "Unlimited",
      },
    },
  ]

  const currentPlanData = plans.find((plan) => plan.id === currentPlan)
  const price = billingCycle === "monthly" ? currentPlanData?.monthlyPrice : currentPlanData?.annualPrice

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground text-pretty">
            Manage your subscription, view usage, and download receipts
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="receipts">Receipts</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
                  <Crown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentPlanData?.name}</div>
                  <p className="text-xs text-muted-foreground">
                    ${price}/{billingCycle === "monthly" ? "month" : "year"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">API Usage</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">67,432</div>
                  <p className="text-xs text-muted-foreground">
                    of {currentPlanData?.limits.apiCalls.toLocaleString()} calls
                  </p>
                  <Progress value={67} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">of {currentPlanData?.limits.teamMembers} members</p>
                  <Progress value={48} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Next Billing</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Dec 15</div>
                  <p className="text-xs text-muted-foreground">${price} will be charged</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Usage Overview</CardTitle>
                <CardDescription>Your API usage over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <UsageChart />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Choose Your Plan</h2>
                <p className="text-muted-foreground">Upgrade or downgrade your subscription at any time</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Monthly</span>
                <Switch
                  checked={billingCycle === "annual"}
                  onCheckedChange={(checked) => setBillingCycle(checked ? "annual" : "monthly")}
                />
                <span className="text-sm">Annual</span>
                <Badge variant="secondary" className="ml-2">
                  Save 17%
                </Badge>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => {
                const Icon = plan.icon
                const isCurrentPlan = plan.id === currentPlan
                const planPrice = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice

                return (
                  <Card
                    key={plan.id}
                    className={`relative ${isCurrentPlan ? "ring-2 ring-primary" : ""} ${plan.popular ? "border-primary" : ""}`}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary">Most Popular</Badge>
                    )}
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <CardTitle>{plan.name}</CardTitle>
                        {isCurrentPlan && <Badge variant="outline">Current</Badge>}
                      </div>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-3xl font-bold">${planPrice}</span>
                        <span className="text-muted-foreground">/{billingCycle === "monthly" ? "month" : "year"}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full"
                        variant={isCurrentPlan ? "outline" : "default"}
                        disabled={isCurrentPlan}
                        onClick={() => setCurrentPlan(plan.id)}
                      >
                        {isCurrentPlan ? "Current Plan" : "Upgrade to " + plan.name}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Usage Analytics</CardTitle>
                <CardDescription>Monitor your API usage, team activity, and resource consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <UsageChart detailed />
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>API Calls</span>
                    <span className="font-medium">67,432 / 100,000</span>
                  </div>
                  <Progress value={67} />

                  <div className="flex justify-between items-center">
                    <span>Storage Used</span>
                    <span className="font-medium">45GB / 100GB</span>
                  </div>
                  <Progress value={45} />

                  <div className="flex justify-between items-center">
                    <span>Team Members</span>
                    <span className="font-medium">12 / 25</span>
                  </div>
                  <Progress value={48} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium">Approaching Limit</span>
                    </div>
                    <p className="text-sm text-muted-foreground">You've used 67% of your API calls this month</p>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">All Good</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Storage and team usage are within limits</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Receipts Tab */}
          <TabsContent value="receipts" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Billing History</h2>
                <p className="text-muted-foreground">Download receipts and view your payment history</p>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>Your billing history and downloadable receipts</CardDescription>
              </CardHeader>
              <CardContent>
                <ReceiptsList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
