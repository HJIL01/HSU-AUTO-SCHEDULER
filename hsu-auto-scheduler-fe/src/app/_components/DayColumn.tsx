import clsx from "clsx";

type Props = {
  hours: number[];
};

export default function DayColumn({ hours }: Props) {
  return (
    <td>
      {hours.map((hour, i) => (
        <div key={hour} className={clsx("h-30", i !== 0 && "border-t")} />
      ))}
    </td>
  );
}
