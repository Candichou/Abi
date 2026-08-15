"use client";

import { UserCircleIcon, UserGroupIcon } from "@heroicons/react/24/solid";

import { useState } from "react";
import Button from "@/components/common/Button";
import type { Role } from "@/lib/validations/role";

interface SignUpRoleSelectorProps {
  onNext: (role: Role) => void;
}

export function SignUpRoleSelector({ onNext }: SignUpRoleSelectorProps) {
  const [selected, setSelected] = useState<Role | null>(null);

  function handleContinue() {
    if (selected) onNext(selected);
  }
  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto px-4 py-8">
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
          disabled
          disabledReason="Bientôt disponible"
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
  disabled?: boolean;
  disabledReason?: string;
}

function RoleCard({
  role,
  selected,
  onChange,
  icon,
  title,
  description,
  disabled = false,
  disabledReason,
}: RoleCardProps) {
  const isSelected = selected === role;

  return (
    <button
      type="button"
      onClick={() => {
        if (!disabled) onChange(role);
      }}
      aria-pressed={isSelected}
      aria-disabled={disabled}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      className={`
        flex items-center gap-4 w-full text-left
        rounded-2xl border-2 p-4 min-h-11
        transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2
        ${
          disabled
            ? "border-forest/10 bg-forest/5 cursor-not-allowed"
            : isSelected
              ? "border-forest bg-white"
              : "border-forest/20 bg-white hover:border-forest/50"
        }
      `}
    >
      <span className={`shrink-0 ${disabled ? "text-forest/70" : "text-forest"}`}>
        {icon}
      </span>
      <span className="flex flex-col gap-1">
        <span className="flex items-center gap-2">
          <span
            className={`font-heading font-bold text-[16px] ${
              disabled ? "text-forest/70" : "text-forest"
            }`}
          >
            {title}
          </span>
          {disabled && disabledReason && (
            <span className="font-body text-[11px] font-bold uppercase tracking-wide text-forest/70 bg-forest/10 rounded-full px-2 py-0.5">
              {disabledReason}
            </span>
          )}
        </span>
        <span
          className={`font-body text-[14px] ${
            disabled ? "text-forest/70" : "text-forest/70"
          }`}
        >
          {description}
        </span>
      </span>
    </button>
  );
}
