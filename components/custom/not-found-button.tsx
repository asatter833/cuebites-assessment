"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function ButtonGroup() {
  const router = useRouter();

  return (
    <div className="flex flex-row items-center gap-2">
      <Button onClick={() => router.back()}>Go Back</Button>
      <Button className="font-semibold" onClick={() => router.push("/")}>
        Home Page
      </Button>
    </div>
  );
}
