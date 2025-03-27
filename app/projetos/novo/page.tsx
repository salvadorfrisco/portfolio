"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function NovoProjeto() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    siteUrl: "",
    technologies: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const technologies = formData.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean);

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          technologies,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar projeto");
      }

      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Erro ao criar projeto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Adicionar Novo Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Projeto</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteUrl">Site</Label>
              <input
                type="url"
                id="siteUrl"
                value={formData.siteUrl}
                onChange={(e) =>
                  setFormData({ ...formData, siteUrl: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="technologies">
                Tecnologias (separadas por vírgula)
              </Label>
              <Input
                id="technologies"
                value={formData.technologies}
                onChange={(e) =>
                  setFormData({ ...formData, technologies: e.target.value })
                }
                placeholder="React, TypeScript, Node.js"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL da Imagem</Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Projeto"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
