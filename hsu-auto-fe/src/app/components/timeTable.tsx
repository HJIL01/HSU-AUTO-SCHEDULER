"use client";

export default function TimeTable() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const hours = Array.from({ length: 15 }, (_, i) => 9 + i); // 9시 ~ 23시

  return (
    <table className="w-full max-w-[800px] border border-gray-500 bg-gray-50">
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
        {hours.map((hour) => (
          <tr key={hour} className="h-[50px] select-none">
            <th className="border border-gray-500 select-none">
              {String(hour).padStart(2, "0")}:00
            </th>
            {days.map((day) => (
              <td
                key={`${day}-${hour}:00`}
                className="border border-gray-500 transition-colors hover:bg-blue-100"
                onMouseDown={(e) => console.log(e.target)}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
