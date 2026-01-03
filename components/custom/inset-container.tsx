import { cn } from "@/lib/utils";

export function SidebarInsetContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-inset-container"
      className={cn(
        "flex flex-1 flex-col gap-4 p-4",
        "rounded-tl-xl bg-background",
        className
      )}
      {...props}
    />
  );
}
