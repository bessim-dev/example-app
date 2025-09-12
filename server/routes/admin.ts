import { createRouter } from "@/lib/create-app";

import { adminService } from "@/services/admin";

const router = createRouter();

router.on(["GET"], "/admin/organizations", async (c) => {
  const organizations = await adminService.getAllOrganizations();
  return c.json(organizations);
});

export default router;
