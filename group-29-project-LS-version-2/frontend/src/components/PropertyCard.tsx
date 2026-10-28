"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { navigateWithTransition, propertyImageViewTransitionName } from "@/lib/navigation";
import { useReducedMotion } from "@/lib/motion";

export interface PropertyCardData {
  slug: string;
  title: string;
  city: string;
  country: string;
  pricePerNight: number;
  maxGuests: number;
  averageRating: number | null;
  reviewCount: number;
  images: Array<{ url: string; alt: string }>;
}

const nightlyPrice = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function PropertyCard({ property }: { property: PropertyCardData }) {
  const image = property.images[0];
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const href = `/stays/${encodeURIComponent(property.slug)}`;

  function openProperty(event: React.MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigateWithTransition(router, href, reducedMotion);
  }

  return (
    <article data-property-card className="group min-w-0">
      <Link
        href={href}
        onClick={openProperty}
        className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
      >
        <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl bg-[#e7e5dc] shadow-sm transition-shadow group-hover:shadow-lg" style={{ viewTransitionName: propertyImageViewTransitionName(property.slug) }}>
          {image ? (
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              unoptimized
            />
          ) : (
            <div className="flex h-full flex-col justify-end bg-[linear-gradient(145deg,#d9dfd4,#c5cabb_50%,#b4b8aa)] p-6">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">
                StayNest · {property.city}
              </span>
              <span className="mt-1 text-lg font-medium text-ink/90">
                A considered place to pause
              </span>
            </div>
          )}
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">
              {property.city}, {property.country}
            </p>
            <h2 className="mt-1 truncate text-sm text-muted">{property.title}</h2>
          </div>
          <p className="shrink-0 text-sm text-ink" aria-label={
            property.averageRating === null
              ? "No guest rating yet"
              : `${property.averageRating.toFixed(1)} out of 5 from ${property.reviewCount} reviews`
          }>
            <span aria-hidden="true">★</span>{" "}
            {property.averageRating === null ? "New" : property.averageRating.toFixed(1)}
          </p>
        </div>

        <p className="mt-2 text-sm text-muted">
          Up to {property.maxGuests} guests
        </p>
        <p className="mt-2 text-sm text-ink">
          <span className="font-semibold">{nightlyPrice.format(property.pricePerNight)}</span>
          <span className="text-muted"> / night</span>
        </p>
      </Link>
    </article>
  );
}
