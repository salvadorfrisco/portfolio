import { fetchBuilding, fetchBroker } from "@/app/_services";

export async function getBuildingData(id) {
  // Aqui podemos adicionar qualquer lógica adicional de processamento dos dados
  const buildingData = await fetchBuilding(id);
  const brokerData = await fetchBroker();

  const result = {
    broker: brokerData,
    building: buildingData.building,
    buildingList: buildingData.buildingList,
  };

  return result;
}
