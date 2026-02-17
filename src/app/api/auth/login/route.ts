import { backendFetch } from "@/lib/backend-client";
import { setAuthCookies } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const res = await backendFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json();
    return Response.json(error, { status: res.status });
  }

  const data = await res.json();

  await setAuthCookies(
    data.accessToken,
    data.refreshToken,
    data.organizations?.[0]?.id
  );

  return Response.json({
    user: data.user,
    organizations: data.organizations,
  });
}
