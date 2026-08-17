"use client";

import { useState } from "react";

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

  return (
    <main className="min-h-screen bg-cream flex flex-col">
      {step === 1 && (
        <SignUpRoleSelector
          onNext={(role) => {
            setData((prev) => ({ ...prev, role }));
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <SignupCredentials role={data.role!} onBack={() => setStep(1)} />
      )}
    </main>
  );
}
