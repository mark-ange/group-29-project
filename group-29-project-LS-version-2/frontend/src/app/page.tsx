import { Suspense } from "react";
import Link from "next/link";
import { PropertyCard } from "../components/PropertyCard";
import { AnimatedHeadline } from "../components/AnimatedHeadline";
import { AnimatedPropertyGrid } from "../components/AnimatedPropertyGrid";
import { SiteHeader } from "../components/SiteHeader";
import {
  listProperties,
  propertyFiltersSchema,
  type PropertyFilters,
} from "../lib/services/properties";

type SearchParamValue = string | string[] | undefined;

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: Promise<Record<string, SearchParamValue>>;
}

function firstValue(value: SearchParamValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function buildPageHref(
  page: number,
  searchParams: Record<string, SearchParamValue>,
): string {
  const query = new URLSearchParams();
  for (const [key, rawValue] of Object.entries(searchParams)) {
    const value = firstValue(rawValue);
    if (value && key !== "page") {
      query.set(key, value);
    }
  }
  query.set("page", String(page));
  query.set("pageSize", "12");
  return `/?${query.toString()}`;
}

function PropertyGridSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Loading stays"
      aria-busy="true"
    >
      {Array.from({ length: 12 }, (_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-[4/3] rounded-2xl bg-stone-200" />
          <div className="mt-4 h-4 w-2/3 rounded bg-stone-200" />
          <div className="mt-2 h-4 w-1/2 rounded bg-stone-200" />
          <div className="mt-4 h-4 w-1/3 rounded bg-stone-200" />
        </div>
      ))}
    </div>
  );
}

