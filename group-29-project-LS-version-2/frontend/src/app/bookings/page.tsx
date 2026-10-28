import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Your bookings", alternates: { canonical: "/bookings" } };
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default async function BookingsPage() {
  const session = await auth();
  const bookings = await prisma.booking.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, checkIn: true, checkOut: true, guests: true, totalPrice: true, status: true, property: { select: { slug: true, title: true, city: true, country: true, images: { orderBy: { sortOrder: "asc" }, take: 1, select: { url: true, alt: true } } } } },
  });

  return <main className="mx-auto max-w-5xl px-5 py-14 sm:px-8"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Your trips</p><h1 className="mt-3 text-3xl font-medium tracking-tight">Bookings</h1>{bookings.length ? <div className="mt-7 space-y-4">{bookings.map((booking) => <article key={booking.id} className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">{booking.property.title}</p><p className="mt-1 text-sm text-muted">{booking.property.city}, {booking.property.country} · {booking.checkIn.toLocaleDateString()} – {booking.checkOut.toLocaleDateString()}</p><p className="mt-1 text-xs uppercase tracking-wide text-muted">{booking.status.toLowerCase()} · {booking.guests} guests</p></div><div className="flex items-center justify-between gap-4"><p className="text-sm font-semibold">{money.format(booking.totalPrice)}</p><Link href={`/bookings/${encodeURIComponent(booking.id)}`} className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium hover:border-ink">View</Link></div></article>)}</div> : <section className="mt-7 rounded-3xl border border-stone-200 bg-white px-6 py-12 text-center"><h2 className="text-xl font-medium">No bookings yet</h2><p className="mt-2 text-sm text-muted">Your next thoughtful stay is waiting.</p><Link href="/" className="mt-5 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-medium text-white hover:bg-accent">Explore stays</Link></section>}</main>;
}
