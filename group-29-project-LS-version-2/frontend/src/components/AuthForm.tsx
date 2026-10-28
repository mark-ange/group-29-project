"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function AuthForm({ mode, returnTo = "/account" }: { mode: "login" | "register"; returnTo?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const isRegister = mode === "register";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");

    try {
      if (isRegister) {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: String(form.get("name") ?? "").trim(), email, password }),
        });
        if (!response.ok) throw new Error("REGISTER_FAILED");
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        redirectTo: returnTo,
      });
      if (!result || result.error) throw new Error("INVALID_CREDENTIALS");
      router.replace(result.url ?? returnTo);
      router.refresh();
    } catch {
      setError(isRegister ? "Could not create your account. Check your details and try again." : "Invalid email or password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-[75vh] items-center justify-center px-5 py-12">
      <section className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-7 shadow-sm sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">StayNest account</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight">{isRegister ? "Create your account" : "Welcome back"}</h1>
        <p className="mt-2 text-sm leading-6 text-muted">{isRegister ? "Save your favorite places and plan a thoughtful stay." : "Sign in to continue to your StayNest account."}</p>
        <form className="mt-7 space-y-4" onSubmit={submit}>
          {isRegister && (
            <label className="block text-sm font-medium">
              Name
              <input name="name" autoComplete="name" required maxLength={100} className="mt-2 min-h-11 w-full rounded-xl border border-stone-300 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent" />
            </label>
          )}
          <label className="block text-sm font-medium">
            Email
            <input name="email" type="email" autoComplete="email" required maxLength={254} className="mt-2 min-h-11 w-full rounded-xl border border-stone-300 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent" />
          </label>
          <label className="block text-sm font-medium">
            Password
            <input name="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} required minLength={isRegister ? 10 : 1} maxLength={128} className="mt-2 min-h-11 w-full rounded-xl border border-stone-300 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent" />
            {isRegister && <span className="mt-1 block text-xs font-normal text-muted">Use at least 10 characters.</span>}
          </label>
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
          <button disabled={busy} className="min-h-12 w-full rounded-full bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-[#9d452e] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
            {busy ? "Please wait…" : isRegister ? "Create account" : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          {isRegister ? "Already have an account? " : "New to StayNest? "}
          <Link className="font-semibold text-ink underline underline-offset-4" href={isRegister ? `/login?returnTo=${encodeURIComponent(returnTo)}` : `/register?returnTo=${encodeURIComponent(returnTo)}`}>
            {isRegister ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </section>
    </main>
  );
}
