import { headers } from "next/headers";
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import EditProfileForm from "@/components/dashboard/EditProfileForm";

export default async function EditProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "patient") redirect("/");

  return (
    <main className="min-h-screen bg-cream">
      <div className="bg-forest text-cream px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-heading font-bold">
            Modifier mon pseudonyme
          </h1>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
        <EditProfileForm session={session} />
      </div>
    </main>
  );
}
