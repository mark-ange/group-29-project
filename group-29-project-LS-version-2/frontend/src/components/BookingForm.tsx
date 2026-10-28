"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function daysBetween(start: string, end: string) {
  if (!start || !end) return 0;
  return Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86_400_000);
}

export function BookingForm({ propertyId, slug, pricePerNight, maxGuests }: { propertyId: string; slug: string; pricePerNight: number; maxGuests: number }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const nights = useMemo(() => daysBetween(checkIn, checkOut), [checkIn, checkOut]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, checkIn, checkOut, guests: Number(guests) }),
      });
      if (response.status === 401) {
        router.push(`/login?returnTo=${encodeURIComponent(`/stays/${slug}`)}`);
        return;
      }
      const result = await response.json() as { booking?: { id: string }; error?: { code?: string } };
      if (response.status === 409 || result.error?.code === "DATES_UNAVAILABLE") {
        setError("Those dates are unavailable. Please choose another stay.");
        return;
      }
      if (!response.ok || !result.booking) {
        setError("We couldn’t complete your booking. Check your dates and try again.");
        return;
      }
      router.push(`/bookings/${encodeURIComponent(result.booking.id)}`);
      router.refresh();
    } catch {
      setError("We couldn’t complete your booking. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const minimum = new Date().toISOString().slice(0, 10);
  const total = nights > 0 ? pricePerNight * nights : null;

  return (
    <form onSubmit={submit} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_12px_42px_rgba(35,34,28,0.07)]">
      <p className="text-lg font-semibold">{money.format(pricePerNight)} <span className="text-sm font-normal text-muted">/ night</span></p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <label className="text-xs font-semibold">Check-in<input required type="date" min={minimum} value={checkIn} onChange={(event) => setCheckIn(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-stone-300 px-3 text-sm font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" /></label>
        <label className="text-xs font-semibold">Check-out<input required type="date" min={checkIn || minimum} value={checkOut} onChange={(event) => setCheckOut(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-stone-300 px-3 text-sm font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" /></label>
      </div>
      <label className="mt-3 block text-xs font-semibold">Guests<select value={guests} onChange={(event) => setGuests(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">{Array.from({ length: maxGuests }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1} {index === 0 ? "guest" : "guests"}</option>)}</select></label>
      {total !== null && nights > 0 && <p className="mt-4 flex justify-between border-t border-stone-200 pt-4 text-sm"><span>{money.format(pricePerNight)} × {nights} nights</span><span className="font-semibold">{money.format(total)}</span></p>}
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <button disabled={busy || nights < 1 || nights > 30} className="mt-5 min-h-12 w-full rounded-full bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-[#9d452e] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">{busy ? "Requesting…" : "Reserve this stay"}</button>
      <p className="mt-3 text-center text-xs leading-5 text-muted">You won’t be charged yet. Your dates are confirmed after the booking request is accepted.</p>
    </form>
  );
}
