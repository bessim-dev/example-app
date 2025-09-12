import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "./auth-client";

export const plans = [
  {
    id: "free",
    name: "Free",
    priceId: "price_1RZ64VFYcznGZMHkqrpYDL9X",
    price: 0,
    features: [
      "2 team members",
      "500 API requests/month",
      "Basic support",
      "Standard integrations",
    ],
    requestLimit: 500,
  },
  {
    id: "pro",
    name: "Pro",
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
    requestLimit: 10000,
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
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
    requestLimit: -1, // Unlimited
  },
];


export const useGetPlans = () => {
  return useMutation({
    mutationFn: async ({ plan }: { plan: "free" | "pro" | "enterprise" }) => {
      const { data, error } = await authClient.subscription.upgrade({
        plan,
        annual: true,
        successUrl: "/dashboard",
        cancelUrl: "/on-boarding",
      })
      if (error) throw new Error(error.message);
      return data;
    },
  });
};