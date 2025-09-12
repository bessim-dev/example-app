import { z } from "zod";

const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const slugSchema = z.string().transform((val) => slugify(val));
export const onboardingSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  logo: z.string().optional(),
  plan: z.string().min(1),
  ownerName: z.string().min(1),
  ownerEmail: z.string().email(),
});

export type OnboardingSchemaType = z.infer<typeof onboardingSchema>;
export const onboardingDefaultValues: OnboardingSchemaType = {
  name: "",
  slug: "",
  logo: "",
  plan: "",
  ownerName: "",
  ownerEmail: "",
};

export const onboardingOrganizationSchema = z.object({
  name: z.string().min(3),
  slug: slugSchema,
  logo: z.string().optional(),
});

export type OnboardingOrganizationSchemaType = z.infer<
  typeof onboardingOrganizationSchema
>;
export const onboardingOrganizationDefaultValues: OnboardingOrganizationSchemaType =
  {
    name: "",
    slug: "",
    logo: "",
  };

export const onboardingPlanSchema = z.object({
  plan: z.string().min(1),
});

export type OnboardingPlanSchemaType = z.infer<typeof onboardingPlanSchema>;
export const onboardingPlanDefaultValues: OnboardingPlanSchemaType = {
  plan: "free",
};

export const UserFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long" })
      .max(50, { message: "Name must be at most 50 characters long" })
      .trim(),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .max(100, { message: "Email must be at most 100 characters long" })
      .trim(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(100, { message: "Password must be at most 100 characters long" })
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/,
        {
          message: "Password must contain at least one letter and one number",
        }
      ),
    confirmPassword: z
      .string()
      .min(8, {
        message: "Confirm Password must be at least 8 characters long",
      })
      .max(100, {
        message: "Confirm Password must be at most 100 characters long",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UserFormSchemaType = z.infer<typeof UserFormSchema>;
export const UserFormDefaultValues: UserFormSchemaType = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const stringToJSONSchema = z
  .string()
  .transform((str, ctx): z.infer<ReturnType<typeof json>> => {
    try {
      console.log("str", str);
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({ code: "custom", message: "Invalid JSON" });
      return z.NEVER;
    }
  });

export const metadataSchema = z.object({
  plan: z.string().min(1),
  customerId: z.string().min(1),
  subscriptionId: z.string().min(1),
  limits: z.object({
    requests: z.coerce.number().min(0),
  }),
});

export const jsonMetadataSchema = stringToJSONSchema.pipe(metadataSchema);

export type MetadataSchemaType = z.infer<typeof metadataSchema>;

export const LoginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .max(100, { message: "Email must be at most 100 characters long" })
    .trim(),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .max(100, { message: "Password must be at most 100 characters long" }),
});

export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>;
export const LoginFormDefaultValues: LoginFormSchemaType = {
  email: "",
  password: "",
};
