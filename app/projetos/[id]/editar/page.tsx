"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditarProjeto({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    siteUrl: "",
    imageUrl: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const result = await params;
        setId(result.id);
        const response = await fetch(`/api/projects?id=${result.id}`);
        if (!response.ok) {
          throw new Error("Erro ao carregar projeto");
        }
        const project = await response.json();
        setFormData({
          title: project.title,
          description: project.description,
          technologies: project.technologies.join(", "),
          siteUrl: project.siteUrl,
          imageUrl: project.imageUrl,
        });
      } catch (err) {
        setError("Erro ao carregar projeto");
        console.error(err);
      }
    };

    fetchProject();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const technologies = formData.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean);

      const response = await fetch(`/api/projects?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          technologies,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar projeto");
      }
    } catch (err) {
      setError("Erro ao atualizar projeto");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Editar Projeto</h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Título do Projeto
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Descrição
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="siteUrl"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Site
            </label>
            <input
              type="url"
              id="siteUrl"
              value={formData.siteUrl}
              onChange={(e) =>
                setFormData({ ...formData, siteUrl: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="technologies"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Tecnologias (separadas por vírgula)
            </label>
            <input
              type="text"
              id="technologies"
              value={formData.technologies}
              onChange={(e) =>
                setFormData({ ...formData, technologies: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="imageUrl"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              URL da Imagem
            </label>
            <input
              type="url"
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar Alterações"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
