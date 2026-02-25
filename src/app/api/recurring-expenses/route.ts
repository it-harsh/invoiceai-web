import { proxyToBackend } from "@/lib/proxy";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return proxyToBackend(request, "/recurring-expenses");
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, "/recurring-expenses");
}
