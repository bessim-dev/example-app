import { useAppForm } from "@/components/forms";
import { onboardingPlanDefaultValues, onboardingPlanSchema } from "./schema";
import {
  CardContent,
  CardHeader,
  CardTitle,
  Card,
  CardDescription,
} from "@/components/ui/card";
import { plans } from "@/lib/plans";

export default function Step2PlanSelection({
  handleSubmit,
}: {
  handleSubmit: (value: { plan: string }) => void;
}) {
  const form = useAppForm({
    defaultValues: onboardingPlanDefaultValues,
    validators: {
      onChange: onboardingPlanSchema,
    },
    onSubmit: async ({ value }) => {
      handleSubmit(value);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select a plan</CardTitle>
        <CardDescription>Select a plan to continue</CardDescription>
      </CardHeader>
      <form
        id={`onboarding-form-plan`}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}>
        <CardContent>
          <form.AppField
            name="plan"
            children={(field) => <field.PlanSelectionField plans={plans} />}
          />
          <form.AppForm>
            <form.SubmitButton label="Next" />
          </form.AppForm>
        </CardContent>
      </form>
    </Card>
  );
}
