import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { APIError } from "better-auth/api";

export interface CreateOrganizationRequest {
  name: string;
  slug?: string;
  userId: string;
  planId?: string;
  billingCycle?: "monthly" | "annual";
}

export interface OnboardingState {
  step: "auth" | "org_setup" | "plan_selection" | "completed";
  organizationId?: string;
  planId?: string;
  demoCompleted?: boolean;
  metadata?: Record<string, any>;
}

export const organizationService = {
  /**
   * Create organization and add user as owner
   */
  async createOrganization(request: CreateOrganizationRequest) {
    try {
      const slug = request.slug || this.generateSlugFromName(request.name);

      // Check if slug is available
      const existingOrg = await prisma.organization.findUnique({
        where: { slug },
      });

      if (existingOrg) {
        throw new Error("Organization slug already exists");
      }

      const organization = await prisma.organization.create({
        data: {
          id: crypto.randomUUID(),
          name: request.name,
          slug,
          createdAt: new Date(),
          metadata: JSON.stringify({
            planId: request.planId,
            billingCycle: request.billingCycle || "monthly",
            onboardingCompleted: false,
          }),
        },
      });

      // Add user as owner
      await prisma.member.create({
        data: {
          id: crypto.randomUUID(),
          organizationId: organization.id,
          userId: request.userId,
          role: "owner",
          createdAt: new Date(),
        },
      });

      return organization;
    } catch (error) {
      console.error("Failed to create organization:", error);
      throw new Error("Failed to create organization");
    }
  },

  /**
   * Get organization with member details
   */
  async getOrganizationWithMembers(organizationId: string) {
    return prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
      },
    });
  },

  /**
   * Generate slug from organization name
   */
  generateSlugFromName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 50);
  },

  /**
   * Update organization plan
   */
  async updateOrganizationPlan(
    organizationId: string,
    planId: string,
    billingCycle: "monthly" | "annual"
  ) {
    const metadata = await this.getOrganizationMetadata(organizationId);

    return prisma.organization.update({
      where: { id: organizationId },
      data: {
        metadata: JSON.stringify({
          ...metadata,
          planId,
          billingCycle,
          planUpdatedAt: new Date().toISOString(),
        }),
      },
    });
  },

  /**
   * Track onboarding progress
   */
  async updateOnboardingState(
    organizationId: string,
    state: Partial<OnboardingState>
  ) {
    const metadata = await this.getOrganizationMetadata(organizationId);

    return prisma.organization.update({
      where: { id: organizationId },
      data: {
        metadata: JSON.stringify({
          ...metadata,
          onboarding: {
            ...metadata.onboarding,
            ...state,
            updatedAt: new Date().toISOString(),
          },
        }),
      },
    });
  },

  /**
   * Get organization metadata (typed)
   */
  async getOrganizationMetadata(organizationId: string): Promise<any> {
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { metadata: true },
    });

    return org?.metadata ? JSON.parse(org.metadata) : {};
  },

  /**
   * Complete onboarding process
   */
  async completeOnboarding(organizationId: string) {
    const metadata = await this.getOrganizationMetadata(organizationId);

    return prisma.organization.update({
      where: { id: organizationId },
      data: {
        metadata: JSON.stringify({
          ...metadata,
          onboardingCompleted: true,
          onboardingCompletedAt: new Date().toISOString(),
        }),
      },
    });
  },

  /**
   * Get organizations for user with role
   */
  async getUserOrganizations(userId: string) {
    const memberships = await prisma.member.findMany({
      where: { userId },
      include: {
        organization: true,
      },
    });

    return memberships.map((membership) => ({
      ...membership.organization,
      role: membership.role,
      joinedAt: membership.createdAt,
    }));
  },
};
