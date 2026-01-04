import ButtonGroup from "@/components/custom/not-found-button";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex h-svh w-svw flex-col items-center justify-center gap-7 text-center">
      <Image
        src={"/503.svg"}
        alt="No Page Found"
        width={400}
        height={400}
        priority
      />
      <h2 className="text-xl font-semibold text-primary-500">Page Not Found</h2>
      <ButtonGroup />
    </div>
  );
}
