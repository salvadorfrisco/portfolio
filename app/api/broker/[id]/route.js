import executeQuery from "@/app/_lib/db";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    const { id } = await context.params;

    const query = `
      SELECT 
          email,
          phone,
          facebook_url,
          instagram_url
      FROM 
          broker
      WHERE 
          id = ?
          AND active = 1;
    `;

    const results = await executeQuery({
      query,
      values: [id],
    });

    if (results.length === 0) {
      return NextResponse.json(
        { error: "Nenhum dado encontrado." },
        { status: 404 },
      );
    }

    // Organizando os dados no formato esperado
    const broker = {
      name: results[0].name,
      email: results[0].email,
      phone: results[0].phone,
      facebookUrl: results[0].facebook_url,
      instagramUrl: results[0].instagram_url,
    };

    // Adicionando a lista de prédios no retorno
    return NextResponse.json({
      broker,
    });
  } catch (error) {
    console.error("Erro ao buscar broker:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao buscar os dados do broker." },
      { status: 500 },
    );
  }
}
