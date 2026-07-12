import React from "react";
import { cn } from "../../lib/utils";

interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function RainbowButton({
  children,
  className,
  disabled,
  ...props
}: RainbowButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "relative inline-flex h-14 cursor-pointer items-center justify-center rounded-full px-8 py-3 transition-all duration-300 active:scale-98 disabled:pointer-events-none disabled:opacity-40 overflow-hidden",
        // Shimmer gradient background
        "bg-gradient-to-r from-[#FAFAF7] via-white to-[#FAFAF7] bg-[length:200%_auto] animate-shimmer",
        // Elegant border and soft shadow
        "border border-black/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {/* Button Text using Calligraphy font */}
      <span className="relative z-10 flex items-center justify-center gap-3 font-calligraphy text-2xl md:text-3xl font-semibold text-black tracking-wide w-full leading-none select-none">
        {children}
      </span>
    </button>
  );
}
