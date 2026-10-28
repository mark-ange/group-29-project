import { notFound } from "next/navigation";
import { savePropertyAction } from "@/app/admin/actions";
import { PropertyEditor } from "@/components/admin/PropertyEditor";
import { requirePropertyAccess } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { PhotoManager } from "@/components/admin/PhotoManager";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requirePropertyAccess(id);
  const property = await prisma.property.findUnique({ where: { id }, include: { images: { orderBy: { sortOrder: "asc" } } } });
  if (!property) notFound();
  return <><PropertyEditor title="Edit property" action={savePropertyAction} property={property} /><div className="mx-auto max-w-3xl px-5 pb-12 sm:px-8"><PhotoManager propertyId={property.id} photos={property.images} /></div></>;
}
