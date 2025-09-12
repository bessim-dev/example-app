// this file will have all the form components that are used in the app

import React, { useCallback, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { X, Upload, Check, ArrowRight } from "lucide-react";
import { Badge } from "./ui/badge";

import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import type { ZodSchema } from "zod";
import { PasswordInput } from "./ui/password-input";
const { fieldContext, formContext, useFormContext, useFieldContext } =
  createFormHookContexts();

export const TextField = ({
  label,
  helperText,
  placeholder,
  dependency,
  customValidationSchema,
}: {
  label: string;
  helperText?: string;
  placeholder?: string;
  dependency?: string;
  customValidationSchema?: ZodSchema;
}) => {
  const { state, handleChange, name, form } = useFieldContext<string>();
  const { errors, isValid } = state.meta;
  const { value } = state;
  const linkedFieldValue = dependency ? form.getFieldValue(dependency) : null;
  const handleChangeWithValidation = useCallback((value: string) => {
    const _value = customValidationSchema
      ? customValidationSchema.parse(value)
      : value;
    handleChange(_value);
  }, []);

  useEffect(() => {
    if (dependency && linkedFieldValue) {
      handleChangeWithValidation(linkedFieldValue);
    }
  }, [dependency, linkedFieldValue]);

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label} *</Label>
      <Input
        id={name}
        value={value}
        onChange={(e) => {
          const value = e.target.value;
          handleChangeWithValidation(value);
        }}
        placeholder={placeholder}
        className={!isValid ? "border-destructive" : ""}
      />
      {isValid ? null : (
        <p className="text-sm text-destructive">{errors[0].message}</p>
      )}
      {helperText && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
};
export const PasswordField = ({
  label,
  helperText,
  placeholder,
}: {
  label: string;
  helperText?: string;
  placeholder?: string;
}) => {
  const { state, handleChange, name } = useFieldContext<string>();
  const { errors, isValid } = state.meta;
  const { value } = state;

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label} *</Label>
      <div className="relative">
        <PasswordInput
          id={name}
          value={value}
          onChange={(e) => {
            const value = e.target.value;
            handleChange(value);
          }}
          placeholder={placeholder}
          className={!isValid ? "border-destructive" : ""}
        />
      </div>
      {isValid ? null : (
        <p className="text-sm text-destructive">{errors[0].message}</p>
      )}
      {helperText && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
};

export const AvatarUploaderField = ({
  label,
  helperText,
}: {
  label: string;
  helperText?: string;
}) => {
  const { state, handleChange, name } = useFieldContext<File | string | null>();
  const { errors, isValid } = state.meta;
  const { value } = state;

  const id = React.useId();
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (value) {
      if (typeof value === "string") {
        setPreview(value);
      } else {
        const objectUrl = URL.createObjectURL(value);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      }
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleChange(file);
    }
  };

  const handleRemove = () => {
    handleChange(null);
  };

  return (
    <div className="space-y-2 h-[110px]">
      <Label htmlFor={name}>{label}</Label>
      <div className="flex items-center space-x-4">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Logo preview"
              className="h-16 w-16 rounded-lg object-cover border"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6"
              onClick={handleRemove}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="h-16 w-16 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={name}
          />
          <Label htmlFor={id} className="cursor-pointer">
            <Button type="button" variant="outline" asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" />
                {preview ? "Change Logo" : "Upload Logo"}
              </span>
            </Button>
          </Label>
          {helperText && (
            <p className="text-sm text-muted-foreground mt-1">{helperText}</p>
          )}
        </div>
      </div>
      {!isValid && errors.length > 0 && (
        <p className="text-sm text-destructive">{errors[0].message}</p>
      )}
    </div>
  );
};

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

export const PlanSelectionField = ({ plans }: { plans: Plan[] }) => {
  const { state, handleChange } = useFieldContext<string>();
  const { errors, isValid } = state.meta;
  const { value } = state;

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all ${value === plan.id
            ? "border-primary bg-primary/5"
            : "border-muted hover:border-primary/50"
            }`}
          onClick={() => handleChange(plan.id)}>
          {plan.popular && (
            <Badge className="absolute top-4 right-4">Most Popular</Badge>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-1">
                <span className="text-2xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>

            {value === plan.id && (
              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Features:</h4>
            <ul className="grid gap-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {!isValid && errors.length > 0 && (
        <p className="text-sm text-destructive mt-4">{errors[0] as string}</p>
      )}
    </div>
  );
};

function SubscribeButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button disabled={isSubmitting} className="w-full">
          {label}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </form.Subscribe>
  );
}

// Allow us to bind components to the form to keep type safety but reduce production boilerplate
// Define this once to have a generator of consistent form instances throughout your app
const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField: TextField,
    NumberField: TextField,
    AvatarUploaderField: AvatarUploaderField,
    PlanSelectionField: PlanSelectionField,
    PasswordField: PasswordField,
  },
  formComponents: {
    SubmitButton: SubscribeButton,
  },
  fieldContext,
  formContext,
});

export { useAppForm };
