import { NextResponse } from "next/server";
import { headers } from "next/headers";
import executeQuery from "@/app/_lib/db";
import ExcelJS from "exceljs";

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
        name, 
        email, 
        phone,
        comment_last,
        CASE 
          WHEN lead = 1 THEN 'Sim'
          ELSE 'Não'
        END as lead,
        DATE_FORMAT(
          COALESCE(
            updated_at, 
            created_at
          ), 
          '%d/%m/%Y %H:%i'
        ) as updated_at
      FROM clients 
      WHERE active = true 
      ORDER BY name
    `;

    const results = await executeQuery({
      query,
      values: [],
    });

    // Criar workbook e worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Clientes");

    // Definir colunas
    worksheet.columns = [
      { header: "Nome", key: "name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Telefone", key: "phone", width: 20 },
      { header: "Lead?", key: "lead", width: 10 },
      { header: "Último Comentário", key: "comment_last", width: 40 },
      { header: "Última Atualização", key: "updated_at", width: 20 },
    ];

    // Adicionar dados
    worksheet.addRows(results);

    // Gerar buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Retornar arquivo
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=clientes.xlsx",
      },
    });
  } catch (error) {
    console.error("Erro ao exportar clientes:", error);
    return NextResponse.json(
      { error: "Erro ao exportar clientes" },
      { status: 500 },
    );
  }
}
