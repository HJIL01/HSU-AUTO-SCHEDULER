import { useEffect } from "react";
import isMobileDevice from "@/utils/isMobileDevice";

export default function useHorizontalScrollByWheel(
  ref: React.RefObject<HTMLElement | null>,
  setIsLeftEnded: React.Dispatch<React.SetStateAction<boolean>>,
  setIsRightEnded: React.Dispatch<React.SetStateAction<boolean>>,
) {
  useEffect(() => {
    const el = ref.current;
    const isTouch = isMobileDevice();

    if (!el || isTouch) return;

    const handleScrollWheel = (event: WheelEvent) => {
      event.preventDefault();

      el.scrollLeft += event.deltaY;

      const { scrollLeft, scrollWidth, clientWidth } = el;

      if (scrollLeft <= 0) {
        setIsLeftEnded(true);
      } else {
        setIsLeftEnded(false);
      }

      if (scrollLeft + clientWidth >= scrollWidth - 1) {
        setIsRightEnded(true);
      } else {
        setIsRightEnded(false);
      }
    };

    el.addEventListener("wheel", handleScrollWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", handleScrollWheel);
    };
  }, [ref.current, setIsLeftEnded, setIsRightEnded]);
}
