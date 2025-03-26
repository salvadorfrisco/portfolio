import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded
    ? forwarded.split(",")[0]
    : request.headers.get("host") || "IP não encontrado";

  // Substitua localhost por um texto genérico em desenvolvimento
  const sanitizedIp =
    ip.includes("127.0.0.1") || ip.includes("::1") ? "Desenv.(localhost)" : ip;

  return NextResponse.json({ ip: sanitizedIp });
}
