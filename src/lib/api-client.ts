import type { ApiError } from "@/types/api";

class ApiClient {
  private baseUrl = "/api";

  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== "") url.searchParams.set(k, v);
      });
    }

    const res = await fetch(url.toString());
    if (!res.ok) throw await this.handleError(res);
    return res.json();
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw await this.handleError(res);
    return res.json();
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw await this.handleError(res);
    return res.json();
  }

  async del(path: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "DELETE",
    });
    if (!res.ok) throw await this.handleError(res);
  }

  private async handleError(res: Response): Promise<ApiError> {
    try {
      return await res.json();
    } catch {
      return {
        error: "UNKNOWN_ERROR",
        message: `Request failed with status ${res.status}`,
      };
    }
  }
}

export const api = new ApiClient();
