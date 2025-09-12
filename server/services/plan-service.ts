import prisma from "@/lib/db";

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceMonthly: number; // in cents
  priceAnnual: number; // in cents
  requestsPerMonth: number;
  features: string[];
  isActive: boolean;
  popular?: boolean;
  recommended?: boolean;
}

export interface UsageStats {
  organizationId: string;
  currentMonth: {
    requests: number;
    date: string; // YYYY-MM format
  };
  previousMonth: {
    requests: number;
    date: string;
  };
  dailyAverage: number;
  projectedMonthly: number;
}

export const planService = {
  /**
   * Get all active plans for display
   */
  getActivePlans(): Plan[] {
    return [
      {
        id: "free",
        name: "Free",
        slug: "free",
        description: "Perfect for testing and small projects",
        priceMonthly: 0,
        priceAnnual: 0,
        requestsPerMonth: 1000,
        features: ["1,000 requests/month", "Basic OCR types", "Email support"],
        isActive: true,
        recommended: false,
      },
      {
        id: "starter",
        name: "Starter",
        slug: "starter",
        description: "Great for small businesses and startups",
        priceMonthly: 2900, // $29
        priceAnnual: 29000, // $290 (17% discount)
        requestsPerMonth: 10000,
        features: [
          "10,000 requests/month",
          "All OCR types",
          "Priority support",
          "Usage analytics",
        ],
        isActive: true,
        popular: true,
        recommended: true,
      },
      {
        id: "professional",
        name: "Professional",
        slug: "professional",
        description: "For growing businesses with higher volume needs",
        priceMonthly: 9900, // $99
        priceAnnual: 99000, // $990 (17% discount)
        requestsPerMonth: 50000,
        features: [
          "50,000 requests/month",
          "All OCR types",
          "Priority support",
          "Advanced analytics",
          "Custom integrations",
        ],
        isActive: true,
        recommended: false,
      },
      {
        id: "enterprise",
        name: "Enterprise",
        slug: "enterprise",
        description: "Custom solutions for large organizations",
        priceMonthly: 0, // Custom pricing
        priceAnnual: 0,
        requestsPerMonth: -1, // Unlimited
        features: [
          "Unlimited requests",
          "All OCR types",
          "24/7 support",
          "Advanced analytics",
          "Custom integrations",
          "SLA guarantee",
          "Dedicated account manager",
        ],
        isActive: true,
        recommended: false,
      },
    ];
  },

  /**
   * Get plan by ID
   */
  getPlanById(planId: string): Plan | null {
    return this.getActivePlans().find((plan) => plan.id === planId) || null;
  },

  /**
   * Recommend plan based on usage patterns
   */
  recommendPlan(
    demoRequests?: number,
    projectedMonthly?: number
  ): {
    recommendedPlan: Plan;
    reason: string;
    alternatives: Plan[];
  } {
    const plans = this.getActivePlans();
    const monthlyEstimate =
      projectedMonthly || (demoRequests ? demoRequests * 30 : 5000);

    let recommendedPlan: Plan;
    let reason: string;

    if (monthlyEstimate <= 1000) {
      recommendedPlan = plans.find((p) => p.id === "free")!;
      reason =
        "Based on your estimated usage, the Free plan provides everything you need to get started.";
    } else if (monthlyEstimate <= 10000) {
      recommendedPlan = plans.find((p) => p.id === "starter")!;
      reason =
        "Your projected usage fits perfectly with our most popular Starter plan.";
    } else if (monthlyEstimate <= 50000) {
      recommendedPlan = plans.find((p) => p.id === "professional")!;
      reason =
        "For your volume, Professional plan offers the best value with advanced features.";
    } else {
      recommendedPlan = plans.find((p) => p.id === "enterprise")!;
      reason =
        "Your high volume requirements are best served by our Enterprise solution.";
    }

    const alternatives = plans.filter(
      (p) => p.id !== recommendedPlan.id && p.isActive
    );

    return { recommendedPlan, reason, alternatives };
  },

  /**
   * Calculate pricing with discounts
   */
  calculatePricing(
    plan: Plan,
    billingCycle: "monthly" | "annual"
  ): {
    price: number;
    originalPrice?: number;
    discount?: number;
    savings?: number;
  } {
    if (billingCycle === "monthly") {
      return { price: plan.priceMonthly };
    }

    const monthlyTotal = plan.priceMonthly * 12;
    const annualPrice = plan.priceAnnual;
    const savings = monthlyTotal - annualPrice;
    const discount = Math.round((savings / monthlyTotal) * 100);

    return {
      price: annualPrice,
      originalPrice: monthlyTotal,
      discount,
      savings,
    };
  },

  /**
   * Check if plan upgrade is needed based on usage
   */
  checkUpgradeNeeded(
    currentPlan: Plan,
    usageStats: UsageStats
  ): {
    upgradeNeeded: boolean;
    recommendedPlan?: Plan;
    reason?: string;
  } {
    if (currentPlan.requestsPerMonth === -1) {
      return { upgradeNeeded: false }; // Enterprise has unlimited
    }

    const currentUsage = usageStats.currentMonth.requests;
    const projectedUsage = usageStats.projectedMonthly;
    const planLimit = currentPlan.requestsPerMonth;

    // If current usage is over 80% of limit or projected usage exceeds limit
    if (currentUsage > planLimit * 0.8 || projectedUsage > planLimit) {
      const plans = this.getActivePlans();
      const currentIndex = plans.findIndex((p) => p.id === currentPlan.id);
      const nextPlan = plans[currentIndex + 1];

      if (nextPlan) {
        return {
          upgradeNeeded: true,
          recommendedPlan: nextPlan,
          reason: `Your usage is approaching the ${currentPlan.name} plan limit. Upgrade to avoid service interruption.`,
        };
      }
    }

    return { upgradeNeeded: false };
  },

  /**
   * Get plan limits and usage status
   */
  getPlanUsageStatus(
    plan: Plan,
    usageStats: UsageStats
  ): {
    used: number;
    limit: number;
    percentage: number;
    status: "good" | "warning" | "critical";
    daysRemaining: number;
  } {
    const used = usageStats.currentMonth.requests;
    const limit = plan.requestsPerMonth;
    const percentage = limit === -1 ? 0 : (used / limit) * 100;

    let status: "good" | "warning" | "critical" = "good";
    if (percentage > 90) status = "critical";
    else if (percentage > 75) status = "warning";

    // Calculate days remaining in month
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysRemaining = Math.ceil(
      (lastDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      used,
      limit: limit === -1 ? Infinity : limit,
      percentage,
      status,
      daysRemaining,
    };
  },
};
