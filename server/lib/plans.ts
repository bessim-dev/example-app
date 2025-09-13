import { StripePlan } from "@better-auth/stripe";

export const plans: StripePlan[] = [
  {
    name: "free",
    priceId: "price_1RZ64VFYcznGZMHkqrpYDL9X",
    limits: {
      requests: 100,
    },
    freeTrial: {
      days: 30,
    },
  },
  {
    name: "pro",
    priceId: "price_1RZ66QFYcznGZMHkqorr7Ugz",
    limits: {
      requests: 10000,
    },
  },
  {
    name: "enterprise",
    priceId: "price_1RZ67DFYcznGZMHkgVXD3eHf",
    limits: {
      requests: -1,
    },
  },
];
