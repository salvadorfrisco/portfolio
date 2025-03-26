import { NextResponse } from "next/server";
import { headers } from "next/headers";
import executeQuery from "@/app/_lib/db";

async function isAuthenticated() {
  const headersList = await headers();
  const isInternal = headersList.get("x-internal-request") === "true";
  const cookieHeader = headersList.get("cookie") || "";
  const hasAuthCookie = cookieHeader.includes("auth=true");

  return isInternal && hasAuthCookie;
}

export async function GET(request, context) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { id } = await context.params;

    const query = `
      SELECT c.*, 
        (SELECT comment FROM comment_history 
         WHERE client_id = c.id 
         ORDER BY created_at DESC 
         LIMIT 1) as comment_last
      FROM clients c 
      WHERE c.id = ? AND c.active = true
    `;

    const results = await executeQuery({
      query,
      values: [id],
    });

    return NextResponse.json(results[0]);
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    return NextResponse.json(
      { error: "Cliente não encontrado" },
      { status: 404 },
    );
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    const active = url.searchParams.get("active");

    if (active) {
    }
    const query = active
      ? `
      UPDATE clients 
      SET active = false, 
          updated_at = DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 HOUR)
      WHERE id = ?
    `
      : `
      DELETE FROM clients WHERE id = ?
    `;

    await executeQuery({
      query,
      values: [id],
    });

    return NextResponse.json({ message: "Cliente removido com sucesso" });
  } catch (error) {
    console.error("Erro ao remover cliente:", error);
    return NextResponse.json(
      { error: "Erro ao remover cliente" },
      { status: 500 },
    );
  }
}

export async function POST(request, context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { name, email, phone, comment_last, rating, lead, building_id } =
      body;

    const phoneWithoutPrefix = phone.replace("+55", "");

    const query = `
      UPDATE clients 
      SET name = ?, 
          email = ?, 
          phone = ?, 
          comment_last = ?,
          rating = ?,
          lead = ?,
          building_id = ?,
          updated_at = DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 HOUR)
      WHERE id = ?
    `;

    await executeQuery({
      query,
      values: [
        name,
        email.toLowerCase(),
        phoneWithoutPrefix,
        comment_last,
        rating,
        lead,
        building_id,
        id,
      ],
    });

    if (comment_last) {
      await executeQuery({
        query: `
          INSERT INTO comment_history (client_id, comment, created_at) 
          VALUES (?, ?, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 HOUR))
        `,
        values: [id, comment_last],
      });
    }

    // Busca o cliente atualizado com o último comentário
    const updatedClient = await executeQuery({
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

    return NextResponse.json(updatedClient[0]);
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar cliente" },
      { status: 500 },
    );
  }
}
