/* eslint-disable @next/next/no-img-element */
"use client";

import { LogoCyrela, LogoLiving, TermsModal } from ".";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PasswordModal } from "../components/PasswordModal";
import { setCookie } from "../_lib/cookieHandler";

type FooterProps = {
  id: number;
  darkColor: number;
  darkBackgroundHeader: number;
  hideExceptPolicies?: boolean;
};

const Footer = ({
  id,
  darkColor,
  darkBackgroundHeader,
  hideExceptPolicies = false,
}: FooterProps) => {
  const [showAuth, setShowAuth] = useState(false);
  const router = useRouter();
  const imagePrefix = process.env.NEXT_PUBLIC_API_PREFIX || "";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const [redirectActivated, setRedirectActivated] = useState(false);

  const handleAreaRestritaClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (redirectActivated) {
      await setCookie();
      handleAuthSuccess();
      return;
    }
    setShowAuth(true);
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    console.log("AQUI", baseUrl);
    router.push(`${baseUrl}/clientes`);
  };

  const handleCloseAuth = () => {
    setShowAuth(false);
  };

  return (
    <footer
      className={`flex w-full flex-col items-center justify-between ${darkColor === 1 && "bg-black"}`}
    >
      <div className="relative w-full">
        {!hideExceptPolicies && (
          <>
            <div
              style={{
                backgroundImage: `url('${imagePrefix}/${id}/header_divisor.png')`,
              }}
              className="flex h-1 w-full"
            />
            <div
              className="flex h-16 w-full items-center justify-center gap-10 px-10"
              style={{
                backgroundImage: `url('${imagePrefix}/${id}/background_header.png')`,
              }}
            >
              <div
                onDoubleClick={() => setRedirectActivated(!redirectActivated)}
                className="flex items-center justify-center gap-10"
              >
                {darkColor === 1 ? (
                  <>
                    <img
                      src={`${imagePrefix}/${id}/logo_cyrela.png`}
                      alt={"Logo Cyrela"}
                      width={190}
                      height={80}
                      className="object-contain"
                    />
                    <img
                      src={`${imagePrefix}/${id}/logo_projeto.png`}
                      alt={"Logo Projeto"}
                      width={120}
                      height={80}
                      className="object-contain"
                    />
                  </>
                ) : (
                  <>
                    <LogoCyrela
                      color={`${darkBackgroundHeader === 1 ? "#fff" : "#414142"}`}
                    />
                    <LogoLiving
                      color={`${darkBackgroundHeader === 1 ? "#fff" : "#414142"}`}
                    />
                  </>
                )}
              </div>
            </div>
          </>
        )}
        <div
          style={{
            backgroundImage: `url('${imagePrefix}/${id}/background_header.png')`,
          }}
          className={` ${darkBackgroundHeader === 1 ? "text-gray-200" : "text-gray-600"} flex w-full flex-col items-center justify-center space-x-4 pb-2 pt-2 text-sm md:flex-row`}
        >
          © {new Date().getFullYear()} frisco.dev.br. Todos os direitos
          reservados.
          <TermsModal />
          <a
            href={`${imagePrefix}/api/politica-de-privacidade`}
            target="_blank"
            className="ml-1 hover:text-orange-300"
          >
            Política de Privacidade.
          </a>
          <button
            onClick={handleAreaRestritaClick}
            className={`absolute bottom-1 right-4 -translate-y-1/2 rounded px-3 py-1 text-sm ${
              darkBackgroundHeader === 1
                ? `bg-slate-700 ${redirectActivated ? "text-green-200" : "text-slate-200"} hover:bg-slate-600`
                : `bg-slate-200 ${redirectActivated ? "text-green-700" : "text-slate-700"} hover:bg-slate-300`
            }`}
          >
            Área Restrita
          </button>
        </div>
      </div>
      {showAuth && (
        <PasswordModal
          onSuccess={handleAuthSuccess}
          onClose={handleCloseAuth}
        />
      )}
    </footer>
  );
};

export default Footer;
