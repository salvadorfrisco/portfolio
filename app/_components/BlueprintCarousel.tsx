/* eslint-disable @next/next/no-img-element */

import { Key } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

import { BlueprintCarouselProps } from "../_lib/types";

const BlueprintCarousel = ({
  id,
  images,
  tall = 0,
}: BlueprintCarouselProps) => {
  const imagePrefix = process.env.NEXT_PUBLIC_API_PREFIX || "";

  return (
    <div className="relative flex items-center justify-center">
      {images && images.length > 0 && (
        <Carousel className="relative w-full max-w-5xl md:mx-8 lg:mx-10">
          <CarouselContent>
            {images.map((image, index: Key | null | undefined) => (
              <CarouselItem key={index} className="flex justify-center">
                <img
                  src={`${imagePrefix}/${id}/${image.file_name}`}
                  alt={image.description}
                  className={`rounded-lg border-2 border-yellow-900 ${tall ? "h-[340px] sm:h-[440px] md:h-[540px] lg:h-[640px]" : "h-72 sm:h-80 md:h-[440px] lg:h-[540px]"} `}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Botão anterior */}
          <CarouselPrevious className="absolute left-2 top-1/2 z-10 flex h-36 w-8 -translate-y-1/2 transform items-center justify-center bg-black/20 text-slate-100 hover:bg-black/30" />
          {/* Botão próximo */}
          <CarouselNext className="absolute right-2 top-1/2 z-10 flex h-36 w-8 -translate-y-1/2 transform items-center justify-center bg-black/20 text-slate-100 hover:bg-black/30" />
        </Carousel>
      )}
    </div>
  );
};
export default BlueprintCarousel;
