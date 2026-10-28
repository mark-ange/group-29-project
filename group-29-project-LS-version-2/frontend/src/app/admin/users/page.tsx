import { updateUserRoleAction } from "@/app/admin/actions";
import { requireRoles } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  await requireRoles(["ADMIN"]);
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, name: true, email: true, role: true } });
  return <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8"><h1 className="text-3xl font-medium">Users</h1><div className="mt-7 divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">{users.map((user) => <div key={user.id} className="flex flex-wrap items-center justify-between gap-4 p-5"><div><p className="font-semibold">{user.name}</p><p className="text-sm text-muted">{user.email}</p></div><form action={updateUserRoleAction} className="flex items-center gap-2"><input type="hidden" name="userId" value={user.id} /><label className="sr-only" htmlFor={`role-${user.id}`}>Role for {user.email}</label><select id={`role-${user.id}`} name="role" defaultValue={user.role} className="min-h-10 rounded-lg border border-stone-300 px-2 text-sm"><option value="GUEST">Guest</option><option value="HOST">Host</option><option value="ADMIN">Admin</option></select><button className="rounded-full border border-stone-300 px-4 py-2 text-sm">Save role</button></form></div>)}</div></main>;
}
