"use client";

import { UserCircleIcon, UserGroupIcon } from "@heroicons/react/24/solid";

import { useState } from "react";
import Button from "../UI/Button";

type Role = "patient" | "association";

interface SignUpRoleSelectorProps {
  onNext: (role: Role) => void;
}

export function SignUpRoleSelector({ onNext }: SignUpRoleSelectorProps) {
  const [selected, setSelected] = useState<Role | null>(null);

  function handleContinue() {
    if (selected) onNext(selected);
  }
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading font-bold text-h2 text-forest">
          Créer un compte
        </h1>
        <p className="font-body text-[14px] text-forest/70 mt-1">
          Vous êtes… ? Votre parcours sera adapté à votre profil.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <RoleCard
          role="patient"
          selected={selected}
          onChange={setSelected}
          icon={<UserCircleIcon className="w-6 h-6" aria-hidden="true" />}
          title="Particulier"
          description="Je cherche un praticien bienveillant"
        />
        <RoleCard
          role="association"
          selected={selected}
          onChange={setSelected}
          icon={<UserGroupIcon className="w-6 h-6" aria-hidden="true" />}
          title="Association"
          description="Je contribue à enrichir la base de données"
        />
      </div>
      <Button onClick={handleContinue} disabled={!selected}>
        Continuer
      </Button>
    </div>
  );
}

interface RoleCardProps {
  role: Role;
  selected: Role | null;
  onChange: (role: Role) => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function RoleCard({
  role,
  selected,
  onChange,
  icon,
  title,
  description,
}: RoleCardProps) {
  const isSelected = selected === role;

  return (
    <button
      type="button"
      onClick={() => onChange(role)}
      aria-pressed={isSelected}
      className={`
        flex items-center gap-4 w-full text-left
        rounded-2xl border-2 p-4 min-h-11
        transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2
        ${
          isSelected
            ? "border-forest bg-white"
            : "border-forest/20 bg-white hover:border-forest/50"
        }
      `}
    >
      <span className="text-forest shrink-0">{icon}</span>
      <span className="flex flex-col">
        <span className="font-heading font-bold text-[16px] text-forest">
          {title}
        </span>
        <span className="font-body text-[14px] text-forest/70">
          {description}
        </span>
      </span>
    </button>
  );
}
