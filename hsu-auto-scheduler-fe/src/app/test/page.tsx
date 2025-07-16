"use client";

import { WeekdayEnum } from "@/enums/weekday.enum";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [testArray, setTestArray] = useState<number[]>([]);
  const [colWidth, setColWidth] = useState<number>(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const mockDays = [WeekdayEnum.TUE, WeekdayEnum.THU];

  useEffect(() => {
    const count = Math.floor(Math.random() * 3) + 5;
    const generated = Array.from({ length: count }, (_, i) => i);
    setTestArray(generated);

    function getTest() {
      if (!ref.current) {
        return;
      }
      setColWidth(ref.current.offsetWidth / count);
    }

    getTest();

    window.addEventListener("resize", getTest);

    return () => window.removeEventListener("resize", getTest);
  }, []);

  console.log(colWidth);

  return (
    <div className="flex min-h-dvh w-full items-center justify-center gap-2 bg-amber-200">
      <div ref={ref} className="flex w-[80%] bg-red-50">
        {testArray.map((e, i) => (
          <div
            key={e}
            className="flex h-[30px] w-[30px] items-center justify-center bg-red-300"
          >
            {e}
          </div>
        ))}
      </div>
    </div>
  );
}
