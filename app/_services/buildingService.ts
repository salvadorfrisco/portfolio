import axios from "axios";

export async function fetchBuilding(id: number) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    const response = await axios.get(`${baseUrl}/api/building/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar building:", error);
    throw new Error("Erro ao buscar building");
  }
}
