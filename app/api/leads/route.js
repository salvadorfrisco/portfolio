import executeQuery from "@/app/_lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone } = body;

    // Verificar se já existe um lead com o telefone fornecido e verified = 0
    const checkQuery = `
      SELECT * FROM leads 
      WHERE phone = ? AND verified = 0
      LIMIT 1;
    `;

    const existingLead = await executeQuery({
      query: checkQuery,
      values: [phone],
    });

    if (existingLead.length > 0) {
      return NextResponse.json(
        { error: "Cadastro já realizado anteriormente." },
        { status: 400 },
      );
    }

    // Inserir o novo lead
    const insertQuery = `
      INSERT INTO leads (name, email, phone, verified)
      VALUES (?, ?, ?, 0);
    `;

    await executeQuery({
      query: insertQuery,
      values: [name, email, phone],
    });

    return NextResponse.json(
      { message: "Lead salvo com sucesso!" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao salvar lead:", error);
    return NextResponse.json(
      { error: "Erro ao salvar o lead." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Método não permitido." }, { status: 405 });
}
