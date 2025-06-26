import { Fragment } from "react";

export default function TimeTable() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const hours = Array.from({ length: 15 }, (_, i) => 9 + i); // 9시 ~ 23시

  return (
    <div className="h-max max-w-[800px]">
      {/* 요일 헤더 부분 */}
      <div className="sticky top-0 grid h-[40px] grid-cols-[60px_repeat(5,_1fr)] place-items-center bg-white">
        <div />
        {days.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* 타임 테이블 부분 */}
      <div className="grid h-[50px] grid-cols-[60px_repeat(5,1fr)] place-items-center">
        {hours.map((hour) => (
          <Fragment key={hour}>
            <div>{hour}:00</div>
            {days.map((day) => (
              <div key={`${day}-${hour}:00`} />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
