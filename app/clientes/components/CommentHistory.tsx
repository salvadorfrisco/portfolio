"use client";

import { useState, useEffect } from "react";
import { CommentHistory } from "@/app/_types/client";

interface CommentHistoryModalProps {
  clientId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CommentHistoryModal({
  clientId,
  isOpen,
  onClose,
}: CommentHistoryModalProps) {
  const [comments, setComments] = useState<CommentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const imagePrefix = process.env.NEXT_PUBLIC_API_PREFIX || "";

  useEffect(() => {
    const fetchComments = async () => {
      if (!clientId) return;

      setLoading(true);
      try {
        const response = await fetch(
          `${imagePrefix}/api/clients/${clientId}/comments`,
          {
            headers: {
              "x-internal-request": "true",
            },
          },
        );
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchComments();
    }
  }, [clientId, imagePrefix, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Histórico de Comentários</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : comments.length > 0 ? (
          <div className="max-h-96 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b py-3">
                <p className="text-gray-700">{comment.comment}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhum comentário encontrado.</p>
        )}
      </div>
    </div>
  );
}
