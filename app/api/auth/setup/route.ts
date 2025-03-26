import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import executeQuery from "@/app/_lib/db";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    // Verifica se já existe senha
    const [broker] = (await executeQuery({
      query: "SELECT password FROM broker WHERE id = 1",
      values: [],
    })) as { password: string }[];

    if (broker?.password) {
      return NextResponse.json(
        { error: "Senha já cadastrada" },
        { status: 400 },
      );
    }

    // Hash da senha
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Atualiza a senha
    await executeQuery({
      query: "UPDATE broker SET password = ? WHERE id = 1",
      values: [hashedPassword],
    });

    // Seta o cookie de autenticação
    const response = NextResponse.json({ success: true });
    response.cookies.set("auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    });

    return response;
  } catch (error) {
    console.error("Erro ao cadastrar senha:", error);
    return NextResponse.json(
      { error: "Erro ao cadastrar senha" },
      { status: 500 },
    );
  }
}
