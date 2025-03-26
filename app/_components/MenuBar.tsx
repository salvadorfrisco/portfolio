/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { MenuBarProps } from "../_lib/types";
import { RegistrationForm } from ".";
import { useSearchParams } from "next/navigation";

export const MenuBar = ({
  buildingName,
  buildingList,
  phoneNumber,
  facebookUrl,
  instagramUrl,
  footer = false,
}: MenuBarProps) => {
  const searchParams = useSearchParams();
  const openFormParam = searchParams.get("openForm");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [showTimeout, setShowTimeout] = useState<NodeJS.Timeout | null>(null);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(openFormParam ?? false);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  const handleMouseEnter = () => {
    if (hideTimeout) clearTimeout(hideTimeout);
    const timeout = setTimeout(() => setDropdownVisible(true), 600);
    setShowTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (showTimeout) clearTimeout(showTimeout);
    const timeout = setTimeout(() => setDropdownVisible(false), 2000);
    setHideTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (showTimeout) clearTimeout(showTimeout);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [showTimeout, hideTimeout]);

  return (
    <div className="text-md flex w-full items-center justify-center">
      <div
        className={`mx-0 grid grid-cols-1 gap-1 py-2 sm:mx-3 md:mx-12 md:grid-cols-2 lg:mx-auto lg:flex lg:flex-row lg:gap-4`}
      >
        {!footer && buildingList?.length > 0 && (
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="lancamentos h-10 w-full cursor-pointer rounded-lg bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 px-6 py-2 text-center text-white transition hover:bg-yellow-100 hover:text-orange-800">
              LANÇAMENTOS
            </div>
            {isDropdownVisible && (
              <ul className="absolute left-0 top-full z-50 mt-2 w-80 whitespace-nowrap rounded border bg-white text-slate-700 shadow-lg">
                {buildingList.map((b) => {
                  let title =
                    " - " +
                    b.presentation_title
                      ?.replace("by Living", "")
                      .replace("Rua", "");

                  title = title !== " - " ? title : "";

                  return (
                    b.building_name !== buildingName &&
                    b.building_has_site == 1 && (
                      <li
                        key={b.building_id}
                        className="cursor-pointer px-4 py-2 hover:bg-yellow-100 hover:text-orange-800"
                        onClick={() =>
                          (window.location.href = `${baseUrl}/?id=${b.building_id}`)
                        }
                      >
                        {b.building_name}
                        {title}
                      </li>
                    )
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {!footer && (
          <button
            className="h-10 w-full rounded-lg px-4 transition hover:bg-yellow-100 hover:text-orange-800"
            onClick={() => {
              const plantasSection = document.getElementById("plantas");
              if (plantasSection)
                plantasSection.scrollIntoView({ behavior: "smooth" });
            }}
          >
            PLANTAS
          </button>
        )}
        <div
          className="flex h-10 items-center gap-1 whitespace-nowrap rounded-lg px-4 transition hover:cursor-pointer hover:bg-yellow-100 hover:text-orange-800"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={`${baseUrl}/logo_email-t.png`}
            alt="ícone de email"
            className="h-8 w-8 shrink-0 object-cover"
          />

          <span className="w-52">FALE COM CORRETOR</span>
        </div>

        <div className="flex h-10 w-full items-center justify-center gap-4 whitespace-nowrap px-4 lg:justify-start">
          {phoneNumber && (
            <a
              href={`https://wa.me/55${phoneNumber}?text=Olá! Gostaria de saber mais informações sobre o lançamento ${buildingName}`}
              aria-label="WhatsApp"
              target="_blank"
              className="h-9 w-9 rounded-full transition hover:bg-green-100"
              title="Compre seu imóvel"
            >
              <img
                src={`${baseUrl}/logo_whatsapp-t.png`}
                alt="Instagram Logo"
                className="h-full w-full object-contain"
              />
            </a>
          )}

          {facebookUrl && (
            <a
              href={facebookUrl}
              target="_blank"
              className="h-10 w-10 rounded-full p-0.5 transition hover:bg-blue-200"
              title="Acesse nossa página do Facebook"
            >
              <img
                src={`${baseUrl}/logo_facebook-t.png`}
                alt="Facebook Logo"
                className="h-full w-full object-contain"
              />
            </a>
          )}
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              className="h-8 w-8 rounded-xl transition hover:bg-orange-100"
              title="Siga-nos no Instagram"
            >
              <img
                src={`${baseUrl}/logo_instagram-t.png`}
                alt="Instagram Logo"
                className="h-full w-full object-contain"
              />
            </a>
          )}
        </div>

        {isModalOpen && (
          <RegistrationForm onClose={() => setIsModalOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default MenuBar;
