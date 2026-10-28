import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { z } from "zod";

import { requirePropertyAccess } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { apiErrorResponse, assertSameOrigin, readJsonBody } from "@/lib/http-security";

type Context = { params: Promise<{ id: string }> };
const photoOrderSchema = z.strictObject({ images: z.array(z.strictObject({ id: z.string().min(1), sortOrder: z.number().int().min(0).max(19), kind: z.enum(["PHOTO", "RENDER_3D"]) })).max(20) }).superRefine((value, context) => {
  if (new Set(value.images.map((image) => image.id)).size !== value.images.length) context.addIssue({ code: "custom", message: "Image IDs must be unique." });
});

function hasImageSignature(bytes: Buffer) {
  return (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    || bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    || (bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP");
}

export async function POST(request: Request, context: Context) {
  const createdFiles: string[] = [];
  try {
    assertSameOrigin(request);
    const { id } = await context.params;
    const { property } = await requirePropertyAccess(id);
    const form = await request.formData();
    const photos = form.getAll("photos").filter((entry): entry is File => entry instanceof File && entry.size > 0);
    if (!photos.length || photos.length > 20) return Response.json({ error: { message: "Choose between 1 and 20 images." } }, { status: 400 });
    const count = await prisma.propertyImage.count({ where: { propertyId: property.id } });
    if (count + photos.length > 20) return Response.json({ error: { message: "A property can have at most 20 photos." } }, { status: 400 });

    const root = path.resolve(process.cwd(), "public", "uploads");
    const directory = path.resolve(root, property.id);
    if (!directory.startsWith(`${root}${path.sep}`)) return Response.json({ error: { message: "Invalid upload path." } }, { status: 400 });
    await mkdir(directory, { recursive: true });
    const images = [];
    for (const photo of photos) {
      if (photo.size > 8 * 1024 * 1024) return Response.json({ error: { message: "Each image must be 8 MB or smaller." } }, { status: 413 });
      const input = Buffer.from(await photo.arrayBuffer());
      if (!hasImageSignature(input)) return Response.json({ error: { message: "Only valid JPEG, PNG, or WEBP images are allowed." } }, { status: 415 });
      const output = await sharp(input, { limitInputPixels: 40_000_000 }).rotate().webp({ quality: 86 }).toBuffer();
      const filename = `${randomUUID()}.webp`;
      const target = path.join(directory, filename);
      await writeFile(target, output, { flag: "wx" });
      createdFiles.push(target);
      images.push(await prisma.propertyImage.create({ data: { propertyId: property.id, url: `/uploads/${property.id}/${filename}`, alt: `${property.title} property photo`, kind: "PHOTO", sortOrder: count + images.length } }));
    }
    return Response.json({ images: images.map(({ id: imageId, url, alt, kind, sortOrder }) => ({ id: imageId, url, alt, kind, sortOrder })) }, { status: 201 });
  } catch (error) {
    await Promise.all(createdFiles.map(async (file) => import("node:fs/promises").then(({ unlink }) => unlink(file).catch(() => undefined))));
    return apiErrorResponse(error);
  }
}

export async function PATCH(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    const { id } = await context.params;
    await requirePropertyAccess(id);
    const input = photoOrderSchema.parse(await readJsonBody(request, 16 * 1024));
    const existing = await prisma.propertyImage.findMany({ where: { propertyId: id }, select: { id: true } });
    if (input.images.length !== existing.length || input.images.some((image) => !existing.some((row) => row.id === image.id))) return Response.json({ error: { message: "Image list is out of date." } }, { status: 400 });
    await prisma.$transaction(input.images.map((image) => prisma.propertyImage.update({ where: { id: image.id }, data: { sortOrder: image.sortOrder, kind: image.kind } })));
    return Response.json({ ok: true });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
