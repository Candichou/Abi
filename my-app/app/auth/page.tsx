"use client";

import { useState } from "react";
import SignupCredentials from "@/components/SignupCredentials";
import { SignUpRoleSelector } from "@/components/SignUpRoleSelector";

type Role = "patient" | "association";

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
          onNext={(role: Role) => {
            setData((prev) => ({ ...prev, role }));
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <SignupCredentials
          role={data.role!}
          disabled={(isLoading) => {
            setData((prev) => ({ ...prev }));
            setStep(3);
          }}
          onBack={() => setStep(1)}
        />
      )}
    </main>
  );
}
