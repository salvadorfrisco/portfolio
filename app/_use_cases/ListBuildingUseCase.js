import { fetchListBuilding } from "@/app/_services/listBuildingService";

export async function getListBuildingData() {
  // Aqui podemos adicionar qualquer lógica adicional de processamento dos dados
  const presentation = await fetchListBuilding();
  return presentation;
}
