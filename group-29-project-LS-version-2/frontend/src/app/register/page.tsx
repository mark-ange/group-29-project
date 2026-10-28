import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

function safeReturnTo(value?: string) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/account";
}

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const { returnTo } = await searchParams;
  return <><header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8"><Link href="/" className="text-xl font-semibold tracking-[-0.06em]">staynest<span className="text-accent">.</span></Link><Link href="/" className="text-sm text-muted hover:text-ink">Back to stays</Link></header><AuthForm mode="register" returnTo={safeReturnTo(returnTo)} /></>;
}
