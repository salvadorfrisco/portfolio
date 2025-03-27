"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Project } from "./core/domain/entities/Project";
import { Eye } from "lucide-react";
import { ProjectProvider, useProject } from "./contexts/ProjectContext";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { newProjectButton, toggleNewProjectButton } = useProject();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Erro ao carregar projetos");
        }
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Formato de dados inválido");
        }

        const sortedProjects = data.sort(
          (a: Project, b: Project) => (a.viewOrder ?? 0) - (b.viewOrder ?? 0),
        );
        setProjects(sortedProjects);
      } catch (err) {
        console.error("Erro detalhado:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    // Resetar o cursor quando a página principal carregar
    document.body.style.cursor = "default";
    document.documentElement.style.cursor = "default";
  }, []);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Atualiza o estado imediatamente para feedback visual
    setProjects(items);

    try {
      console.log(
        "Enviando nova ordem:",
        items.map((project) => project.id),
      );

      const response = await fetch("/api/projects/reorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectIds: items.map((project) => project.id),
        }),
      });

      const data = await response.json();
      console.log("Resposta da API:", data);

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar a ordem");
      }

      // Recarrega os projetos para garantir que estamos mostrando a ordem correta
      const refreshResponse = await fetch("/api/projects");
      if (!refreshResponse.ok) {
        throw new Error("Erro ao recarregar projetos");
      }
      const refreshedData = await refreshResponse.json();
      const sortedProjects = refreshedData.sort(
        (a: Project, b: Project) => (a.viewOrder ?? 0) - (b.viewOrder ?? 0),
      );
      setProjects(sortedProjects);
    } catch (error) {
      console.error("Erro ao salvar a ordem:", error);
      // Opcional: reverter a ordem se falhar
      const response = await fetch("/api/projects");
      const data = await response.json();
      const sortedProjects = data.sort(
        (a: Project, b: Project) => (a.viewOrder ?? 0) - (b.viewOrder ?? 0),
      );
      setProjects(sortedProjects);
    }
  };

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
          <div className="text-center text-red-600">Erro: {error}</div>
        </div>
      </main>
    );
  }

  return (
    <ProjectProvider>
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-200">Projetos</h1>
            <span
              className="ml-10 text-lg font-thin text-cyan-600"
              onDoubleClick={toggleNewProjectButton}
            >
              ...
            </span>
            {newProjectButton && (
              <Link
                href="/projetos/novo"
                className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Adicionar Novo Projeto
              </Link>
            )}
          </div>

          {newProjectButton ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="projects" direction="horizontal">
                {(provided) => (
                  <div
                    className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {projects.map((project, index) => (
                      <Draggable
                        key={project.id}
                        draggableId={project.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`block overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg ${snapshot.isDragging ? "rotate-2 opacity-70" : ""}`}
                            style={{
                              ...provided.draggableProps.style,
                              cursor: snapshot.isDragging ? "grabbing" : "grab",
                            }}
                          >
                            <div
                              className="relative w-full pt-[58%]"
                              title="Clique para abrir o site"
                              onClick={() => window.open(project.siteUrl)}
                            >
                              <Image
                                src={project.imageUrl}
                                alt={project.title}
                                width={500}
                                height={282}
                                className="absolute left-0 top-0 -mt-2 h-full w-full object-cover"
                              />
                            </div>

                            <Link
                              href={`/projetos/${project.id}`}
                              title="Clique para ver detalhes"
                              className="block overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
                              onClick={(e) => {
                                if (snapshot.isDragging) {
                                  e.preventDefault();
                                }
                              }}
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
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="block overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
                >
                  <div
                    className="relative w-full pt-[58%] hover:cursor-alias"
                    title="Clique para abrir o site"
                    onClick={() => window.open(project.siteUrl)}
                  >
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      width={500}
                      height={282}
                      className="absolute left-0 top-0 -mt-2 h-full w-full object-cover"
                    />
                  </div>

                  <Link
                    href={`/projetos/${project.id}`}
                    title="Clique para ver detalhes"
                    className="block overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:cursor-pointer hover:shadow-lg"
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
          )}
        </div>
      </main>
    </ProjectProvider>
  );
}
