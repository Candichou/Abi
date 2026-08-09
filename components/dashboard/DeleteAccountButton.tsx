"use client";

import { useState } from "react";
import { DeleteAccountModal } from "./DeleteAccountModal";

export function DeleteAccountButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full py-3 px-6 rounded-full font-heading font-bold text-red-600 bg-white border-2 border-red-200 hover:bg-red-50 transition-colors"
      >
        Supprimer mon compte
      </button>
      {showModal && (
        <DeleteAccountModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
