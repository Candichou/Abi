"use client";

import { useState } from "react";

import SignInForm from "@/components/auth/SignInForm";
import { SignUpRoleSelector } from "@/components/auth/SignUpRoleSelector";
import SignupCredentials from "@/components/auth/SignupCredentials";
import type { Role } from "@/lib/validations/role";

type StepData = {
  role?: Role;
  name?: string;
  email?: string;
  password?: string;
};

export default function AuthPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<StepData>({});
  const [mode, _setMode] = useState<"signup" | "signin">("signup");
  const [_isLoading, setIsLoading] = useState(false);

  return (
    <main className="min-h-screen bg-cream flex flex-col">
      {mode === "signin" && <SignInForm />}
      {mode === "signup" && (
        <>
          {step === 1 && (
            <SignUpRoleSelector
              onNext={(role) => {
                setData((prev) => ({ ...prev, role }));
                setStep(2);
              }}
            />
          )}
          {step === 2 && (
            <SignupCredentials
              role={data.role!}
              onBack={() => setStep(1)}
              disabled={(loading) => setIsLoading(loading)}
            />
          )}
        </>
      )}
    </main>
  );
}
