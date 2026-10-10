import React from "react";
import { cn } from "@/lib/utils";

export function Toggle({
  on,
  onClick,
  label,
  className,
}: {
  on: boolean;
  onClick: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn("tg", on && "on", className)}
      aria-label={label || "Toggle setting"}
      onClick={onClick}
    />
  );
}
