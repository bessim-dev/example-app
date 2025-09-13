import { authClient } from "./auth-client";

import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { get } from "./api";
import type { Organization } from "better-auth/plugins/organization";
import {
  onboardingSchema,
  type OnboardingSchemaType,
  type UserFormSchemaType,
} from "@/components/organizations/onboarding/schema";

const QUERY_KEYS = {
  all: ["admin"],
  listsOrganizations: () => [...QUERY_KEYS.all, "organizations"],
};

export const organizationsListQueryOptions = queryOptions({
  queryKey: QUERY_KEYS.listsOrganizations(),
  queryFn: async () => {
    const { data } = await get<Organization[]>("/admin/organizations");
    return data;
  },
});

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (user: Omit<UserFormSchemaType, "confirmPassword">) => {
      const { data, error } = await authClient.signUp.email({
        email: user.email,
        password: user.password,
        name: user.name,
      });
      if (error) throw new Error(error.message);
      return data;
    },
  });
};
export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      organization: Pick<Organization, "name" | "slug" | "logo">
    ) => {
      const { data, error } = await authClient.organization.create({
        name: organization.name,
        slug: organization.slug,
        logo: organization.logo ? organization.logo : undefined,
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.listsOrganizations(),
      });
    },
  });
};

export const useAdminCreateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: OnboardingSchemaType) => {
      const validatedData = onboardingSchema.parse(data);
      const { data: userData, error: userError } =
        await authClient.signUp.email({
          email: validatedData.ownerEmail,
          password: "password",
          name: validatedData.ownerName,
        });
      if (userError) throw new Error(userError.message);
      if (!userData) throw new Error("User not created");

      const { data: organizationData, error: organizationError } =
        await authClient.organization.create({
          name: validatedData.name,
          slug: validatedData.slug,
          logo: validatedData.logo ? validatedData.logo : undefined,
          metadata: {
            plan: validatedData.plan,
          },
          userId: userData.user.id,
        });
      if (organizationError) throw new Error(organizationError.message);
      if (!organizationData) throw new Error("Organization not created");
      return organizationData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.listsOrganizations(),
      });
    },
  });
};

export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (organizationId: string) => {
      const { error } = await authClient.organization.delete({
        organizationId,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.listsOrganizations(),
      });
    },
  });
};

export const usePickPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      plan,
      organizationId,
    }: {
      plan: "free" | "pro" | "enterprise";
      organizationId: string;
    }) => {
      const { data, error } = await authClient.subscription.upgrade({
        plan,
        referenceId: organizationId,
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.listsOrganizations(),
      });
    },
  });
};

export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      organizationId,
      role = "member",
      email,
    }: {
      organizationId: string;
      role?: "member" | "admin";
      email: string;
    }) => {
      const { data, error } = await authClient.organization.inviteMember({
        email,
        role,
        organizationId,
        resend: true,
      });
      if (error) {
        console.error(error);
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.listsOrganizations(),
      });
    },
  });
};
