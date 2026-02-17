const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function backendFetch(
  path: string,
  options: RequestInit & { token?: string; orgId?: string } = {}
) {
  const { token, orgId, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (orgId) {
    headers["X-Organization-Id"] = orgId;
  }

  const res = await fetch(`${BACKEND_URL}/api/v1${path}`, {
    ...fetchOptions,
    headers,
  });

  return res;
}
