import Link from "next/link";

export function SiteFooter() {
  return <footer className="border-t border-stone-200 bg-paper"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8"><Link href="/" className="font-semibold tracking-[-0.04em] text-ink">staynest<span className="text-accent">.</span></Link><p>Thoughtful homes for the places that stay with you.</p><Link href="/" className="hover:text-ink">Browse stays</Link></div></footer>;
}
