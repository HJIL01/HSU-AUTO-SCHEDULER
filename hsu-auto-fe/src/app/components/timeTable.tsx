"use client";

import clsx from "clsx";
import { useRef, useState } from "react";

export default function TimeTable() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const hours = Array.from({ length: 15 }, (_, i) => 9 + i); // 9시 ~ 23시

  const isDragging = useRef<boolean>(false);
  const isWriteMode = useRef<boolean>(false);

  const [personalSchedule, setPersonalSchedule] = useState<Set<string>>(
    new Set(),
  );

  // 드래그 활성화 시 isDragging true
  const onMouseDown = (selectedPersonalSchedule: string) => {
    isDragging.current = true;

    // 해당 셀이 이미 선택된 셀이라면 isWriteMode false로 만든 후 mouseEnter가 되는 모든 셀 remove
    isWriteMode.current = !personalSchedule.has(selectedPersonalSchedule);

    setPersonalSchedule((prev) => {
      const newSet = new Set(prev);

      if (isWriteMode.current) {
        newSet.add(selectedPersonalSchedule);
      } else {
        newSet.delete(selectedPersonalSchedule);
      }

      return newSet;
    });
  };

  // 드래그 비활성화 시 isDragging false
  const onMouseUp = () => {
    isDragging.current = false;
  };

  // 드래그 활성화 시에만 set에 해당 요일-시간 추가
  const onMouseEnter = (selectedPersonalSchedule: string) => {
    if (!isDragging.current) return;

    setPersonalSchedule((prev) => {
      const newSet = new Set(prev);

      if (isWriteMode.current) {
        newSet.add(selectedPersonalSchedule);
      } else {
        newSet.delete(selectedPersonalSchedule);
      }

      return newSet;
    });
  };

  const onMouseLeave = () => {
    isDragging.current = false;
  };

  return (
    <table
      className="w-full max-w-[800px] border border-gray-500 bg-gray-50"
      onMouseLeave={onMouseLeave}
    >
      <thead className="bg-gray-200">
        <tr className="h-[40px]">
          <th className="w-[60px] border border-gray-500" />
          {days.map((day) => (
            <th key={day} className="w-[60px] border border-gray-500">
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {hours.map((hour) => {
          const formattedHour = `${String(hour).padStart(2, "0")}:00`;
          return (
            <tr key={hour} className="h-[20px] select-none">
              <th className="border border-gray-500 select-none">
                {formattedHour}
              </th>
              {days.map((day) => {
                const formattedSchedule = `${day}-${formattedHour}`;
                return (
                  <td
                    key={formattedSchedule}
                    className={clsx(
                      `border border-gray-500 transition-colors`,
                      personalSchedule.has(formattedSchedule) && "bg-blue-300",
                      !isDragging.current && "hover:bg-blue-100",
                    )}
                    onMouseDown={() => onMouseDown(formattedSchedule)}
                    onMouseUp={onMouseUp}
                    onMouseEnter={() => onMouseEnter(formattedSchedule)}
                  />
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
