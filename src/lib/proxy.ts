import { getTokens } from "@/lib/auth";
import { backendFetch } from "@/lib/backend-client";
import { NextRequest } from "next/server";

export async function proxyToBackend(
  request: NextRequest,
  backendPath: string,
  method?: string
) {
  const { accessToken, orgId } = await getTokens();

  if (!accessToken) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const options: RequestInit & { token?: string; orgId?: string } = {
    method: method || request.method,
    token: accessToken,
    orgId: orgId || undefined,
  };

  if (["POST", "PATCH", "PUT"].includes(options.method!)) {
    try {
      const body = await request.json();
      options.body = JSON.stringify(body);
    } catch {
      // No body
    }
  }

  // Forward query params
  const url = new URL(request.url);
  const queryString = url.search;

  const res = await backendFetch(`${backendPath}${queryString}`, options);

  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("text/csv")) {
    const csv = await res.text();
    return new Response(csv, {
      status: res.status,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": res.headers.get("content-disposition") || "attachment; filename=export.csv",
      },
    });
  }

  if (!res.ok) {
    try {
      const error = await res.json();
      return Response.json(error, { status: res.status });
    } catch {
      return Response.json(
        { error: "Backend error", message: `Status ${res.status}` },
        { status: res.status }
      );
    }
  }

  const data = await res.json();
  return Response.json(data);
}
