"use client";

import { useState, useEffect } from "react";
import { format, isSameDay, addMonths, subMonths } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Meeting } from "@/app/_types/meeting";
import { MeetingModal } from "../components/MeetingModal";
import { useRouter } from "next/navigation";
import { ptBR } from "date-fns/locale";

export default function AgendaPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showOnlyMeetingDays, setShowOnlyMeetingDays] = useState(false);
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/meetings`, {
        headers: {
          "x-internal-request": "true",
        },
      });
      if (!response.ok) return;
      const data = await response.json();

      // Ajusta as datas para o fuso horário local
      const adjustedMeetings = data.map((meeting: Meeting) => ({
        ...meeting,
        start_date: toZonedTime(
          meeting.start_date,
          "America/Sao_Paulo",
        ).toISOString(),
        end_date: toZonedTime(
          meeting.end_date,
          "America/Sao_Paulo",
        ).toISOString(),
      }));

      setMeetings(adjustedMeetings);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    }
  };

  const getMeetingsForDate = (date: Date) => {
    return meetings.filter((meeting) => {
      const meetingDate = toZonedTime(meeting.start_date, "America/Sao_Paulo");
      return (
        meetingDate.getFullYear() === date.getFullYear() &&
        meetingDate.getMonth() === date.getMonth() &&
        meetingDate.getDate() === date.getDate()
      );
    });
  };

  const renderCalendarDays = () => {
    const days = [];
    const startDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1,
    );
    const endDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0,
    );
    const firstDayOfWeek = startDate.getDay();

    // Adiciona os dias vazios no início do mês
    if (!showOnlyMeetingDays) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        days.push(<div key={`empty-${i}`} className="h-32 border p-2" />);
      }
    }

    // Renderiza os dias do mês
    for (let i = 1; i <= endDate.getDate(); i++) {
      const currentDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        i,
      );
      const dayMeetings = getMeetingsForDate(currentDate);

      // Se showOnlyMeetingDays está ativo e não há reuniões, pula este dia
      if (showOnlyMeetingDays && dayMeetings.length === 0) {
        continue;
      }

      const isToday = isSameDay(currentDate, new Date());

      days.push(
        <div
          key={i}
          className={`h-32 border p-2 ${isToday ? "bg-blue-50" : ""}`}
          onClick={() => handleDateClick(currentDate)}
        >
          <div className="mb-1 text-sm font-semibold">{i}</div>
          <div className="space-y-1">
            {dayMeetings.map((meeting) => {
              const meetingText = `${format(
                toZonedTime(meeting.start_date, "America/Sao_Paulo"),
                "HH:mm",
              )} - ${meeting.client_name}`;
              const meetingEndTime = format(
                toZonedTime(meeting.end_date, "America/Sao_Paulo"),
                "HH:mm",
              );
              const tooltipText = `${meetingText}\nFim: ${meetingEndTime}${meeting.notes ? `\nObs: ${meeting.notes}` : ""}`;

              return (
                <div
                  key={meeting.id}
                  className={`cursor-pointer rounded px-2 py-1 text-xs ${getMeetingStatus(meeting)}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMeetingClick(meeting);
                  }}
                  title={tooltipText}
                >
                  <div className="truncate">{meetingText}</div>
                </div>
              );
            })}
          </div>
        </div>,
      );
    }

    return days;
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

    // Se há sobreposição com outra reunião, retorna vermelho
    const dayMeetings = getMeetingsForDate(meetingDate);
    if (hasOverlappingMeetings(dayMeetings, meeting)) {
      return "bg-red-100 text-red-800";
    }

    // Se a reunião já terminou
    if (meetingEndDate.getTime() < now.getTime()) {
      return "bg-blue-100 text-blue-800";
    }

    // Se a reunião está acontecendo agora
    if (
      meetingDate.getTime() <= now.getTime() &&
      meetingEndDate.getTime() >= now.getTime()
    ) {
      return "bg-yellow-100 text-yellow-800";
    }

    // Se a reunião é hoje e ainda não começou
    if (isSameDay(meetingDate, now) && meetingDate.getTime() > now.getTime()) {
      return "bg-green-100 text-green-800";
    }

    // Se a reunião é futura
    return "bg-yellow-100 text-yellow-800";
  };

  const hasOverlappingMeetings = (
    meetings: Meeting[],
    currentMeeting: Meeting,
  ) => {
    if (meetings.length <= 1) return false;

    const currentStart = new Date(currentMeeting.start_date);
    const currentEnd = new Date(currentMeeting.end_date);

    return meetings.some((meeting) => {
      if (meeting.id === currentMeeting.id) return false;

      const meetingStart = new Date(meeting.start_date);
      const meetingEnd = new Date(meeting.end_date);

      // Verifica se há sobreposição
      return (
        (currentStart >= meetingStart && currentStart < meetingEnd) ||
        (currentEnd > meetingStart && currentEnd <= meetingEnd) ||
        (currentStart <= meetingStart && currentEnd >= meetingEnd)
      );
    });
  };

  const handleDateClick = (date: Date) => {
    // Cria uma nova data mantendo o fuso horário local
    const localDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      9, // Define para 9:00 para evitar problemas com fuso horário
      0,
      0,
    );
    setSelectedDate(localDate);
  };

  const handleMeetingClick = (meeting: Meeting) => {
    // Ajusta a data do meeting para o fuso horário local
    const meetingDate = new Date(meeting.start_date);
    const localDate = new Date(
      meetingDate.getFullYear(),
      meetingDate.getMonth(),
      meetingDate.getDate(),
      meetingDate.getHours(),
      meetingDate.getMinutes(),
    );
    setSelectedMeeting({ ...meeting, start_date: localDate.toISOString() });
  };

  return (
    <div className="container mx-auto min-h-screen bg-white p-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 mt-32 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Agenda de Reuniões</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push(`${baseUrl}/clientes`)}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Lista de Clientes
            </button>
            <button
              onClick={handleLogout}
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
              className="rounded bg-gray-100 px-3 py-1 hover:bg-gray-200"
            >
              ←
            </button>
            <h2 className="text-xl font-semibold">
              {format(selectedDate, "MMMM yyyy", { locale: ptBR })}
            </h2>
            <button
              onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
              className="rounded bg-gray-100 px-3 py-1 hover:bg-gray-200"
            >
              →
            </button>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlyMeetingDays}
                onChange={(e) => setShowOnlyMeetingDays(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span>Mostrar apenas dias com reuniões</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {!showOnlyMeetingDays && (
            <>
              <div className="border p-2 text-center font-semibold">Dom</div>
              <div className="border p-2 text-center font-semibold">Seg</div>
              <div className="border p-2 text-center font-semibold">Ter</div>
              <div className="border p-2 text-center font-semibold">Qua</div>
              <div className="border p-2 text-center font-semibold">Qui</div>
              <div className="border p-2 text-center font-semibold">Sex</div>
              <div className="border p-2 text-center font-semibold">Sáb</div>
            </>
          )}
          {renderCalendarDays()}
        </div>

        <MeetingModal
          isOpen={!!selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
          clientId={selectedMeeting?.client_id || ""}
          clientName={selectedMeeting?.client_name || ""}
          meeting={selectedMeeting || undefined}
          onMeetingChange={fetchMeetings}
        />
      </div>
    </div>
  );
}
