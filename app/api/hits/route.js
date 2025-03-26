import executeQuery from "@/app/_lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = `
    SELECT COUNT(*) AS access_count
    FROM accesslog        
    `;

    const data = await executeQuery({
      query,
    });

    if (data.length === 0) {
      return NextResponse.json(
        { error: "Nenhum dado encontrado." },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: data[0] });
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
