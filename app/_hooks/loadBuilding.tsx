import { useState, useEffect, useCallback } from "react";
import { BuildingResultType } from "../_lib/types/BuildingType";
import { getBuildingData } from "../_use_cases";
export const useLoadBuilding = (id: number) => {
  const [buildingData, setBuildingData] = useState<BuildingResultType | null>(
    null,
  );

  const loadBuilding = useCallback(async () => {
    if (!buildingData || buildingData.building.building_id !== id) {
      try {
        const data = await getBuildingData(id);
        setBuildingData(data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }
  }, [buildingData, id]);

  useEffect(() => {
    loadBuilding();
  }, [loadBuilding]);

  return { buildingData }; // Retorna o objeto completo
};
