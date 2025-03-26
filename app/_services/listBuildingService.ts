import axios from "axios";

export async function fetchListBuilding() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

    const response = await axios.get(`${baseUrl}/api/buildings`);

    return response.data.results;
  } catch (error) {
    console.error("Erro ao buscar building:", error);
    throw new Error("Erro ao buscar building");
  }
}
