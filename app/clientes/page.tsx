"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Client } from "@/app/_types/client";
import { Meeting } from "@/app/_types/meeting";
import Link from "next/link";
import CommentHistoryModal from "./components/CommentHistory";
import { useBuilding } from "../_contexts/BuildingContext";
import { StarRating } from "../components/StarRating";
import {
  ArrowUpDown,
  Star,
  Edit,
  Trash2,
  History,
  Calendar,
  CircleOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { MeetingModal } from "../components/MeetingModal";
import { isBefore, isSameDay, format } from "date-fns";

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const imagePrefix = process.env.NEXT_PUBLIC_API_PREFIX || "";
  const { buildingData } = useBuilding();
  const [sortBy, setSortBy] = useState<"rating" | "updated_at" | "name" | null>(
    null,
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const router = useRouter();
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    id: string;
    name: string;
    active: boolean;
  }>({ show: false, id: "", name: "", active: false });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState<{
    id: string;
    clientId: string;
    clientName: string;
  } | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [filterScheduled, setFilterScheduled] = useState(false);
  const [showInactives, setShowInactives] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  const fetchClients = useCallback(async () => {
    try {
      const response = await fetch(
        `${imagePrefix}/api/clients?inactives=${showInactives}`,
        {
          headers: {
            "x-internal-request": "true",
          },
          cache: "no-store",
        },
      );
      if (!response.ok) {
        setClients([]);
        return;
      }
      const data = await response.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      setClients([]);
    }
  }, [imagePrefix, showInactives]);

  const fetchMeetings = useCallback(async () => {
    try {
      const response = await fetch(`${imagePrefix}/api/meetings`, {
        headers: {
          "x-internal-request": "true",
        },
      });
      if (!response.ok) return;
      const data = await response.json();
      setMeetings(data);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    }
  }, [imagePrefix]);

  useEffect(() => {
    fetchClients();
    fetchMeetings();
  }, [fetchClients, fetchMeetings]);

  const handleDeleteClick = (id: string, name: string, active: boolean) => {
    setDeleteConfirm({ show: true, id, name, active });
  };

  const handleDeleteConfirm = async () => {
    try {
      await fetch(
        `${imagePrefix}/api/clients/${deleteConfirm.id}?active=${deleteConfirm.active}`,
        {
          method: "DELETE",
        },
      );
      fetchClients();
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
    } finally {
      setDeleteConfirm({ show: false, id: "", name: "", active: false });
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`${imagePrefix}/api/clients/export`, {
        headers: {
          "x-internal-request": "true",
        },
      });
      if (!response.ok) throw new Error("Erro ao exportar");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        "Clientes Sonia Abdala - " +
        new Date().toLocaleDateString("pt-BR") +
        ".xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Erro ao exportar:", error);
    }
  };

  const handleExportWhatsApp = async () => {
    try {
      const response = await fetch(`${imagePrefix}/api/clients/export`, {
        headers: {
          "x-internal-request": "true",
        },
      });
      if (!response.ok) throw new Error("Erro ao exportar");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileName = `Clientes Sonia Abdala - ${new Date().toLocaleDateString("pt-BR")}.xlsx`;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      // Formatar o número do WhatsApp
      const whatsappNumber =
        buildingData?.broker?.phone?.replace(/\D/g, "") || "";

      // Criar mensagem com instruções
      const text = `Segue a planilha *${fileName}* de clientes atualizada.`;
      const whatsappUrl = `https://wa.me/55${whatsappNumber}?text=${encodeURIComponent(text)}`;

      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("Erro ao exportar para WhatsApp:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${baseUrl}/api/auth/logout`, { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const sortedClients = useMemo(() => {
    if (!Array.isArray(clients)) return [];
    let filteredClients = clients;

    // Aplica o filtro de pesquisa por nome
    if (searchTerm.trim()) {
      filteredClients = clients.filter((client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Aplica o filtro de clientes agendados
    if (filterScheduled) {
      filteredClients = filteredClients.filter((client) => {
        const clientMeeting = meetings.find((m) => m.client_id === client.id);
        return clientMeeting && new Date(clientMeeting.end_date) > new Date();
      });
    }

    // Aplica a ordenação
    if (!sortBy) return filteredClients;

    return [...filteredClients].sort((a, b) => {
      if (sortBy === "rating") {
        return sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating;
      }

      if (sortBy === "updated_at") {
        const dateA = new Date(a.updated_at || a.created_at).getTime();
        const dateB = new Date(b.updated_at || b.created_at).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      }

      if (sortBy === "name") {
        return sortOrder === "desc"
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name);
      }

      return 0;
    });
  }, [clients, sortBy, sortOrder, searchTerm, filterScheduled, meetings]);

  const toggleSort = (field: "rating" | "updated_at" | "name") => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const getMeetingStatus = (meeting: Meeting) => {
    const now = new Date();
    const meetingDate = new Date(meeting.start_date);

    if (isBefore(meetingDate, now)) {
      return "bg-gray-100 text-gray-800";
    }

    if (isSameDay(meetingDate, now)) {
      return "bg-red-100 text-red-800";
    }

    return "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="container mx-auto min-h-screen bg-white p-4">
      <div className="max-w-5x mx-auto grid-cols-3 md:grid-cols-5">
        <div className="mb-5 mt-32 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex gap-4">
            <Link
              href={`${imagePrefix}/cadastro`}
              className="mr-2 whitespace-nowrap rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Novo Cliente
            </Link>
            <button
              onClick={handleExport}
              className="whitespace-nowrap rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Excel
            </button>
            <button
              onClick={handleExportWhatsApp}
              className="whitespace-nowrap rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              WhatsApp
            </button>
          </div>
          <div className="flex gap-4">
            <Link
              href={`${imagePrefix}/agenda`}
              className="whitespace-nowrap rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
            >
              Ver Agenda
            </Link>
            <button
              onClick={handleLogout}
              className="whitespace-nowrap rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600"
            >
              Sair
            </button>
          </div>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Pesquisar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 text-lg focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="mb-4 flex items-center gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filterScheduled}
              onChange={(e) => setFilterScheduled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span>Apenas clientes agendados</span>
          </label>
          <label className="ml-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={showInactives}
              onChange={(e) => setShowInactives(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span>Inativos</span>
          </label>
        </div>
        <div className="mb-8 flex gap-3">
          <button
            onClick={() => toggleSort("name")}
            className={`flex items-center gap-1 rounded px-2 py-1 ${
              sortBy === "name" ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            Nome
            <ArrowUpDown className="h-4 w-4" />
          </button>
          <button
            onClick={() => toggleSort("rating")}
            className={`flex items-center gap-1 rounded px-2 py-1 ${
              sortBy === "rating" ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <ArrowUpDown className="h-4 w-4" />
          </button>
          <button
            onClick={() => toggleSort("updated_at")}
            className={`flex items-center gap-1 rounded px-1 py-1 ${
              sortBy === "updated_at" ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            Atualização
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
        <h1 className="text-2xl font-bold">Lista de Clientes</h1>

        <div className="mt-4 grid gap-4">
          {sortedClients.map((client) => {
            const clientMeeting = meetings.find(
              (m) => m.client_id === client.id,
            );
            return (
              <div
                key={client.id}
                className={`rounded border ${client.active ? "bg-slate-100" : "bg-slate-200"} px-4 py-2 shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <h2
                    className={`text-xl ${!client.active && "text-slate-500"} font-semibold`}
                  >
                    {client.name}
                    {!client.active && (
                      <span className="ml-4 font-extralight">(inativo)</span>
                    )}
                  </h2>
                  <div className="flex items-center gap-2">
                    {client.lead === 1 && (
                      <span className="rounded bg-yellow-100 px-2 py-1 text-sm text-yellow-800">
                        Lead
                      </span>
                    )}
                    {client.building_id > 0 && buildingData?.buildingList && (
                      <span className="rounded bg-blue-100 px-2 py-1 text-sm text-blue-800">
                        {
                          buildingData.buildingList.find(
                            (b) => b.building_id === client.building_id,
                          )?.building_name
                        }
                      </span>
                    )}
                    {clientMeeting &&
                      new Date(clientMeeting.end_date) > new Date() && (
                        <span
                          className={`cursor-pointer rounded px-2 py-1 text-sm ${getMeetingStatus(clientMeeting)}`}
                          onClick={() =>
                            setSelectedMeeting({
                              id: clientMeeting.id,
                              clientId: client.id,
                              clientName: client.name,
                            })
                          }
                          title={`${clientMeeting.notes}`}
                        >
                          Agendado:{" "}
                          {format(
                            new Date(clientMeeting.start_date),
                            "dd/MM HH:mm",
                          )}
                        </span>
                      )}
                    <button
                      onClick={() =>
                        setSelectedMeeting({
                          id: clientMeeting?.id || "",
                          clientId: client.id,
                          clientName: client.name,
                        })
                      }
                      className={`rounded p-1.5 ${
                        clientMeeting &&
                        new Date(clientMeeting.end_date) > new Date()
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-gray-500 text-white hover:bg-gray-600"
                      }`}
                      title={
                        clientMeeting &&
                        new Date(clientMeeting.end_date) > new Date()
                          ? "Ver Agendamento"
                          : "Agendar Reunião"
                      }
                    >
                      <Calendar className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex items-center space-x-10">
                  <StarRating
                    rating={client.rating}
                    readonly
                    className="h-4 w-4"
                  />
                  <Link
                    href={`${imagePrefix}/clientes/${client.id}`}
                    className="rounded bg-blue-500 p-1.5 text-white hover:bg-blue-600"
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => setSelectedClientId(client.id)}
                    className="rounded bg-purple-500 p-1.5 text-white hover:bg-purple-600"
                    title="Histórico"
                  >
                    <History className="h-4 w-4" />
                  </button>
                  {client.active ? (
                    <CircleOff
                      onClick={() =>
                        handleDeleteClick(client.id, client.name, client.active)
                      }
                      className="h-6 w-6 text-gray-500 hover:cursor-pointer hover:text-gray-600"
                    />
                  ) : (
                    <Trash2
                      onClick={() =>
                        handleDeleteClick(client.id, client.name, client.active)
                      }
                      className="h-6 w-6 text-red-500 hover:cursor-pointer hover:text-red-600"
                    />
                  )}
                </div>
                <p className="text-[16px] text-blue-700 md:text-[20px]">
                  {client.phone} - {client.email}
                </p>
                <p className="text-[16px] md:text-[20px]">
                  {client.comment_last}
                </p>
              </div>
            );
          })}
        </div>

        <CommentHistoryModal
          clientId={selectedClientId || ""}
          isOpen={!!selectedClientId}
          onClose={() => setSelectedClientId(null)}
        />

        <MeetingModal
          isOpen={!!selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
          clientId={selectedMeeting?.clientId || ""}
          clientName={selectedMeeting?.clientName || ""}
          meeting={
            selectedMeeting?.id
              ? meetings.find((m) => m.id === selectedMeeting.id)
              : undefined
          }
          onMeetingChange={fetchMeetings}
        />

        <DeleteConfirmModal
          isOpen={deleteConfirm.show}
          onClose={() =>
            setDeleteConfirm({ show: false, id: "", name: "", active: false })
          }
          onConfirm={handleDeleteConfirm}
          itemName={deleteConfirm.name}
          active={deleteConfirm.active}
        />
      </div>
    </div>
  );
}
