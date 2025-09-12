import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppForm } from "@/components/forms";
import {
  UserFormDefaultValues,
  UserFormSchema,
  type UserFormSchemaType,
} from "./schema";

export default function UserAccountForm({
  handleSubmit,
}: {
  handleSubmit: (value: UserFormSchemaType) => void;
}) {
  const form = useAppForm({
    defaultValues: UserFormDefaultValues,
    validators: {
      onChange: UserFormSchema,
    },
    onSubmit: async ({ value }) => {
      handleSubmit(value);
    },
  });

  console.log(form.state.errors, form.state.isValid, form.state.canSubmit);

  return (
    <Card className="w-[500px] mx-auto">
      <CardHeader>
        <CardTitle>User Account</CardTitle>
        <CardDescription>
          Add your account information to continue.
        </CardDescription>
      </CardHeader>
      <form
        id={`onboarding-form-user`}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}>
        <CardContent className="space-y-6">
          <form.AppField
            name="name"
            children={(field) => <field.TextField label="Full Name" />}
          />
          <form.AppField
            name="email"
            children={(field) => (
              <field.TextField
                label="Email Address"
                helperText="The owner will receive an invitation email to set up their account."
              />
            )}
          />
          <form.AppField
            name="password"
            children={(field) => <field.PasswordField label="Password" />}
          />
          <form.AppField
            name="confirmPassword"
            children={(field) => (
              <field.PasswordField label="Confirm Password" />
            )}
            validators={{
              onChangeListenTo: ["password"],
              onChange: ({ value, fieldApi }) => {
                if (value !== fieldApi.form.getFieldValue("password")) {
                  return {
                    code: "custom",
                    message: "Passwords do not match",
                    path: ["confirmPassword"],
                  };
                }
              },
            }}
          />
        </CardContent>
        <CardFooter className="mt-6">
          <form.AppForm>
            <form.SubmitButton label="Create Account 🔥" />
          </form.AppForm>
        </CardFooter>
      </form>
    </Card>
  );
}
