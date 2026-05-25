import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PagePatient } from "@/components/dashboard/UserPatient/PagePatient";
import { PageAsso } from "@/components/dashboard/UserAsso/PageAsso";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/signin");

  if (session.user.role === "patient") return <PagePatient session={session} />;
  if (session.user.role === "asso") return <PageAsso session={session} />;

  redirect("/");
}
