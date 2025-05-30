// check for the first admin user

import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";

const ROOT_ADMIN_EMAIL = "bessim.boujebl@gmail.com";
const ROOT_ADMIN_PASSWORD = "123456";
export async function handleRootAdminUser() {
  try {
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
