import Link from "next/link";
import { auth, signOut } from "@/auth";

export async function SiteHeader() {
  const session = await auth();
  return (
    <header className="border-b border-stone-200/80 bg-paper">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <Link href="/" className="shrink-0 text-xl font-semibold tracking-[-0.06em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4">staynest<span className="text-accent">.</span></Link>
        <p className="hidden text-xs font-medium uppercase tracking-[0.16em] text-muted sm:block">Places with a sense of place</p>
        <nav aria-label="Account" className="flex items-center gap-2">
          {session?.user ? <>
            {session.user.role !== "GUEST" && <Link href="/admin" className="rounded-full px-3 py-2 text-sm font-medium hover:bg-white">Host tools</Link>}
            <Link href="/bookings" className="rounded-full px-3 py-2 text-sm font-medium hover:bg-white">Trips</Link>
            <Link href="/account" className="rounded-full px-3 py-2 text-sm font-medium hover:bg-white">Account</Link>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}><button className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium hover:border-ink">Sign out</button></form>
          </> : <>
            <Link href="/login" className="rounded-full px-3 py-2 text-sm font-medium hover:bg-white">Sign in</Link>
            <Link href="/register" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-accent">Join</Link>
          </>}
        </nav>
      </div>
    </header>
  );
}
