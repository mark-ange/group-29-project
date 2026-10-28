import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BookingForm } from "@/components/BookingForm";
import { PropertyParallax } from "@/components/PropertyParallax";
import { SiteHeader } from "@/components/SiteHeader";
import { ApiError } from "@/lib/api-error";
import { propertyImageViewTransitionName } from "@/lib/navigation";
import { getPropertyBySlug } from "@/lib/services/properties";

type PageProps = { params: Promise<{ slug: string }> };
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

async function loadProperty(slug: string) {
  try {
    return await getPropertyBySlug(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await loadProperty(slug);
  const image = property.images[0];
  return {
    title: property.title,
    description: `${property.description.slice(0, 150)}${property.description.length > 150 ? "…" : ""}`,
    alternates: { canonical: `/stays/${encodeURIComponent(property.slug)}` },
    openGraph: { title: property.title, description: property.description, type: "article", images: image ? [{ url: image.url, alt: image.alt }] : [] },
  };
}

export default async function StayPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await loadProperty(slug);
  const firstImage = property.images[0];
  const viewName = propertyImageViewTransitionName(property.slug);
  const amenities = property.amenities.split(",").map((item) => item.trim()).filter(Boolean);

  return <>
    <SiteHeader />
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <Link href="/" className="text-sm font-medium text-muted hover:text-ink">← Back to stays</Link>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{property.city}, {property.country}</p><h1 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">{property.title}</h1></div>
        <p className="text-sm text-muted">{property.maxGuests} guests · {property.bedrooms} bedrooms · {property.bathrooms} bathrooms</p>
      </div>
      <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_350px] lg:items-start">
        <div>
          <PropertyParallax src={firstImage?.url} alt={firstImage?.alt ?? `${property.title} exterior`} viewTransitionName={viewName} />
          {property.images.length > 1 && <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">{property.images.slice(1, 4).map((image) => <div key={image.id} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-200"><Image src={image.url} alt={image.alt} fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover" unoptimized /></div>)}</div>}
          <section className="mt-8 border-b border-stone-200 pb-8"><h2 className="text-xl font-semibold">About this place</h2><p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-7 text-muted">{property.description}</p></section>
          {amenities.length > 0 && <section className="border-b border-stone-200 py-8"><h2 className="text-xl font-semibold">What this place offers</h2><ul className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">{amenities.map((amenity) => <li key={amenity} className="rounded-xl bg-white px-4 py-3">{amenity}</li>)}</ul></section>}
          <section className="py-8"><h2 className="text-xl font-semibold">Guest reviews</h2>{property.reviews.length ? <div className="mt-4 grid gap-4 sm:grid-cols-2">{property.reviews.map((review) => <article key={review.id} className="rounded-2xl border border-stone-200 bg-white p-5"><p className="font-medium">{review.rating} / 5 · {review.authorDisplayName}</p><p className="mt-2 text-sm leading-6 text-muted">{review.comment}</p></article>)}</div> : <p className="mt-3 text-sm text-muted">No reviews yet.</p>}</section>
        </div>
        <aside className="lg:sticky lg:top-6"><BookingForm propertyId={property.id} slug={property.slug} pricePerNight={property.pricePerNight} maxGuests={property.maxGuests} /><p className="mt-4 text-center text-xs text-muted">{money.format(property.pricePerNight)} per night · secure booking</p></aside>
      </div>
    </main>
  </>;
}
