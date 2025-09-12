import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { apiKey } from "better-auth/plugins";
import { organization } from "better-auth/plugins";
import prisma from "./db";
import Stripe from "stripe";
import { stripe } from "@better-auth/stripe";
import { plans } from "./plans";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  // Allow requests from the frontend development server
  trustedOrigins: ["http://localhost:3003"],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  plugins: [
    admin(),
    apiKey(),
    organization({
      // organizationCreation: {
      //   async beforeCreate(data) {
      //     console.log("beforeCreate", data);
      //     const { organization, user } = data;
      //     const metadata = organization.metadata;
      //     const plan = metadata.plan as string;
      //     if (!plan) {
      //       throw new Error("Plan is required");
      //     }
      //     const selectedPlan = plans.find((p) => p.name === plan);
      //     if (!selectedPlan) {
      //       throw new Error("Plan not found");
      //     }
      //     console.log("selectedPlan", selectedPlan);
      //     const customer = await stripeClient.customers.create({
      //       email: user.email,
      //       name: organization.name,
      //     });
      //     console.log("customer", customer);
      //     const subscription = await stripeClient.subscriptions.create({
      //       customer: customer.id,
      //       items: [{ price: selectedPlan.priceId }],
      //       trial_period_days: 30,
      //     });
      //     console.log("subscription", subscription);
      //     return {
      //       data: {
      //         ...organization,
      //         metadata: {
      //           ...metadata,
      //           subscriptionId: subscription.id,
      //           customerId: customer.id,
      //           limits: selectedPlan.limits,
      //         },
      //       },
      //     };
      //   },
      // },
    }),
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: false,
      subscription: {
        enabled: true,
        organization: {
          enabled: true,
        },
        plans,
      },
    }),
  ],
});
