import { LoginForm } from "@/components/login-form";
import { SignUpForm } from "@/components/signup-form";
import {
  createFileRoute,
  redirect,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { z } from "zod";

export const Route = createFileRoute("/(auth)/login")({
  validateSearch: z.object({
    redirect: z.string().optional(),
    id: z.string().optional(),
    name: z.string().optional(),
    organizationId: z.string().optional(),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: search.redirect || "/dashboard",
      });
    }
  },
  component: LoginComponent,
});

function LoginComponent() {
  const [isSignUp, setIsSignUp] = useState(false);
  const search = useSearch({ from: "/(auth)/login" });
  const id = search.id;
  const name = search.name;
  const showOnboarding = id && name;
  const showPlans = search.organizationId;

  return (
    <motion.div
      className="grid min-h-svh lg:grid-cols-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}>
      <motion.div
        className="flex flex-col gap-4 p-6 md:p-10"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}>
        <motion.div
          className="flex justify-center gap-2 md:justify-start"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}>
          <motion.a
            href="#"
            className="flex items-center gap-2 font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}>
            <motion.div
              className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground"
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "backOut", delay: 0.6 }}>
              <GalleryVerticalEnd className="size-4" />
            </motion.div>
            <motion.span
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}>
              OCRus
            </motion.span>
          </motion.a>
        </motion.div>

        <motion.div
          className="flex flex-1 items-center justify-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1.0 }}>
          <div className="w-full">
            <AnimatePresence initial={false} mode="wait">
              {isSignUp ? (
                <motion.div
                  key="signup"
                  initial={{
                    x: 300,
                    opacity: 0,
                    scale: 0.95,
                    rotateY: 15,
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    scale: 1,
                    rotateY: 0,
                  }}
                  exit={{
                    x: -300,
                    opacity: 0,
                    scale: 0.95,
                    rotateY: -15,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}>
                  <SignUpForm />
                </motion.div>
              ) : (
                <motion.div
                  key="login"
                  initial={{
                    x: -300,
                    opacity: 0,
                    scale: 0.95,
                    rotateY: -15,
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    scale: 1,
                    rotateY: 0,
                  }}
                  exit={{
                    x: 300,
                    opacity: 0,
                    scale: 0.95,
                    rotateY: 15,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}>
                  <LoginForm />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          className="text-center text-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1.2 }}>
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <motion.span
            className="underline underline-offset-4 cursor-pointer hover:text-primary transition-colors"
            onClick={() => setIsSignUp(!isSignUp)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}>
            {isSignUp ? "Sign in" : "Sign up"}
          </motion.span>
        </motion.div>
      </motion.div>

      <motion.div
        className="relative hidden bg-muted lg:block"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}>
        <motion.img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.8 }}
        />
      </motion.div>
    </motion.div>
  );
}
