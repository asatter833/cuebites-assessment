import ButtonGroup from "@/components/custom/not-found-button";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export default function NotFound() {
  return (
    <div className="flex h-svh w-svw flex-col items-center justify-center bg-slate-50/50 p-6">
      <div className="flex flex-col items-center max-w-md w-full">
        {/* Visual Asset */}
        <div className="relative mb-8 opacity-90 drop-shadow-sm">
          <Image
            src="/503.svg"
            alt="No Page Found"
            width={320}
            height={320}
            priority
            className="object-contain"
          />
        </div>

        {/* Metadata Badge */}
        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 mb-4">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
            Error Code 404
          </span>
        </div>

        {/* Content Section */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Navigation Interrupted
          </h2>
          <p className="text-sm font-medium text-slate-500 max-w-[280px] mx-auto leading-relaxed">
            The resource you are looking for has been moved, renamed, or is
            currently unavailable.
          </p>
        </div>

        <Separator className="my-8 w-12 bg-slate-200" />

        {/* Actions - Synced with Sidebar Button Style */}
        <div className="w-full flex justify-center">
          <ButtonGroup />
        </div>
      </div>

      {/* Subtle Footer Sync */}
      <div className="absolute bottom-8 flex items-center gap-2">
        <div className="size-1.5 rounded-full bg-slate-300" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Resource Scheduler v1.0
        </span>
      </div>
    </div>
  );
}
