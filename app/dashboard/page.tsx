import { headers } from "next/headers";
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { PatientView } from "@/components/dashboard/patient/PatientView";
import { AssociationView } from "@/components/dashboard/association/AssociationView";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/signin");

  if (session.user.role === "patient") return <PatientView session={session} />;
  if (session.user.role === "association")
    return <AssociationView session={session} />;

  redirect("/");
}
