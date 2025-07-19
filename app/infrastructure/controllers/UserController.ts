import { NextRequest, NextResponse } from "next/server";
import { UserUseCases } from "../../core/application/useCases/UserUseCases";
import { MySQLUserRepository } from "../repositories/MySQLUserRepository";

const userRepository = new MySQLUserRepository();
const userUseCases = new UserUseCases(userRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (id) {
      const user = await userUseCases.getUserById(id);
      if (!user) {
        return NextResponse.json(
          { error: "Usuário não encontrado" },
          { status: 404 },
        );
      }
      return NextResponse.json(user);
    }

    if (email) {
      const user = await userUseCases.getUserByEmail(email);
      if (!user) {
        return NextResponse.json(
          { error: "Usuário não encontrado" },
          { status: 404 },
        );
      }
      return NextResponse.json(user);
    }

    const users = await userUseCases.getAllUsers();
    return NextResponse.json(users);
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
    const { id, name, email, phoneNumber, photoUrl, image_base64 } = body;

    if (!id || !name || !email) {
      return NextResponse.json(
        { error: "id, name e email são obrigatórios" },
        { status: 400 },
      );
    }

    const user = await userUseCases.createUser(
      id,
      name,
      email,
      phoneNumber,
      photoUrl,
      image_base64,
    );

    return NextResponse.json(user, { status: 201 });
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
        { error: "ID do usuário é obrigatório" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { name, email, phoneNumber, photoUrl, image_base64 } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Nome e email são obrigatórios" },
        { status: 400 },
      );
    }

    const user = await userUseCases.updateUser(
      id,
      name,
      email,
      phoneNumber,
      photoUrl,
      image_base64,
    );

    return NextResponse.json(user);
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
    const email = searchParams.get("email");

    if (!id && !email) {
      return NextResponse.json(
        { error: "ID ou email do usuário é obrigatório" },
        { status: 400 },
      );
    }

    if (id) {
      await userUseCases.deleteUser(id);
      return NextResponse.json({ message: "Usuário excluído com sucesso" });
    }

    if (email) {
      await userUseCases.deleteUserByEmail(email);
      return NextResponse.json({ message: "Usuário excluído com sucesso" });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID do usuário é obrigatório" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const allowedFields = [
      "name",
      "email",
      "phoneNumber",
      "photoUrl",
      "image_base64",
    ];
    const fieldsToUpdate = Object.keys(body).filter((key) =>
      allowedFields.includes(key),
    );

    if (fieldsToUpdate.length === 0) {
      return NextResponse.json(
        { error: "Nenhum campo válido para atualizar" },
        { status: 400 },
      );
    }

    // Buscar usuário atual
    const user = await userUseCases.getUserById(id);
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    // Atualizar apenas os campos enviados
    const updatedUser = await userUseCases.updateUser(
      id,
      body.name ?? user.name,
      body.email ?? user.email,
      body.phoneNumber ?? user.phoneNumber,
      body.photoUrl ?? user.photoUrl,
      body.image_base64 ?? user.image_base64,
    );

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
