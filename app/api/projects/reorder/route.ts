import { NextResponse } from "next/server";
import { MySQLProjectRepository } from "@/app/infrastructure/repositories/MySQLProjectRepository";

export async function PUT(request: Request) {
  try {
    const { projectIds } = await request.json();
    const projectRepository = new MySQLProjectRepository();

    await projectRepository.reorder(projectIds);

    return NextResponse.json({ message: "Ordem atualizada com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar ordem:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar ordem dos projetos" },
      { status: 500 },
    );
  }
}
