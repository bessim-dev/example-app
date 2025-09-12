// check for the first admin user

import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";

const ROOT_ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ROOT_ADMIN_PASSWORD = "123456";
export async function handleRootAdminUser() {
  try {
    const users = await auth.api.listUserAccounts({
      query: {
        email: ROOT_ADMIN_EMAIL,
        limit: 1,
      },
    });
    if (users.length) {
      return;
    }
    return auth.api.createUser({
      body: {
        email: ROOT_ADMIN_EMAIL,
        password: ROOT_ADMIN_PASSWORD,
        name: "Bassim",
        role: "admin",
      },
    });
  } catch (error: unknown) {
    if (error instanceof APIError) {
      console.log(error.statusCode);
    }
  }
}
