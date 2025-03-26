import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import executeQuery from "@/app/_lib/db";
import { setCookie } from "@/app/_lib/cookieHandler";

interface BrokerRow {
  id: number;
  password: string;
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const result = (await executeQuery({
      query: "SELECT id, password FROM broker WHERE id = 1",
      values: [],
    })) as BrokerRow[];

    const broker = result[0];

    if (!broker || !bcrypt.compareSync(password, broker.password)) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
    }

    await setCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 });
  }
}
