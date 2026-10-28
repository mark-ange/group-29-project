"use client";

export default function HomeError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-5 py-16">
      <section
        className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm sm:p-12"
        role="alert"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Something went wrong
        </p>
        <h1 className="mt-3 text-2xl font-medium tracking-tight">
          We couldn’t load the stays
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Please try again. Your search filters will remain in the address bar.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-7 min-h-11 rounded-full bg-ink px-6 text-sm font-medium text-white hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
