import { NextResponse } from "next/server";
import executeQuery from "@/app/_lib/db";

interface QueryResult {
  count: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");
    const excludeId = searchParams.get("excludeId");

    if (!phone) {
      return NextResponse.json(
        { error: "Telefone não fornecido" },
        { status: 400 },
      );
    }

    const query = excludeId
      ? "SELECT COUNT(*) as count FROM clients WHERE phone = ? AND id != ?"
      : "SELECT COUNT(*) as count FROM clients WHERE phone = ?";

    const values = excludeId ? [phone, excludeId] : [phone];

    const result = await executeQuery({
      query,
      values,
    });

    const exists = (result as QueryResult[])[0].count > 0;

    return NextResponse.json({ exists });
  } catch (error) {
    console.error("Erro ao validar telefone:", error);
    return NextResponse.json(
      { error: "Erro ao validar telefone" },
      { status: 500 },
    );
  }
}
