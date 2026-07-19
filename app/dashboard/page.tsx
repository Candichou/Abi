import { headers } from "next/headers";
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { PagePatient } from "@/components/dashboard/patient/PatientView";
import { PageAssociation } from "@/components/dashboard/association/AssociationView";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/signin");

  if (session.user.role === "patient") return <PagePatient session={session} />;
  if (session.user.role === "association")
    return <PageAssociation session={session} />;

  redirect("/");
}
