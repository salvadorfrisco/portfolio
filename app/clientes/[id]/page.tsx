"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CommentHistoryModal from "../components/CommentHistory";
import { StarRating } from "../../components/StarRating";
import { useBuilding } from "@/app/_contexts/BuildingContext";
import { formatName } from "@/app/_lib/utils";
import { MeetingModal } from "@/app/components/MeetingModal";
import { Calendar } from "lucide-react";
import { Meeting } from "@/app/_types/meeting";
import { format, isSameDay, isSameHour } from "date-fns";
import { ClientFormData } from "@/app/_types/client";
import { useParams } from "next/navigation";

export default function EditarClientePage() {
  const { id } = useParams<{ id: string }>();

  const router = useRouter();
  const { buildingData } = useBuilding();
  const buildingList = buildingData?.buildingList || [];
  const [showHistory, setShowHistory] = useState(false);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<{
    id: string;
    clientId: string;
    clientName: string;
  } | null>(null);

  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    phone: "",
    email: "",
    comment_last: "",
    rating: 0,
    lead: 0,
    building_id: 0,
  });
  const [phoneError, setPhoneError] = useState("");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  const validatePhone = async (phone: string) => {
    if (!phone || phone.length !== 15) return;

    try {
      const response = await fetch(
        `${baseUrl}/api/clients/validate-phone?phone=${encodeURIComponent(phone)}&excludeId=${id}`,
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

  const fetchMeeting = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/meetings?clientId=${id}`, {
        headers: {
          "x-internal-request": "true",
        },
      });
      if (!response.ok) return;
      const data = await response.json();
      setMeeting(data[0] || null);
    } catch (error) {
      console.error("Erro ao buscar agendamento:", error);
    }
  };

  useEffect(() => {
    fetchMeeting();
  }, [id]);

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return;

      const imagePrefix = process.env.NEXT_PUBLIC_API_PREFIX || "";
      try {
        const response = await fetch(`${imagePrefix}/api/clients/${id}`, {
          headers: {
            "x-internal-request": "true",
          },
        });
        const data = await response.json();
        if (data) {
          const formattedPhone = data.phone.replace(/\D/g, "");

          setFormData({
            name: data.name,
            email: data.email,
            phone: formatPhoneNumber(formattedPhone),
            comment_last: data.comment_last,
            rating: data.rating,
            lead: data.lead,
            building_id: data.building_id,
          });
        }
      } catch (error) {
        console.error("Erro ao buscar cliente:", error);
      }
    };

    fetchClient();
  }, [id]);

  // Função para formatar o número de telefone
  const formatPhoneNumber = (value: string) => {
    if (!value) return "";

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

    return value;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const formattedValue = name === "name" ? formatName(value) : value;
    setFormData((prev: ClientFormData) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/api/clients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) return;
      router.push("/clientes");
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove formatação antes de aplicar nova formatação
    const numbers = value.replace(/\D/g, "");
    setFormData((prev) => ({
      ...prev,
      phone: formatPhoneNumber(numbers),
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handleLogout = async () => {
    try {
      await fetch(`${baseUrl}/api/auth/logout`, { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const getMeetingStatus = (meeting: Meeting) => {
    const now = new Date();
    const meetingDate = new Date(meeting.start_date);
    const meetingEndDate = new Date(meeting.end_date);

    // Se a reunião já terminou
    if (meetingEndDate.getTime() < now.getTime()) {
      return "bg-gray-100 text-gray-800";
    }

    // Se a reunião está acontecendo agora
    if (
      isSameHour(meetingDate, now) ||
      (meetingDate.getTime() <= now.getTime() &&
        meetingEndDate.getTime() >= now.getTime())
    ) {
      return "bg-red-100 text-red-800";
    }

    // Se a reunião é hoje e ainda não começou
    if (isSameDay(meetingDate, now) && meetingDate.getTime() > now.getTime()) {
      return "bg-red-100 text-red-800";
    }

    // Se a reunião é futura
    return "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="container mx-auto mb-6 p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 mt-32 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Editar Cliente</h1>
          {meeting && new Date(meeting.end_date) > new Date() && (
            <span
              className={`cursor-pointer rounded px-2 py-1 text-sm ${getMeetingStatus(meeting)}`}
              onClick={() =>
                setSelectedMeeting({
                  id: meeting.id,
                  clientId: id,
                  clientName: formData.name,
                })
              }
            >
              Agendado: {format(new Date(meeting.start_date), "dd/MM HH:mm")}
            </span>
          )}
          <button
            onClick={() =>
              setSelectedMeeting({
                id: meeting?.id || "",
                clientId: id,
                clientName: formData.name,
              })
            }
            className={`rounded p-1.5 ${
              meeting && new Date(meeting.end_date) > new Date()
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-500 text-white hover:bg-gray-600"
            }`}
            title={
              meeting && new Date(meeting.end_date) > new Date()
                ? "Ver Agendamento"
                : "Agendar Reunião"
            }
          >
            <Calendar className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-w-lg">
          <div className="mb-4">
            <label className="mb-2 block">Nome:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
                <option key={building.building_id} value={building.building_id}>
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
            <div className="mb-2 flex items-center justify-between">
              <label className="block">Comentário:</label>
              <button
                type="button"
                onClick={() => setShowHistory(true)}
                className="rounded bg-purple-500 px-3 py-1 text-sm text-white hover:bg-purple-600"
              >
                Ver Histórico
              </button>
            </div>
            <textarea
              name="comment_last"
              value={formData.comment_last}
              onChange={handleInputChange}
              className="w-full rounded border p-2"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={() => router.push(`${baseUrl}/clientes`)}
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

        <CommentHistoryModal
          clientId={id}
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
        />

        <MeetingModal
          isOpen={!!selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
          clientId={selectedMeeting?.clientId || ""}
          clientName={selectedMeeting?.clientName || ""}
          meeting={meeting || undefined}
          onMeetingChange={() => {
            fetchMeeting();
            setSelectedMeeting(null);
          }}
        />
      </div>
    </div>
  );
}
