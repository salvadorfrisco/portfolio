import axios from "axios";

export async function fetchBroker() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    const brokerId = process.env.NEXT_PUBLIC_BROKER_ID || "";
    const response = await axios.get(`${baseUrl}/api/broker/${brokerId}`);
    return response.data.broker;
  } catch (error) {
    console.error("Erro ao buscar broker:", error);
    throw new Error("Erro ao buscar broker");
  }
}
