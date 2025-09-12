import { createAuthClient } from "better-auth/react";
import { apiKeyClient, organizationClient } from "better-auth/client/plugins";
import { stripeClient } from "@better-auth/stripe/client";
export const authClient = createAuthClient({
  baseURL: "http://localhost:3000", // Your server URL
  fetchOptions: {
    credentials: "include", // Include cookies for auth
  },
  plugins: [
    apiKeyClient(),
    stripeClient({
      subscription: true,
    }),
    organizationClient(),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
