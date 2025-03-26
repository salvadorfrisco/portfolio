import { NextResponse } from "next/server";
import { headers } from "next/headers";
import executeQuery from "@/app/_lib/db";
import { v4 as uuidv4 } from "uuid";

async function isAuthenticated() {
  const headersList = await headers();
  const isInternal = headersList.get("x-internal-request") === "true";
  const cookieHeader = headersList.get("cookie") || "";
  const hasAuthCookie = cookieHeader.includes("auth=true");

  return isInternal && hasAuthCookie;
}

export async function GET(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const url = new URL(request.url);
  const inactives = url.searchParams.get("inactives") === "true";

  try {
    const query = `
      SELECT c.*, 
        (SELECT comment FROM comment_history 
         WHERE client_id = c.id 
         ORDER BY created_at DESC 
         LIMIT 1) as comment_last
      FROM clients c
      WHERE (c.active = true OR c.active = !?) 
      ORDER BY c.created_at DESC
    `;

    const results = await executeQuery({
      query,
      values: [inactives],
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json(
      { error: "Erro ao buscar clientes" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, comment_last, rating, lead, building_id } =
      body;
    const id = uuidv4();

    const insertClientQuery = `
      INSERT INTO clients (
        id, name, email, phone, comment_last, rating, lead, building_id,
        created_at, updated_at
      ) 
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
    `;

    await executeQuery({
      query: insertClientQuery,
      values: [
        id,
        name,
        email.toLowerCase(),
        phone,
        comment_last,
        rating,
        lead,
        building_id,
      ],
    });

    await executeQuery({
      query: `
        INSERT INTO comment_history (client_id, comment, created_at) 
        VALUES (?, ?, CURRENT_TIMESTAMP)
      `,
      values: [id, comment_last],
    });

    const newClient = await executeQuery({
      query: `
        SELECT c.*, 
          (SELECT comment FROM comment_history 
           WHERE client_id = c.id 
           ORDER BY created_at DESC 
           LIMIT 1) as comment_last
        FROM clients c 
        WHERE c.id = ?
      `,
      values: [id],
    });

    return NextResponse.json(newClient[0]);
  } catch (error) {
    console.error("Erro ao inserir cliente:", error);
    return NextResponse.json(
      { error: "Erro ao inserir cliente" },
      { status: 500 },
    );
  }
}
