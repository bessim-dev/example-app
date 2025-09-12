import { StripePlan } from "@better-auth/stripe";

export const plans: StripePlan[] = [
  {
    name: "free",
    priceId: "price_1RZ64VFYcznGZMHkqrpYDL9X",
    price: 0,
    features: [
      "2 team members",
      "500 API requests/month",
      "Basic support",
      "Standard integrations",
    ],
    limits: {
      requests: 500,
    },
    freeTrial: {
      days: 30,
    },
  },
  {
    name: "pro",
    priceId: "price_1RZ66QFYcznGZMHkqorr7Ugz",
    price: 29,
    features: [
      "10 team members",
      "10,000 API requests/month",
      "Priority support",
      "Advanced integrations",
      "Custom branding",
      "Analytics dashboard",
    ],
    limits: {
      requests: 10000,
    },
    popular: true,
  },
  {
    name: "enterprise",
    priceId: "price_1RZ67DFYcznGZMHkgVXD3eHf",
    price: 99,
    features: [
      "Unlimited team members",
      "Unlimited API requests",
      "24/7 dedicated support",
      "All integrations",
      "White-label solution",
      "Advanced analytics",
      "Custom development",
      "SLA guarantee",
    ],
    limits: {
      requests: -1,
    },
  },
];
