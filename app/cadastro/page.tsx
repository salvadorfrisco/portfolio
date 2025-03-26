"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { StarRating } from "../components/StarRating";
import { useBuilding } from "../_contexts/BuildingContext";
import { formatName } from "../_lib/utils";

export default function CadastroPage() {
  const { buildingData } = useBuilding();
  const buildingList = useMemo(
    () => buildingData?.buildingList || [],
    [buildingData],
  );
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    comment_last: "",
    rating: 0,
    lead: 0,
    building_id: 0,
  });
  const [phoneError, setPhoneError] = useState("");
  const imagePrefix = process.env.NEXT_PUBLIC_API_PREFIX || "";

  const validatePhone = async (phone: string) => {
    if (!phone || phone.length !== 15) return;

    try {
      const response = await fetch(
        `${imagePrefix}/api/clients/validate-phone?phone=${encodeURIComponent(phone)}`,
        {
          headers: {
            "x-internal-request": "true",
          },
        },
      );

      const data = await response.json();

      if (data.exists) {
        setPhoneError("Este telefone já está cadastrado");
      } else {
        setPhoneError("");
      }
    } catch (error) {
      console.error("Erro ao validar telefone:", error);
    }
  };

  useEffect(() => {
    // Encontra o building com building_priority = 1
    const priorityBuilding = buildingList.find(
      (building) => building.building_priority == 1,
    );

    // Atualiza o formData com o building_id prioritário
    if (priorityBuilding) {
      setFormData((prev) => ({
        ...prev,
        building_id: priorityBuilding.building_id,
      }));
    }
  }, [buildingList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phoneError) {
      return;
    }

    try {
      const response = await fetch(`${imagePrefix}/api/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push(`${imagePrefix}/clientes`);
      }
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${imagePrefix}/api/auth/logout`, { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value =
      e.target.name === "name" ? formatName(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    value = value.replace(/\D/g, "");

    // Garante que o primeiro dígito após DDD seja 9
    if (value.length > 2) {
      const ddd = value.slice(0, 2);
      const rest = value.slice(2);
      value = ddd + "9" + rest.slice(rest.startsWith("9") ? 1 : 0);
    }

    value = value.slice(0, 11);

    if (value.length >= 2) {
      value = `(${value.slice(0, 2)}${value.length > 2 ? ") " : ""}${value.slice(2)}`;
    }
    if (value.length >= 11) {
      value = `${value.slice(0, 10)}-${value.slice(10)}`;
    }

    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));

    // Valida o formato do telefone
    if (value.length === 15) {
      setPhoneError("");
    } else if (value.length > 0) {
      setPhoneError("Formato esperado: (XX) 9XXXX-XXXX");
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  return (
    <div className="container mx-auto mb-6 min-h-screen p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mt-32">
          <h1 className="mb-6 text-2xl font-bold">Cadastro de Cliente</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <label className="mb-2 block">Nome:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded border p-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block">Telefone celular:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                onBlur={(e) => validatePhone(e.target.value)}
                placeholder="(11) 99999-9999"
                maxLength={15}
                className={`w-full rounded-md border ${phoneError ? "border-red-500" : "border-gray-200"} p-1.5 text-lg`}
              />
              {phoneError && (
                <p className="mt-1 text-sm text-red-500">{phoneError}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="mb-2 block">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded border p-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block">Empreendimento:</label>
              <select
                value={formData.building_id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    building_id: Number(e.target.value),
                  }))
                }
                className="w-full rounded border p-2"
              >
                <option value={0} className="text-blue-400">
                  Selecione um empreendimento
                </option>
                {buildingList.map((building) => (
                  <option
                    key={building.building_id}
                    value={building.building_id}
                  >
                    {building.building_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 flex items-center">
              <div className="items-center">
                <label className="mb-2 block">Avaliação:</label>
                <StarRating
                  rating={formData.rating}
                  onRatingChange={handleRatingChange}
                />
              </div>
              <label className="ml-40 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.lead === 1}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lead: e.target.checked ? 1 : 0,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span>Lead?</span>
              </label>
            </div>

            <div className="mb-4">
              <label className="mb-2 block">Comentário:</label>
              <textarea
                name="comment_last"
                value={formData.comment_last}
                onChange={handleChange}
                className="w-full rounded border p-2"
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Cadastrar
              </button>
              <button
                type="button"
                onClick={() => router.push(`${imagePrefix}/clientes`)}
                className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                Lista de Clientes
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="whitespace-nowrap rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600"
              >
                Sair
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
