import { backendFetch } from "@/lib/backend-client";

export async function POST(request: Request) {
  const body = await request.json();
  const res = await backendFetch("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return Response.json(data, { status: res.status });
  }

  return Response.json(data);
}
