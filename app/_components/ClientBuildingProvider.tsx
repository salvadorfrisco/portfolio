"use client";

import { Suspense } from "react"; // Importando Suspense do React
import { useSearchParams } from "next/navigation";
import { BuildingProvider } from "@/app/_contexts/BuildingContext";
import React from "react";
import Loading from "./Loading";

const ClientBuildingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Suspense fallback={<Loading />}>
      <SearchParamsContent>{children}</SearchParamsContent>
    </Suspense>
  );
};

const SearchParamsContent = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const urlId = searchParams.get("id");

  /* Alterar aqui para incluir um novo empreendimento */
  const isValidId = urlId && !isNaN(Number(urlId)) && Number(urlId) <= 6;
  const id = isValidId
        ? Number(urlId)
        : Math.floor(Math.random() * 6) + 1;

  return <BuildingProvider id={id}>{children}</BuildingProvider>;
};

export default ClientBuildingProvider;
