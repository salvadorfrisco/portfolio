import { NextResponse } from "next/server";
import { headers } from "next/headers";
import executeQuery from "@/app/_lib/db";
import { v4 as uuidv4 } from "uuid";
import { Meeting } from "@/app/_types/meeting";

async function isAuthenticated() {
  const headersList = await headers();
  const isInternal = headersList.get("x-internal-request") === "true";
  const cookieHeader = headersList.get("cookie") || "";
  const hasAuthCookie = cookieHeader.includes("auth=true");

  return isInternal && hasAuthCookie;
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const query = `
      SELECT 
        m.id, 
        m.client_id, 
        CONVERT_TZ(m.start_date, '+00:00', '+00:00') AS start_date, 
        CONVERT_TZ(m.end_date, '+00:00', '+00:00') AS end_date, 
        m.notes, 
        m.created_at, 
        m.updated_at, 
        c.name as client_name
      FROM meetings m
      JOIN clients c ON m.client_id = c.id
      WHERE c.active = true
      ORDER BY m.start_date ASC
    `;

    const results = await executeQuery({
      query,
      values: [],
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar agendamentos" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { client_id, start_date, end_date, notes } = body;
    const id = uuidv4();

    const query = `
      INSERT INTO meetings (id, client_id, start_date, end_date, notes, created_at)
      VALUES (?, ?, CONVERT_TZ(?, '+00:00', '+00:00'), CONVERT_TZ(?, '+00:00', '+00:00'), ?, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 HOUR))
    `;

    await executeQuery({
      query,
      values: [id, client_id, start_date, end_date, notes],
    });

    const newMeeting = (await executeQuery({
      query: `
        SELECT 
          m.id, 
          m.client_id, 
          CONVERT_TZ(m.start_date, '+00:00', '+00:00') AS start_date, 
          CONVERT_TZ(m.end_date, '+00:00', '+00:00') AS end_date, 
          m.notes, 
          m.created_at, 
          m.updated_at, 
          c.name as client_name
        FROM meetings m
        JOIN clients c ON m.client_id = c.id
        WHERE m.id = ?
      `,
      values: [id],
    })) as Meeting[];

    return NextResponse.json(newMeeting[0]);
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao criar agendamento" },
      { status: 500 },
    );
  }
}
