import Link from "next/link";

export default function NotFound() {
  return <main className="flex min-h-[75vh] items-center justify-center px-5 py-16"><section className="max-w-lg text-center"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">404 · Not found</p><h1 className="mt-3 text-3xl font-medium tracking-tight">We couldn’t find that stay</h1><p className="mt-3 text-sm leading-6 text-muted">It may have been removed or the link may be out of date.</p><Link href="/" className="mt-7 inline-flex min-h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-white hover:bg-accent">Browse stays</Link></section></main>;
}
