import { createAuthClient } from "better-auth/react";
import { apiKeyClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000", // Your server URL
  fetchOptions: {
    credentials: "include", // Include cookies for auth
  },
  plugins: [apiKeyClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
