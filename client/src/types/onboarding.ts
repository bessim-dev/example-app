export interface OrganizationOnboardingData {
  // Step 1: General Info
  name: string;
  slug: string;
  logo?: File | null;
  logoPreview?: string;

  // Step 2: Plan Selection
  plan: "free" | "pro" | "enterprise" | null;

  // Step 3: Owner Info
  ownerName: string;
  ownerEmail: string;
  ownerRole: "admin";
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  requestLimit: number;
  popular?: boolean;
}

export type OnboardingStep = 1 | 2 | 3;

export interface OnboardingState {
  currentStep: OnboardingStep;
  data: OrganizationOnboardingData;
  isLoading: boolean;
  errors: Record<string, string>;
}

export type OnboardingAction =
  | { type: "SET_STEP"; payload: OnboardingStep }
  | { type: "UPDATE_DATA"; payload: Partial<OrganizationOnboardingData> }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: { field: string; message: string } }
  | { type: "CLEAR_ERROR"; payload: string }
  | { type: "RESET" };
