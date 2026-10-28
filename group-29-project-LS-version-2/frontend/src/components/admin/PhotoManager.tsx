"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Photo = { id: string; url: string; alt: string; kind: string; sortOrder: number };

export function PhotoManager({ propertyId, photos }: { propertyId: string; photos: Photo[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const response = await fetch(`/api/admin/properties/${encodeURIComponent(propertyId)}/photos`, { method: "POST", body: new FormData(event.currentTarget) });
    const result = await response.json();
    setMessage(response.ok ? "Photos uploaded." : result.error?.message ?? "Upload failed.");
    if (response.ok) { event.currentTarget.reset(); router.refresh(); }
    setBusy(false);
  }

  async function updatePhoto(photo: Photo, patch: Partial<Photo>) {
    const updated = photos.map((entry) => ({ ...entry, ...(entry.id === photo.id ? patch : {}) })).sort((a, b) => a.sortOrder - b.sortOrder);
    const response = await fetch(`/api/admin/properties/${encodeURIComponent(propertyId)}/photos`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ images: updated.map((entry, sortOrder) => ({ id: entry.id, sortOrder, kind: entry.kind })) }) });
    if (response.ok) router.refresh(); else setMessage("Could not update the photo list.");
  }

  return <section className="mt-8 rounded-3xl border border-stone-200 bg-white p-6"><h2 className="text-lg font-semibold">Photos</h2><p className="mt-1 text-sm text-muted">JPEG, PNG, or WEBP · up to 8 MB each · 20 per property. Images are re-encoded to WEBP.</p><form onSubmit={upload} className="mt-4 flex flex-wrap gap-3"><input required name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple className="max-w-full text-sm" /><button disabled={busy} className="rounded-full bg-ink px-4 py-2 text-sm text-white disabled:opacity-50">{busy ? "Uploading…" : "Upload photos"}</button></form>{message && <p role="status" className="mt-3 text-sm text-muted">{message}</p>}<div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{photos.map((photo) => <article key={photo.id} className="overflow-hidden rounded-xl border border-stone-200"><div className="relative aspect-[4/3]"><Image src={photo.url} alt={photo.alt} fill sizes="25vw" className="object-cover" unoptimized /></div><div className="p-2"><p className="truncate text-xs">{photo.kind === "RENDER_3D" ? "3D render" : "Photo"}</p><div className="mt-2 flex gap-2"><button type="button" onClick={() => updatePhoto(photo, { kind: photo.kind === "RENDER_3D" ? "PHOTO" : "RENDER_3D" })} className="text-xs underline">Toggle 3D</button><button type="button" disabled={photo.sortOrder === 0} onClick={() => updatePhoto(photo, { sortOrder: photo.sortOrder - 1 })} className="text-xs underline disabled:opacity-40">Move up</button></div></div></article>)}</div></section>;
}
