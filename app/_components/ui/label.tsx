"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/app/_lib/utils";

// Adicione variantes para personalizar estilo
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      customStyle: {
        default: "",
        largeGray: "text-lg text-slate-600 font-bold",
        largeRed: "text-lg text-red-600 font-bold",
      },
    },
    defaultVariants: {
      customStyle: "default", // Estilo padrão
    },
  },
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, customStyle, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ customStyle }), className)} // Aplica a variante
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
