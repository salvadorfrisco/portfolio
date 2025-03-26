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
      WHERE m.id = ? AND c.active = true
    `;

    const results = (await executeQuery({
      query,
      values: [params.id],
    })) as Meeting[];

    if (!results || results.length === 0) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(results[0]);
  } catch (error) {
    console.error("Erro ao buscar agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao buscar agendamento" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const params = await context.params;

  try {
    const body = await request.json();
    const { start_date, end_date, notes } = body;

    const query = `
      UPDATE meetings 
      SET start_date = ?, 
          end_date = ?, 
          notes = ?,
          updated_at = DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 HOUR)
      WHERE id = ?
    `;

    await executeQuery({
      query,
      values: [start_date, end_date, notes, params.id],
    });

    const updatedMeeting = (await executeQuery({
      query: `
        SELECT m.*, c.name as client_name
        FROM meetings m
        JOIN clients c ON m.client_id = c.id
        WHERE m.id = ?
      `,
      values: [params.id],
    })) as Meeting[];

    return NextResponse.json(updatedMeeting[0]);
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar agendamento" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const params = await context.params;

  try {
    const query = "DELETE FROM meetings WHERE id = ?";

    await executeQuery({
      query,
      values: [params.id],
    });

    return NextResponse.json({ message: "Agendamento removido com sucesso" });
  } catch (error) {
    console.error("Erro ao remover agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao remover agendamento" },
      { status: 500 },
    );
  }
}
