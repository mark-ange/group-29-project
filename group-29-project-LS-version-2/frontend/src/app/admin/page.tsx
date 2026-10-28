import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { togglePropertyAction } from "@/app/admin/actions";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) return null;
  const properties = await prisma.property.findMany({
    where: session.user.role === "ADMIN" ? {} : { ownerId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { bookings: true } } },
  });
  const liveCount = properties.filter((property) => property.published).length;
  return <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Host workspace</p><h1 className="mt-2 text-3xl font-medium">Properties</h1><p className="mt-2 text-sm text-muted">Live listings: <strong>{liveCount}</strong></p></div><nav className="flex gap-2"><Link href="/admin/properties/new" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white">New property</Link><Link href="/admin/bookings" className="rounded-full border border-stone-300 px-4 py-2 text-sm">Bookings</Link>{session.user.role === "ADMIN" && <Link href="/admin/users" className="rounded-full border border-stone-300 px-4 py-2 text-sm">Users</Link>}</nav></div><div className="mt-7 overflow-x-auto rounded-2xl border border-stone-200 bg-white"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-stone-50 text-xs uppercase tracking-wide text-muted"><tr><th className="px-5 py-4">Property</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Price / night</th><th className="px-5 py-4">Bookings</th><th className="px-5 py-4">Actions</th></tr></thead><tbody>{properties.map((property) => <tr key={property.id} className="border-t border-stone-100"><td className="px-5 py-4"><p className="font-semibold">{property.title}</p><p className="mt-1 text-xs text-muted">{property.city}, {property.country}</p></td><td className="px-5 py-4">{property.published ? "Live" : "Draft"}</td><td className="px-5 py-4">${property.pricePerNight}</td><td className="px-5 py-4">{property._count.bookings}</td><td className="px-5 py-4"><div className="flex gap-3"><Link href={`/admin/properties/${property.id}/edit`} className="font-medium underline underline-offset-4">Edit</Link><form action={togglePropertyAction}><input type="hidden" name="propertyId" value={property.id} /><button className="font-medium underline underline-offset-4">{property.published ? "Unpublish" : "Publish"}</button></form></div></td></tr>)}</tbody></table></div></main>;
}
