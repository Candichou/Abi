"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <>
      <button
        onClick={handleLogout}
        className="w-full py-4 px-6 rounded-full font-heading font-bold text-forest bg-white border-2 border-forest hover:bg-forest/5 active:bg-forest/10 transition flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2"
        aria-label="Se déconnecter"
        aria-hidden="true"
      >
        se deconnecter
      </button>
    </>
  );
}
