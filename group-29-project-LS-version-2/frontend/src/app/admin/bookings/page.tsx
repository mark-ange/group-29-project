import { auth } from "@/auth";
import { cancelBookingAction } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";

export default async function AdminBookingsPage() {
  const session = await auth();
  if (!session?.user) return null;
  const bookings = await prisma.booking.findMany({ where: session.user.role === "ADMIN" ? {} : { property: { ownerId: session.user.id } }, orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, email: true } }, property: { select: { title: true } } } });
  return <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8"><h1 className="text-3xl font-medium">Bookings</h1>{bookings.length ? <div className="mt-7 space-y-3">{bookings.map((booking) => <article key={booking.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5"><div><p className="font-semibold">{booking.property.title}</p><p className="mt-1 text-sm text-muted">{booking.user.name} · {booking.user.email}</p><p className="mt-1 text-xs text-muted">{booking.checkIn.toLocaleDateString()} – {booking.checkOut.toLocaleDateString()} · {booking.status}</p></div>{booking.status !== "CANCELLED" && <form action={cancelBookingAction}><input type="hidden" name="bookingId" value={booking.id} /><button className="rounded-full border border-stone-300 px-4 py-2 text-sm hover:border-red-500 hover:text-red-700">Cancel booking</button></form>}</article>)}</div> : <p className="mt-6 text-sm text-muted">No bookings yet.</p>}</main>;
}
