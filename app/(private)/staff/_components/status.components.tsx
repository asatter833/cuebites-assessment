import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string | null }) {
  const s = status?.toLowerCase();

  const config = {
    active: {
      bg: "bg-green-500/10",
      text: "text-green-600",
      dot: "bg-green-500",
      label: "Active",
    },
    inactive: {
      bg: "bg-slate-100",
      text: "text-slate-500",
      dot: "bg-slate-400",
      label: "Inactive",
    },
    terminated: {
      bg: "bg-red-500/10",
      text: "text-red-600",
      dot: "bg-red-500",
      label: "Terminated",
    },
  };

  const style = config[s as keyof typeof config] || config.inactive;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold border",
        style.bg,
        style.text,
        s === "active"
          ? "border-green-200"
          : s === "terminated"
          ? "border-red-200"
          : "border-slate-200"
      )}
    >
      <div className={cn("size-1.5 rounded-full", style.dot)} />
      {style.label}
    </div>
  );
}
