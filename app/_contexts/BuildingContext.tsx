"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { BuildingResultType } from "../_lib/types/BuildingType";
import { useLoadBuilding } from "../_hooks/loadBuilding";
import { Loading } from "../_components";

// Defina o tipo do contexto
type BuildingContextType = {
  buildingData: BuildingResultType | null;
  isHeaderFixed: boolean;
  toggleHeaderFixed: () => void;
  brokerInfo: {
    phone: string;
    // ... outras propriedades do broker
  };
};

// Crie o contexto
export const BuildingContext = createContext<BuildingContextType | undefined>(
  undefined,
);

// Hook para acessar o contexto
export const useBuilding = () => {
  const context = useContext(BuildingContext);
  if (!context) {
    throw new Error("useBuilding deve ser usado dentro do BuildingProvider");
  }
  return context;
};

// Provider para encapsular a lógica de carregamento
export const BuildingProvider = React.memo(
  ({ id, children }: { id: number; children: ReactNode }) => {
    const [isHeaderFixed, setIsHeaderFixed] = useState(true);
    const { buildingData } = useLoadBuilding(id);

    const toggleHeaderFixed = useCallback(() => {
      setIsHeaderFixed((prev) => !prev);
    }, []);

    const value = useMemo(
      () => ({
        buildingData,
        isHeaderFixed,
        toggleHeaderFixed,
        brokerInfo: {
          phone: "",
          // ... outras propriedades do broker
        },
      }),
      [buildingData, isHeaderFixed, toggleHeaderFixed],
    );

    if (!buildingData) {
      return <Loading />;
    }

    return (
      <BuildingContext.Provider value={value}>
        {children}
      </BuildingContext.Provider>
    );
  },
);

// Adiciona a displayName
BuildingProvider.displayName = "BuildingProvider";