async function PropertyResults({
  filters,
  searchParams,
}: {
  filters: PropertyFilters | null;
  searchParams: Record<string, SearchParamValue>;
}) {
  const result = filters
    ? await listProperties({ ...filters, pageSize: 12 })
    : { items: [], total: 0, page: 1, pageSize: 12 };

  if (result.items.length === 0) {
    return (
      <section className="rounded-3xl border border-stone-200 bg-white px-6 py-16 text-center sm:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          No stays found
        </p>
        <h2 className="mt-3 text-2xl font-medium tracking-tight">
          Try opening up your search
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
          No published homes match those details. Clear the filters to see all
          available stays.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-6 text-sm font-medium text-white transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          Clear filters
        </Link>
      </section>
    );
  }

  const firstResult = (result.page - 1) * result.pageSize + 1;
  const lastResult = Math.min(result.page * result.pageSize, result.total);

  return (
    <>
      <div className="mb-6 flex items-end justify-between gap-4">
        <p className="text-sm text-muted">
          Showing <span className="font-semibold text-ink">{firstResult}–{lastResult}</span>{" "}
          of <span className="font-semibold text-ink">{result.total}</span> stays
        </p>
      </div>
      <AnimatedPropertyGrid>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </AnimatedPropertyGrid>
      <nav
        className="mt-12 flex items-center justify-between border-t border-stone-200 pt-6"
        aria-label="Property result pages"
      >
        {result.page > 1 ? (
          <Link
            href={buildPageHref(result.page - 1, searchParams)}
            rel="prev"
            className="inline-flex min-h-11 items-center rounded-full border border-stone-300 bg-white px-5 text-sm font-medium hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Previous
          </Link>
        ) : (
          <span />
        )}
        {result.page * result.pageSize < result.total ? (
          <Link
            href={buildPageHref(result.page + 1, searchParams)}
            rel="next"
            className="inline-flex min-h-11 items-center rounded-full border border-stone-300 bg-white px-5 text-sm font-medium hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Next
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </>
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const rawSearchParams = await searchParams;
  const normalizedParams = Object.fromEntries(
    Object.entries(rawSearchParams).flatMap(([key, rawValue]) => {
      const value = firstValue(rawValue)?.trim();
      return value ? [[key, value]] : [];
    }),
  );
  const parsedFilters = propertyFiltersSchema.safeParse({
    ...normalizedParams,
    city: normalizedParams.destination ?? normalizedParams.city,
    pageSize: "12",
  });
  const filters = parsedFilters.success ? parsedFilters.data : null;

  return (
    <main className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-8 sm:pb-14 sm:pt-20">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Find your somewhere
          </p>
          <AnimatedHeadline words={["Stay", "somewhere", "that", "stays", "with", "you."]} breakAfter={1} className="mt-4 text-4xl font-medium leading-[1.08] tracking-[-0.055em] sm:text-6xl" />
          <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">
            Thoughtful homes, quietly distinctive places, and room to make the
            trip your own.
          </p>
        </div>

        <form
          action="/"
          method="get"
          className="mt-9 grid gap-3 rounded-3xl border border-stone-200 bg-white p-4 shadow-[0_12px_42px_rgba(35,34,28,0.07)] sm:grid-cols-2 sm:p-5 lg:grid-cols-6"
        >
          <label className="flex min-w-0 flex-col gap-1 px-2 py-1 text-xs font-semibold text-ink">
            Destination
            <input
              name="destination"
              type="text"
              placeholder="City or region"
              defaultValue={normalizedParams.destination ?? normalizedParams.city ?? ""}
              className="min-h-10 rounded-lg border-0 bg-transparent px-0 text-sm font-normal outline-none placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-accent"
            />
          </label>
          <label className="flex min-w-0 flex-col gap-1 border-stone-200 px-2 py-1 text-xs font-semibold text-ink sm:border-l">
            Check-in
            <input
              name="checkIn"
              type="date"
              defaultValue={normalizedParams.checkIn ?? ""}
              className="min-h-10 w-full rounded-lg border-0 bg-transparent px-0 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </label>
          <label className="flex min-w-0 flex-col gap-1 border-stone-200 px-2 py-1 text-xs font-semibold text-ink sm:border-l">
            Check-out
            <input
              name="checkOut"
              type="date"
              defaultValue={normalizedParams.checkOut ?? ""}
              className="min-h-10 w-full rounded-lg border-0 bg-transparent px-0 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </label>
          <label className="flex min-w-0 flex-col gap-1 border-stone-200 px-2 py-1 text-xs font-semibold text-ink sm:border-l">
            Guests
            <input
              name="guests"
              type="number"
              min="1"
              step="1"
              placeholder="Any"
              defaultValue={normalizedParams.guests ?? ""}
              className="min-h-10 w-full rounded-lg border-0 bg-transparent px-0 text-sm font-normal outline-none placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-accent"
            />
          </label>
          <label className="flex min-w-0 flex-col gap-1 border-stone-200 px-2 py-1 text-xs font-semibold text-ink sm:border-l">
            Min price / night
            <input
              name="minPrice"
              type="number"
              min="0"
              step="1"
              placeholder="No minimum"
              defaultValue={normalizedParams.minPrice ?? ""}
              className="min-h-10 w-full rounded-lg border-0 bg-transparent px-0 text-sm font-normal outline-none placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-accent"
            />
          </label>
          <label className="flex min-w-0 flex-col gap-1 border-stone-200 px-2 py-1 text-xs font-semibold text-ink sm:border-l">
            Max price / night
            <input
              name="maxPrice"
              type="number"
              min="0"
              step="1"
              placeholder="No maximum"
              defaultValue={normalizedParams.maxPrice ?? ""}
              className="min-h-10 w-full rounded-lg border-0 bg-transparent px-0 text-sm font-normal outline-none placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-accent"
            />
          </label>
          <label className="flex min-w-0 flex-col gap-1 px-2 py-1 text-xs font-semibold text-ink sm:col-span-2 lg:col-span-2">
            Sort by
            <select
              name="sort"
              defaultValue={filters?.sort ?? "newest"}
              className="min-h-10 rounded-lg border-0 bg-transparent px-0 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <option value="newest">Recently added</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
          <input type="hidden" name="pageSize" value="12" />
          <button
            type="submit"
            className="min-h-12 rounded-full bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-[#9d452e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:col-span-2 lg:col-span-2"
          >
            Find stays
          </button>
        </form>
        {!parsedFilters.success && (
          <p className="mt-3 text-sm text-accent" role="status">
            Check your dates, guest count, and price range, then search again.
          </p>
        )}
      </section>

      <section id="stays" className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-stone-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              The collection
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight">
              Find a place to land
            </h2>
          </div>
          <p className="text-sm text-muted">Homes selected for how they feel</p>
        </div>
        <Suspense fallback={<PropertyGridSkeleton />}>
          <PropertyResults filters={filters} searchParams={rawSearchParams} />
        </Suspense>
      </section>
    </main>
  );
}
