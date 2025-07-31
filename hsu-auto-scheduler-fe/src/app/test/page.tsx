"use client";

import LoadingSpinner from "@/components/ui/Loading-spinner";

export default function page() {
  return (
    <div className="flex h-dvh w-dvw items-center justify-center bg-sky-200 text-2xl">
      <LoadingSpinner />
    </div>
  );
}
