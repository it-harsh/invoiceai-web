import { backendFetch } from "@/lib/backend-client";
import { getTokens, setAuthCookies } from "@/lib/auth";

export async function POST() {
  const { refreshToken } = await getTokens();

  if (!refreshToken) {
    return Response.json({ error: "No refresh token" }, { status: 401 });
  }

  const res = await backendFetch("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    return Response.json({ error: "Token refresh failed" }, { status: 401 });
  }

  const data = await res.json();

  await setAuthCookies(data.accessToken, data.refreshToken);

  return Response.json({
    user: data.user,
    organizations: data.organizations,
  });
}
