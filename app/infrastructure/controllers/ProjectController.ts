import { NextRequest, NextResponse } from "next/server";
import { ProjectUseCases } from "../../core/application/useCases/ProjectUseCases";
import { MySQLProjectRepository } from "../repositories/MySQLProjectRepository";

const projectRepository = new MySQLProjectRepository();
const projectUseCases = new ProjectUseCases(projectRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const project = await projectUseCases.getProjectById(parseInt(id));
      if (!project) {
        return NextResponse.json(
          { error: "Projeto não encontrado" },
          { status: 404 },
        );
      }
      return NextResponse.json(project);
    }

    const projects = await projectUseCases.getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, technologies } = body;

    if (!title || !description || !imageUrl || !technologies) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 },
      );
    }

    const project = await projectUseCases.createProject(
      title,
      description,
      imageUrl,
      technologies,
    );

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID do projeto é obrigatório" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { title, description, imageUrl, technologies } = body;

    if (!title || !description || !imageUrl || !technologies) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 },
      );
    }

    const project = await projectUseCases.updateProject(
      parseInt(id),
      title,
      description,
      imageUrl,
      technologies,
    );

    return NextResponse.json(project);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID do projeto é obrigatório" },
        { status: 400 },
      );
    }

    await projectUseCases.deleteProject(parseInt(id));
    return NextResponse.json({ message: "Projeto excluído com sucesso" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
