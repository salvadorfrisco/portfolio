import executeQuery from "@/app/_lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = `
    SELECT 
        b.id AS building_id,
        b.name AS building_name,
        p.title AS presentation_title
    FROM 
        building b 
    LEFT JOIN presentation p ON b.id = p.building_id
    WHERE b.active = 1
    `;

    const results = await executeQuery({
      query,
    });

    if (results.length === 0) {
      return NextResponse.json(
        { error: "Nenhum dado encontrado." },
        { status: 404 },
      );
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Erro ao buscar a lista de empreendimentos:", error);
    return NextResponse.json(
      {
        error:
          "Ocorreu um erro ao buscar os dados de lista de empreendimentos.",
      },
      { status: 500 },
    );
  }
}
