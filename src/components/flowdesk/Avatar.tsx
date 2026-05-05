import { avatarColor, getInitials } from "@/lib/avatar";
import { cn } from "@/lib/utils";

type Size = "xs" | "sm" | "md" | "lg";

const sizeMap: Record<Size, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export function FdAvatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: Size;
  className?: string;
}) {
  const c = avatarColor(name);
  const initials = getInitials(name);
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-tight",
        sizeMap[size],
        className,
      )}
      style={{ background: c.bg, color: c.fg }}
      aria-hidden
    >
      {initials}
    </div>
  );
}
