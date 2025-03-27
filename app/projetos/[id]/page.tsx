"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Project } from "../../core/domain/entities/Project";
import { useProject } from "@/app/contexts/ProjectContext";
import { Button } from "@/app/components/Button";

export default function DetalhesProjeto({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const { newProjectButton } = useProject();
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    setIsLoading(true);
    router.push("/");
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const result = await params;
        setId(result.id);
        const response = await fetch(`/api/projects?id=${result.id}`);
        if (!response.ok) {
          throw new Error("Erro ao carregar projeto");
        }
        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError("Erro ao carregar projeto");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params]);

  useEffect(() => {
    document.body.style.cursor = "default";
    document.documentElement.style.cursor = "default";
  }, []);

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir este projeto?")) {
      try {
        const response = await fetch(`/api/projects?id=${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Erro ao excluir projeto");
        }

        router.push("/");
      } catch (err) {
        console.error(err);
        alert("Erro ao excluir projeto");
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando..</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          {error || "Projeto não encontrado"}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-200">{project.title}</h1>
          <div className="flex gap-4">
            {newProjectButton && (
              <>
                <button
                  onClick={() => router.push(`/projetos/${id}/editar`)}
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Excluir
                </button>
              </>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <div className="aspect-video bg-gray-200">
            <Image
              src={project.imageUrl}
              alt={project.title}
              width={500}
              height={282}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Descrição</h2>
            <p className="mb-6 text-gray-600">{project.description}</p>

            <h2 className="mb-4 text-xl font-semibold">Site</h2>

            <p
              title="Clique para abrir o site"
              onClick={() => window.open(project.siteUrl)}
              className="mb-6 cursor-pointer text-gray-600 underline hover:text-blue-600"
            >
              {project.siteUrl.replace("https:", "").replaceAll("/", "")}
            </p>

            <h2 className="mb-4 text-xl font-semibold">Tecnologias</h2>
            <div className="mb-6 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex gap-4">
              <Button onClick={handleBack} isLoading={isLoading}>
                Voltar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
