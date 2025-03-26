/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
// import { LogoCyrela, LogoLiving } from "./";
import { useBuilding } from "@/app/_contexts/BuildingContext";
import { ChevronUp, ChevronDown } from "lucide-react"; // Importar os ícones
import LogoCyrela from "./LogoCyrela";
import LogoLiving from "./LogoLiving";
import Loading from "./Loading";

export const Header = () => {
  const { buildingData, isHeaderFixed, toggleHeaderFixed } = useBuilding();
  const [isScrollBeyondThreshold, setIsScrollBeyondThreshold] = useState(false);
  const [isScreenHeightBelowThreshold, setIsScreenHeightBelowThreshold] =
    useState(false);
  const imagePrefix = process.env.NEXT_PUBLIC_API_PREFIX || "";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrollBeyondThreshold(window.scrollY > 300);
    };

    const handleResize = () => {
      setIsScreenHeightBelowThreshold(window.innerHeight < 500);
    };

    handleResize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!buildingData) return <Loading />;

  return (
    <header
      className={`${isHeaderFixed ? "fixed" : "relative"} header z-20 w-full text-4xl shadow-lg transition-transform duration-1000 ease-in-out`}
    >
      {buildingData && (
        <>
          <div
            style={{
              backgroundImage: `url('${imagePrefix}/${buildingData?.building.building_id}/background_header.png')`,
            }}
            className="flex h-24 w-full flex-col md:h-28 md:flex-row md:pl-11 md:pr-6"
          >
            <div className="mt-3 flex w-full justify-between sm:mt-2">
              <img
                src={`${imagePrefix}/logo_sonia${buildingData?.building.presentation_dark_background_header === 0 ? "_dark" : ""}.png`}
                alt={
                  buildingData?.building.building_name ?? "Logo Sonia da Cyrela"
                }
                width={300}
                height={170}
                className="max-h-[70px] object-contain sm:max-h-[80px] md:max-h-[90px]"
              />
              <div className="-mt-1 flex items-center justify-center sm:-mt-2 md:mx-auto md:w-full">
                <img
                  src={`${imagePrefix}/${buildingData?.building.building_id}/logo.png`}
                  alt={
                    buildingData?.building.building_name ??
                    "Logo Empreendimento"
                  }
                  width={320}
                  height={170}
                  className="max-h-[70px] object-contain sm:max-h-[80px] md:max-h-[90px]"
                />

                {buildingData?.building.presentation_star_effect === 1 && (
                  <div className="star">
                    <img
                      src={`${imagePrefix}/star.png`}
                      alt="Estrela piscante"
                      width={11}
                      height={8}
                      className="absolute top-3 -ml-28 object-contain sm:-ml-36 md:top-4"
                    />
                  </div>
                )}
              </div>
            </div>
            <div
              className={`${isHeaderFixed ? "mr-0" : "mr-6"} flex w-48 items-center justify-center text-sm md:w-60`}
            >
              <div
                className={`-mt-4 hidden flex-col items-center justify-center md:flex`}
              >
                {buildingData?.building.presentation_dark_color === 1 ? (
                  <>
                    <img
                      src={`${imagePrefix}/${buildingData?.building.building_id}/logo_cyrela.png`}
                      alt={"Logo Cyrela"}
                      width={120}
                      height={30}
                      className="min-w-[112px] object-contain"
                    />
                    <img
                      src={`${imagePrefix}/${buildingData?.building.building_id}/logo_projeto.png`}
                      alt={"Logo Projeto"}
                      width={90}
                      height={30}
                      className="object-contain"
                    />
                  </>
                ) : (
                  <>
                    <LogoCyrela
                      color={`${buildingData?.building.presentation_dark_background_header === 1 ? "#fff" : "#414142"}`}
                    />
                    <LogoLiving
                      color={`${buildingData?.building.presentation_dark_background_header === 1 ? "#fff" : "#414142"}`}
                    />
                  </>
                )}
              </div>
              <div
                className={`${isHeaderFixed ? "relative" : "fixed"} ${
                  isScrollBeyondThreshold && !isHeaderFixed
                    ? "-mt-10"
                    : "ml-6 md:ml-0"
                } flex flex-row items-center justify-end gap-2 text-slate-700`}
              >
                {isScrollBeyondThreshold && isScreenHeightBelowThreshold ? (
                  <button
                    onClick={toggleHeaderFixed}
                    aria-label="Alternar fixação do header"
                    className="mr-9 flex h-7 w-7 items-center justify-center rounded-2xl bg-slate-400 text-white opacity-75 hover:bg-slate-300 hover:text-black hover:opacity-100"
                  >
                    {isHeaderFixed ? (
                      <ChevronUp className="h-6 w-6" />
                    ) : (
                      <ChevronDown className="h-6 w-6" />
                    )}
                  </button>
                ) : (
                  <div className="w-16"></div>
                )}
              </div>
            </div>
          </div>
          <div
            style={{
              backgroundImage: `url('${imagePrefix}/${buildingData?.building.building_id}/header_divisor.png')`,
            }}
            className="flex h-1 w-full"
          />
        </>
      )}
    </header>
  );
};

export default Header;
