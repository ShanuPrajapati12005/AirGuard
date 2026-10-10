import React from "react";
import { colorFor, initials, cn } from "@/lib/utils";

export function AvatarStack({ names, max = 3 }: { names: string[]; max?: number }) {
  return (
    <span className="inline-flex -space-x-2">
      {(names || []).slice(0, max).map((n) => (
        <span
          key={n}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-[var(--card)] shadow-xs"
          title={n}
          style={{ background: colorFor(n) }}
        >
          {initials(n)}
        </span>
      ))}
      {(names || []).length > max && (
        <span className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-[var(--ink)] bg-[var(--line)] border-2 border-[var(--card)] shadow-xs">
          +{names.length - max}
        </span>
      )}
    </span>
  );
}

export function Avatar({
  name,
  className,
  src,
}: {
  name: string;
  className?: string;
  src?: string;
}) {
  return (
    <span
      className={cn(
        "w-8 h-8 rounded-full inline-flex items-center justify-center text-xs font-semibold text-white border border-[var(--line)] shadow-xs",
        className
      )}
      style={src ? { background: `url(${src}) center/cover` } : { background: colorFor(name) }}
    >
      {src ? "" : initials(name)}
    </span>
  );
}
