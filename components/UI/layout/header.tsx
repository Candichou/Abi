import Link from "next/link";
import { HeaderAuth } from "./HeaderAuth";

export default function Header() {
  return (
    <header className="bg-forest py-3 px-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="font-heading font-bold text-cream text-h1">
          Abi.
        </Link>
        <HeaderAuth />
      </div>
    </header>
  );
}
