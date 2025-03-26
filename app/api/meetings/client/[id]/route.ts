import { NextResponse } from "next/server";
import { headers } from "next/headers";
import executeQuery from "@/app/_lib/db";
import { Meeting } from "@/app/_types/meeting";

async function isAuthenticated() {
  const headersList = await headers();
  const isInternal = headersList.get("x-internal-request") === "true";
  const cookieHeader = headersList.get("cookie") || "";
  const hasAuthCookie = cookieHeader.includes("auth=true");

  return isInternal && hasAuthCookie;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const params = await context.params;

  try {
    const query = `
      SELECT m.*, c.name as client_name
      FROM meetings m
      JOIN clients c ON m.client_id = c.id
      WHERE m.client_id = ? AND c.active = true
      ORDER BY m.start_date DESC
      LIMIT 1
    `;

    const results = (await executeQuery({
      query,
      values: [params.id],
    })) as Meeting[];

    return NextResponse.json(results[0] || null);
  } catch (error) {
    console.error("Erro ao buscar agendamento do cliente:", error);
    return NextResponse.json(
      { error: "Erro ao buscar agendamento do cliente" },
      { status: 500 },
    );
  }
}
