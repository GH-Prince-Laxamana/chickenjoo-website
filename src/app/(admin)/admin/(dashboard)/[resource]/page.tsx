import { notFound, redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth/session";
import { isResource } from "@/lib/admin/fields";
import AdminManager from "@/components/admin/AdminManager";
export default async function AdminResource({ params }: { params: Promise<{ resource: string }> }) {
  if (!await getAdmin()) redirect("/admin/login");
  const { resource } = await params;
  if (!isResource(resource)) notFound();
  return <AdminManager resource={resource} key={resource} />;
}
