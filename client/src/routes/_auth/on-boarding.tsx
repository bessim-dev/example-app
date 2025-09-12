import Step1GeneralInfo from "@/components/organizations/onboarding/organization-info";
import Step2PlanSelection from "@/components/organizations/onboarding/plan-selection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateOrganization } from "@/lib/admin";
import { useGetPlans } from "@/lib/plans";
import { createFileRoute, redirect, useNavigate, useSearch } from "@tanstack/react-router";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { z } from "zod";
export const Route = createFileRoute("/_auth/on-boarding")({
  validateSearch: z.object({
    redirect: z.string().optional(),
    organizationId: z.string().optional(),
  }),
  beforeLoad: ({ context }) => {
    if (context.auth.activeOrganization) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: OnboardingPage,
});

type OrgData = { name: string; slug: string; logo?: string };

function OnboardingPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [org, setOrg] = useState<OrgData | null>(null);
  const navigate = useNavigate({ from: "/on-boarding" });
  const { organizationId } = useSearch({ from: "/_auth/on-boarding" });
  const { mutateAsync: createOrganization } = useCreateOrganization();
  const { mutateAsync: getPlans } = useGetPlans();
  const steps = [
    { id: 1 as const, label: "Organization" },
    { id: 2 as const, label: "Plan" },
  ];

  return (
    <motion.div
      className="relative min-h-svh w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}>
      {/* Gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 right-1/3 h-[28rem] w-[28rem] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="mx-auto grid min-h-svh container place-items-center px-4 py-10">
        <div className="w-full">
          {/* Step header */}
          <Card className="mb-6 border-none bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-xl">
                Let’s get you set up
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center gap-3">
              {steps.map((s, idx) => (
                <div key={s.id} className="flex items-center gap-3">
                  <div
                    className={
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm " +
                      (step > s.id
                        ? "bg-primary text-primary-foreground"
                        : step === s.id
                          ? "bg-primary/90 text-primary-foreground"
                          : "bg-muted text-muted-foreground")
                    }>
                    {step > s.id ? <CheckCircle2 className="h-4 w-4" /> : s.id}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {s.label}
                  </span>
                  {idx < steps.length - 1 && (
                    <div className="h-px w-12 bg-border" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Steps */}
          <AnimatePresence initial={false} mode="wait">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ x: -300, opacity: 0, scale: 0.98, rotateY: -10 }}
                animate={{ x: 0, opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ x: 300, opacity: 0, scale: 0.98, rotateY: 10 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}>
                <Step1GeneralInfo
                  handleSubmit={async (value) => {
                    const data = await createOrganization(value);
                    navigate({
                      search: {
                        organizationId: data.id,
                      }
                    })
                    setOrg(value);
                    setStep(2);
                  }}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ x: 300, opacity: 0, scale: 0.98, rotateY: 10 }}
                animate={{ x: 0, opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ x: -300, opacity: 0, scale: 0.98, rotateY: -10 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}>
                <div className="mx-auto">
                  <Step2PlanSelection
                    handleSubmit={async (value) => {
                      // Combine data and proceed. Replace with real API call when available.
                      const payload = {
                        ...(org ?? {}),
                        plan: value.plan,
                      } as const;
                      // eslint-disable-next-line no-console
                      console.log("onboarding payload", payload);
                      const data = await getPlans({ plan: value.plan as "free" | "pro" | "enterprise" });
                      console.log("data", data);
                      setStep(3);
                      setTimeout(() => {
                        navigate({ to: "/dashboard" });
                      }, 800);
                    }}
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => setStep(1)}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}>
                <Card className="border-none bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      You're all set!
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      We’re finalizing your workspace. You’ll be redirected
                      shortly.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default OnboardingPage;
