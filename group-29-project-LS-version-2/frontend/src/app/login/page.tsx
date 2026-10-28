import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";

function safeReturnTo(value?: string) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/account";
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ returnTo?: string; error?: string }> }) {
  const { returnTo, error } = await searchParams;
  return <><header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8"><Link href="/" className="text-xl font-semibold tracking-[-0.06em]">staynest<span className="text-accent">.</span></Link><Link href="/" className="text-sm text-muted hover:text-ink">Back to stays</Link></header><LoginForm returnTo={safeReturnTo(returnTo)} error={error === "1"} /></>;
}
