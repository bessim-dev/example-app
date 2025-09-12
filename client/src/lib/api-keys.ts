import { queryOptions, useQueryClient } from "@tanstack/react-query";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "./auth-client";
import type { FormValues } from "./schemas";

const KEY_PREFIX = "ocrus";
const LIMIT = 10;
const QUERY_KEYS = {
  all: ["api-keys"],
  lists: () => [...QUERY_KEYS.all, "list"],
  list: (params: { limit?: number }) => [...QUERY_KEYS.lists(), params],
  details: (id: string) => [...QUERY_KEYS.all, id],
};

export const apiKeysQueryOptions = queryOptions({
  queryKey: QUERY_KEYS.list({ limit: LIMIT }),
  queryFn: async () => {
    const { data, error } = await authClient.apiKey.list({
      query: {
        limit: LIMIT,
      },
    });
    if (error) {
      throw error;
    }
    return data;
  },
});

export const useDeleteApiKeyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await authClient.apiKey.delete({
        keyId: id,
      });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.list({ limit: LIMIT }),
      });
      toast.success("API key revoked successfully");
    },
  });
};

export const useCreateApiKeyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormValues) => {
      const { data: apiKey, error } = await authClient.apiKey.create({
        name: data.name,
        expiresIn: data.expiresIn ? data.expiresIn * 24 * 60 * 60 : undefined,
        prefix: KEY_PREFIX,
      });
      if (error) {
        throw error;
      }
      return apiKey;
    },
    onSuccess: () => {
      console.log("API key created successfully");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.list({ limit: LIMIT }),
      });
      toast.success("API key created successfully");
    },
  });
};
