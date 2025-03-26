import axios from "axios";

export async function fetchIpAddress() {
  try {
    const apiPrefix = process.env.NEXT_PUBLIC_API_PREFIX || "";

    const response = await axios.get(`${apiPrefix}/api/ip`);
    return response.data.ip;
  } catch (error) {
    console.error("Erro ao buscar o IP:", error);
    throw new Error("Erro ao buscar o IP");
  }
}
