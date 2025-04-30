// app/components/SplashScreen.tsx
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);
  const [animateF, setAnimateF] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 600), // S
      setTimeout(() => setStep(2), 1000), // F
      setTimeout(() => setStep(3), 1800), // tech
      setTimeout(() => setStep(4), 2200), // logo final
      setTimeout(() => onFinish(), 3600), // fim
    ];
    return () => timers.forEach(clearTimeout);
  }, [onFinish]);

  // Ativa a animação do F quando step === 2
  useEffect(() => {
    if (step === 2) {
      setAnimateF(true);
      // Remove a animação depois de 0.8s para permitir reuso se necessário
      const timeout = setTimeout(() => setAnimateF(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [step]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-all duration-500">
      <div className="relative flex h-40 w-80 items-center justify-center">
        {/* Só mostra S, F e tech até o step 2 */}
        {step < 3 && (
          <>
            {step >= 0 && (
              <Image
                src="/s.png"
                alt="S"
                width={74}
                height={99}
                className={`absolute left-0 top-0 transition-opacity duration-500 ${step >= 1 ? "opacity-100" : "opacity-0"}`}
              />
            )}
            {step >= 1 && (
              <Image
                src="/tech.png"
                alt="F"
                width={105}
                height={73}
                className={`absolute left-28 top-0 transition-all duration-1000 ${step >= 2 ? "opacity-100" : "opacity-0"} ${animateF ? "animate-[spin_0.6s_linear]" : ""}`}
                style={{ transformOrigin: "center center" }}
              />
            )}
            {step >= 2 && (
              <Image
                src="/f.png"
                alt="tech"
                width={54}
                height={63}
                className={`absolute left-[44] top-[-3] transition-opacity duration-500 ${step === 2 ? "opacity-100" : "opacity-0"}`}
              />
            )}
          </>
        )}
        {/* Mostra só a logo final a partir do step 3 */}
        {step >= 3 && (
          <Image
            src="/logo_sf.png"
            alt="Logo SF tech"
            width={260}
            height={130}
            className={`duration-[5000ms] absolute left-0 top-0 transition-all ease-in-out ${step >= 3 ? "scale-100 opacity-100" : "scale-80 opacity-0"}`}
          />
        )}
      </div>
    </div>
  );
}
