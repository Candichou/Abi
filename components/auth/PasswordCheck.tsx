export function PasswordCheck({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-body">
      <span
        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
          met ? "bg-teal text-cream" : "bg-forest/10 text-forest/40"
        }`}
      >
        {met ? "✓" : "○"}
      </span>
      <span className={met ? "text-forest" : "text-forest/40"}>{label}</span>
    </div>
  );
}
