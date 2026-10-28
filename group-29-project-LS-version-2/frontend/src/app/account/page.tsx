import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) return null;
  return <main className="mx-auto max-w-4xl px-5 py-14 sm:px-8"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Your account</p><h1 className="mt-3 text-3xl font-medium">Welcome, {session.user.name}</h1><p className="mt-3 text-sm text-muted">{session.user.email} · {session.user.role.toLowerCase()}</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/bookings" className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white hover:bg-accent">View bookings</Link><form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}><button className="rounded-full border border-stone-300 px-5 py-3 text-sm font-medium hover:border-ink">Sign out</button></form></div></main>;
}
