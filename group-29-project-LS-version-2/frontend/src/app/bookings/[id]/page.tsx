import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ id: string }> };
export const metadata: Metadata = { title: "Booking details", robots: { index: false, follow: false } };
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default async function BookingDetailPage({ params }: PageProps) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  if (!session?.user?.id) notFound();
  const booking = await prisma.booking.findFirst({
    where: { id, ...(session.user.role === "ADMIN" ? {} : { userId: session.user.id }) },
    select: { id: true, checkIn: true, checkOut: true, guests: true, nights: true, totalPrice: true, status: true, property: { select: { slug: true, title: true, city: true, country: true } } },
  });
  if (!booking) notFound();

  return <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Booking received</p><h1 className="mt-3 text-3xl font-medium tracking-tight">Your stay is requested</h1><p className="mt-3 text-sm leading-6 text-muted">Your booking is pending confirmation. We’ll keep your trip details here.</p><section className="mt-7 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8"><h2 className="text-xl font-semibold">{booking.property.title}</h2><p className="mt-1 text-sm text-muted">{booking.property.city}, {booking.property.country}</p><dl className="mt-6 grid grid-cols-2 gap-4 text-sm"><div><dt className="text-muted">Check-in</dt><dd className="mt-1 font-medium">{booking.checkIn.toLocaleDateString()}</dd></div><div><dt className="text-muted">Check-out</dt><dd className="mt-1 font-medium">{booking.checkOut.toLocaleDateString()}</dd></div><div><dt className="text-muted">Guests</dt><dd className="mt-1 font-medium">{booking.guests}</dd></div><div><dt className="text-muted">Length</dt><dd className="mt-1 font-medium">{booking.nights} nights</dd></div></dl><div className="mt-6 flex justify-between border-t border-stone-200 pt-5 text-sm"><span>Total</span><strong>{money.format(booking.totalPrice)}</strong></div><p className="mt-3 text-xs uppercase tracking-wide text-muted">Status: {booking.status.toLowerCase()}</p></section><div className="mt-6 flex gap-3"><Link href="/bookings" className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white hover:bg-accent">All bookings</Link><Link href={`/stays/${encodeURIComponent(booking.property.slug)}`} className="rounded-full border border-stone-300 px-5 py-3 text-sm font-medium hover:border-ink">View stay</Link></div></main>;
}
