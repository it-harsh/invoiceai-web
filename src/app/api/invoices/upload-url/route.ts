import { proxyToBackend } from "@/lib/proxy";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return proxyToBackend(request, "/invoices/upload-url");
}
