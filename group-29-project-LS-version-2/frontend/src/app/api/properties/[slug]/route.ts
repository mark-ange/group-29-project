import { getPropertyBySlug } from "@/lib/services/properties";
import { apiErrorResponse } from "@/lib/http-security";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    return Response.json(await getPropertyBySlug(slug));
  } catch (error) {
    return apiErrorResponse(error);
  }
}
