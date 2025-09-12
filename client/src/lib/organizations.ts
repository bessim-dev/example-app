import { authClient } from "./auth-client";

import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { get } from "./api";
import type { Organization } from "better-auth/plugins/organization";


const QUERY_KEYS = {
    all: ["organizations"],
    listsOrganizations: () => [...QUERY_KEYS.all, "list"],
  };

  export const organizationsListQueryOptions = queryOptions({
    queryKey: QUERY_KEYS.listsOrganizations(),
    queryFn: async () => {
      const { data, error } = await authClient.org();
    },
  });