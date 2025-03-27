"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Project } from "./core/domain/entities/Project";
import { Eye } from "lucide-react";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newProjectButton, setNewProjectButton] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Erro ao carregar projetos");
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError("Erro ao carregar projetos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            Carregando projetos...
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Projetos
            <span
              className={`ml-2 text-lg font-thin text-gray-400 ${newProjectButton && "text-cyan-200"}`}
              onDoubleClick={() => setNewProjectButton(!newProjectButton)}
            >
              (em construção)
            </span>
          </h1>

          {newProjectButton && (
            <Link
              href="/projetos/novo"
              className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Adicionar Novo Projeto
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="block overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
            >
              <div
                className="relative w-full pt-[56.25%] hover:cursor-pointer"
                title="Clique para abrir o site"
                onClick={() => window.open(project.siteUrl)}
              >
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="absolute left-0 top-0 h-full w-full object-cover"
                />
              </div>

              <Link
                href={`/projetos/${project.id}`}
                title="Clique para ver detalhes"
                className="block overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:cursor-zoom-in hover:shadow-lg"
              >
                <div className="p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="mb-2 text-xl font-semibold text-gray-900">
                      {project.title}
                    </h2>
                    <Eye className="h-5 text-gray-400" />
                  </div>

                  <p className="mb-4 line-clamp-3 text-gray-600">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
