"use client";

import LoadingSpinner from "@/components/ui/Loading-spinner";

export default function page() {
  const s = {
    Wed: {
      a: 12,
    },
  };
  const test = structuredClone(s);

  console.log(test);

  test.Wed.a = 3215616515;

  console.log(test);

  return (
    <div className="flex h-dvh w-dvw items-center justify-center bg-sky-200 text-2xl">
      <LoadingSpinner />
    </div>
  );
}
