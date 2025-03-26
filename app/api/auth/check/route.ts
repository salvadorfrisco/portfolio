import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import executeQuery from "@/app/_lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authCookie = await cookieStore.get("auth");

    // if (authCookie) {
    //   return NextResponse.json({ authenticated: true });
    // }

    // Verifica se tem senha cadastrada
    const [broker] = (await executeQuery({
      query: "SELECT password FROM broker WHERE id = 1",
      values: [],
    })) as { password: string }[];

    return NextResponse.json({
      authenticated: authCookie,
      hasPassword: Boolean(broker?.password),
    });
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
