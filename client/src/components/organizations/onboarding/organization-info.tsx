import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppForm } from "@/components/forms";
import {
  onboardingOrganizationDefaultValues,
  onboardingOrganizationSchema,
  slugSchema,
} from "./schema";
export default function Step1GeneralInfo({
  handleSubmit,
}: {
  handleSubmit: (value: { name: string; slug: string; logo?: string }) => void;
}) {
  const form = useAppForm({
    defaultValues: onboardingOrganizationDefaultValues,
    validators: {
      onChange: onboardingOrganizationSchema,
    },
    onSubmit: async ({ value }) => {
      handleSubmit(value);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Information</CardTitle>
        <CardDescription>
          Let's start with the basic information about your organization.
        </CardDescription>
      </CardHeader>
      <form
        id={`onboarding-form-organization`}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}>
        <CardContent className="space-y-6">
          <form.AppField
            name="name"
            children={(field) => <field.TextField label="Organization Name" />}
          />

          <form.AppField
            name="slug"
            validators={{
              onChangeListenTo: ["name"],
            }}
            children={(field) => (
              <field.TextField
                dependency="name"
                customValidationSchema={slugSchema}
                label="URL Slug"
                helperText="This will be used in your organization's URL. Only lowercase letters, numbers, and hyphens are allowed."
              />
            )}
          />

          <form.AppField
            name="logo"
            children={(field) => (
              <field.AvatarUploaderField label="Organization Logo" />
            )}
          />
          <form.AppForm>
            <form.SubmitButton label="Next" />
          </form.AppForm>
        </CardContent>
      </form>
    </Card>
  );
}
