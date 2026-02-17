import { getTokens } from "@/lib/auth";
import { backendFetch } from "@/lib/backend-client";

export async function GET() {
  const { accessToken } = await getTokens();

  if (!accessToken) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Decode JWT payload to get user info (without calling backend)
  try {
    const payload = JSON.parse(
      Buffer.from(accessToken.split(".")[1], "base64").toString()
    );

    // Check expiry
    if (payload.exp * 1000 < Date.now()) {
      return Response.json({ error: "Token expired" }, { status: 401 });
    }

    // Get orgs from backend
    const res = await backendFetch("/organizations", {
      token: accessToken,
    });

    const orgData = res.ok ? await res.json() : { organizations: [] };

    return Response.json({
      user: {
        id: payload.sub,
        email: payload.email,
      },
      organizations: orgData.organizations || [],
    });
  } catch {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }
}
