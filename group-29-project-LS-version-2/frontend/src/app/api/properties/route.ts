import { listProperties } from "@/lib/services/properties";
import { apiErrorResponse } from "@/lib/http-security";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const query = Object.fromEntries(params.entries());
    return Response.json(await listProperties(query));
  } catch (error) {
    return apiErrorResponse(error);
  }
}
