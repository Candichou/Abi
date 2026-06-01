"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface UserMenuProps {
  userName: string;
}

export function UserMenu({ userName }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/"),
      },
    });
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Menu de ${userName}`}
        className="bg-lavender text-forest rounded-full px-2 py-2 md:px-4 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-lavender focus:ring-offset-2 focus:ring-offset-forest transition-opacity hover:opacity-90"
      >
        <span
          aria-hidden="true"
          className="w-5 h-5 rounded-full bg-forest text-cream flex items-center justify-center text-[11px] font-bold font-heading shrink-0"
        >
          {userName.charAt(0).toUpperCase()}
        </span>
        <span className="hidden md:inline text-sm font-heading font-bold">
          {userName}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label={`Menu de ${userName}`}
          className="absolute right-0 mt-2 w-44 bg-cream rounded-2xl shadow-lg border border-forest/10 overflow-hidden z-50"
        >
          <Link
            href="/dashboard"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center px-4 py-3 text-sm font-heading font-bold text-forest hover:bg-forest/5 transition-colors"
          >
            Mon profil
          </Link>
          <div className="h-px bg-forest/10" role="separator" />
          <button
            role="menuitem"
            onClick={handleLogout}
            className="w-full text-left flex items-center px-4 py-3 text-sm font-heading font-bold text-forest hover:bg-forest/5 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}
