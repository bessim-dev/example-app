"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import Step1GeneralInfo from "./organization-info";
import Step2PlanSelection from "./plan-selection";
import UserAccountForm from "./user-form";
import useOnboardingModalControl from "./modal_control";

interface OrganizationOnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const stepTitles = {
  1: "General Information",
  2: "Select Plan",
  3: "Add Owner",
};

export default function OrganizationOnboardingModal({
  open,
  onOpenChange,
  onSuccess,
}: OrganizationOnboardingModalProps) {
  const { step: currentStep, setStep } = useOnboardingModalControl();
  const progress = (currentStep / 3) * 100;
  const isLoading = false;

  const handleNext = () => {
    if (currentStep < 3) {
      setStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const success = true;
    if (success) {
      onOpenChange(false);
      onSuccess?.();
    }
  };

  const canProceed = true;
  const isLastStep = currentStep === 3;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1GeneralInfo />;
      case 2:
        return <Step2PlanSelection />;
      case 3:
        return <UserAccountForm />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Organization</DialogTitle>
          <DialogDescription>
            Step {currentStep} of 3:{" "}
            {stepTitles[currentStep as keyof typeof stepTitles]}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{currentStep}/3 steps completed</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    step < currentStep
                      ? "bg-primary border-primary text-primary-foreground"
                      : step === currentStep
                        ? "border-primary text-primary"
                        : "border-muted-foreground text-muted-foreground"
                  }`}>
                  {step < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{step}</span>
                  )}
                </div>
                <span className="ml-2 text-sm font-medium">
                  {stepTitles[step as keyof typeof stepTitles]}
                </span>
              </div>
            ))}
          </div>

          {/* Current Step Content */}
          <div className="min-h-[400px]">{renderStep()}</div>

          {/* Global Error */}
          {/* {errors.submit && (
            <div className="rounded-lg bg-destructive/10 p-4">
              <p className="text-sm text-destructive">{errors.submit}</p>
            </div>
          )} */}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pb-6 border-b">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isLoading}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}>
                Cancel
              </Button>

              {/* {isLastStep ? (
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Organization"}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed || isLoading}
                  form={`onboarding-form-${currentStep}`}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )} */}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
