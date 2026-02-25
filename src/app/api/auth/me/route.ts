import { getTokens } from "@/lib/auth";
import { backendFetch } from "@/lib/backend-client";

export async function GET() {
  const { accessToken, orgId } = await getTokens();

  if (!accessToken) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const res = await backendFetch("/users/me", {
      token: accessToken,
      orgId: orgId,
    });

    if (!res.ok) {
      const error = await res.json();
      return Response.json(error, { status: res.status });
    }

    const data = await res.json();

    return Response.json({
      user: data.user,
      organizations: data.organizations,
    });
  } catch {
    return Response.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
