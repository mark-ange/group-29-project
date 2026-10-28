import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.APP_URL ?? "http://localhost:3000";
  const properties = await prisma.property.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } });
  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...properties.map((property) => ({ url: `${base}/stays/${encodeURIComponent(property.slug)}`, lastModified: property.updatedAt, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
