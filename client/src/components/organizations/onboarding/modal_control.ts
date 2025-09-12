import { create } from "zustand";
import type { OnboardingOwnerSchemaType } from "./schema";
import type { Organization } from "better-auth/plugins/organization";
import type { Subscription } from "@better-auth/stripe";

interface OnboardingModalControl {
  organization: Organization | null;
  setOrganization: (organization: Organization | null) => void;
  plan: Subscription | null;
  setPlan: (plan: Subscription | null) => void;
  owner: OnboardingOwnerSchemaType | null;
  setOwner: (owner: OnboardingOwnerSchemaType | null) => void;
  step: number;
  setStep: (step: number) => void;
}
const useOnboardingModalControl = create<OnboardingModalControl>((set) => ({
  step: 1,
  setStep: (step: number) => set({ step }),
  organization: null,
  setOrganization: (organization) => set({ organization }),
  plan: null,
  setPlan: (plan) => set({ plan }),
  owner: null,
  setOwner: (owner) => set({ owner }),
}));

export default useOnboardingModalControl;
