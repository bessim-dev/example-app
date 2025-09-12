import { useNavigate } from "@tanstack/react-router";
import UserAccountForm from "./organizations/onboarding/user-form";
import { type UserFormSchemaType } from "./organizations/onboarding/schema";
import { useCreateUser } from "@/lib/admin";

export function SignUpForm() {
  const navigate = useNavigate({
    from: "/login",
  });

  const { mutateAsync: createUser } = useCreateUser();
  const handleSubmit = async (value: UserFormSchemaType) => {
    const data = await createUser({
      email: value.email,
      password: value.password,
      name: value.name,
    });
    navigate({
      search: {
        id: data.user.id,
        name: data.user.name,
      },
    });
  };

  return <UserAccountForm handleSubmit={handleSubmit} />;
}
