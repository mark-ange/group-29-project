import Link from "next/link";

export default function ForbiddenPage() {
  return <main className="flex min-h-screen items-center justify-center px-5 py-16"><section className="max-w-lg text-center"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">403 · Access denied</p><h1 className="mt-3 text-3xl font-medium tracking-tight">This area is for property hosts</h1><p className="mt-3 text-sm leading-6 text-muted">Your account does not have permission to open this page.</p><Link href="/" className="mt-7 inline-flex min-h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-white hover:bg-accent">Return home</Link></section></main>;
}
