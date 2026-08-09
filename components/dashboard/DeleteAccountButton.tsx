"use client";

import { useState } from "react";
import { DeleteAccountModal } from "./DeleteAccountModal";

export function DeleteAccountButton({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={
          compact
            ? "py-2 px-4 rounded-full font-heading font-bold text-sm text-forest bg-teal/20 border border-teal/40 hover:bg-teal/30 transition-colors"
            : "w-full py-3 px-6 rounded-full font-heading font-bold text-red-600 bg-white border-2 border-red-200 hover:bg-red-50 transition-colors"
        }
      >
        Supprimer mon compte
      </button>
      {showModal && (
        <DeleteAccountModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
