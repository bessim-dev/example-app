"use client";

import type React from "react";
import { createContext, useContext, useReducer, useCallback } from "react";
import type {
  OnboardingState,
  OnboardingAction,
  OrganizationOnboardingData,
  OnboardingStep,
} from "@/types/onboarding";

const initialState: OnboardingState = {
  currentStep: 1,
  data: {
    name: "",
    slug: "",
    logo: null,
    logoPreview: "",
    plan: null,
    ownerName: "",
    ownerEmail: "",
    ownerRole: "admin",
  },
  isLoading: false,
  errors: {},
};

function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction
): OnboardingState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.payload };

    case "UPDATE_DATA":
      return {
        ...state,
        data: { ...state.data, ...action.payload },
        // Clear related errors when data is updated
        errors: Object.keys(action.payload).reduce((acc, key) => {
          const { [key]: _, ...rest } = state.errors;
          return rest;
        }, state.errors),
      };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.field]: action.payload.message,
        },
      };

    case "CLEAR_ERROR":
      const { [action.payload]: _, ...restErrors } = state.errors;
      return { ...state, errors: restErrors };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

interface OnboardingContextType {
  state: OnboardingState;
  updateData: (data: Partial<OrganizationOnboardingData>) => void;
  setStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setLoading: (loading: boolean) => void;
  setError: (field: string, message: string) => void;
  clearError: (field: string) => void;
  reset: () => void;
  canProceedToStep: (step: OnboardingStep) => boolean;
  submitOrganization: () => Promise<boolean>;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}

// Utility function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Validation functions
function validateStep1(
  data: OrganizationOnboardingData
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) {
    errors.name = "Organization name is required";
  } else if (data.name.length < 2) {
    errors.name = "Organization name must be at least 2 characters";
  }

  if (!data.slug.trim()) {
    errors.slug = "Slug is required";
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.slug =
      "Slug can only contain lowercase letters, numbers, and hyphens";
  }

  return errors;
}

function validateStep2(
  data: OrganizationOnboardingData
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.plan) {
    errors.plan = "Please select a plan";
  }

  return errors;
}

function validateStep3(
  data: OrganizationOnboardingData
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.ownerName.trim()) {
    errors.ownerName = "Owner name is required";
  }

  if (!data.ownerEmail.trim()) {
    errors.ownerEmail = "Owner email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.ownerEmail)) {
    errors.ownerEmail = "Please enter a valid email address";
  }

  return errors;
}

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  const updateData = useCallback(
    (data: Partial<OrganizationOnboardingData>) => {
      // Auto-generate slug when name changes
      if (data.name !== undefined) {
        const slug = generateSlug(data.name);
        data = { ...data, slug };
      }

      dispatch({ type: "UPDATE_DATA", payload: data });
    },
    []
  );

  const setStep = useCallback((step: OnboardingStep) => {
    dispatch({ type: "SET_STEP", payload: step });
  }, []);

  const nextStep = useCallback(() => {
    if (state.currentStep < 3) {
      dispatch({
        type: "SET_STEP",
        payload: (state.currentStep + 1) as OnboardingStep,
      });
    }
  }, [state.currentStep]);

  const prevStep = useCallback(() => {
    if (state.currentStep > 1) {
      dispatch({
        type: "SET_STEP",
        payload: (state.currentStep - 1) as OnboardingStep,
      });
    }
  }, [state.currentStep]);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  }, []);

  const setError = useCallback((field: string, message: string) => {
    dispatch({ type: "SET_ERROR", payload: { field, message } });
  }, []);

  const clearError = useCallback((field: string) => {
    dispatch({ type: "CLEAR_ERROR", payload: field });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const canProceedToStep = useCallback(
    (step: OnboardingStep): boolean => {
      switch (step) {
        case 1:
          return true;
        case 2:
          return Object.keys(validateStep1(state.data)).length === 0;
        case 3:
          return (
            Object.keys(validateStep1(state.data)).length === 0 &&
            Object.keys(validateStep2(state.data)).length === 0
          );
        default:
          return false;
      }
    },
    [state.data]
  );

  const submitOrganization = useCallback(async (): Promise<boolean> => {
    // Validate all steps
    const step1Errors = validateStep1(state.data);
    const step2Errors = validateStep2(state.data);
    const step3Errors = validateStep3(state.data);

    const allErrors = { ...step1Errors, ...step2Errors, ...step3Errors };

    if (Object.keys(allErrors).length > 0) {
      Object.entries(allErrors).forEach(([field, message]) => {
        setError(field, message);
      });
      return false;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would make the actual API call to create the organization
      console.log("Creating organization:", state.data);

      reset();
      return true;
    } catch (error) {
      setError("submit", "Failed to create organization. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [state.data, setError, setLoading, reset]);

  const contextValue: OnboardingContextType = {
    state,
    updateData,
    setStep,
    nextStep,
    prevStep,
    setLoading,
    setError,
    clearError,
    reset,
    canProceedToStep,
    submitOrganization,
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
}
