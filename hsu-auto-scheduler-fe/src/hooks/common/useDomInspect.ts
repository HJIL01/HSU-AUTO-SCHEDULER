import { RefObject, useEffect, useState } from "react";

type PositionContext = {
  width: number;
  height: number;
  x: number;
  y: number;
};

const useDomInspect = (ref: RefObject<HTMLElement | null>) => {
  const [positionContext, setPositionContext] = useState<PositionContext>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setPositionContext({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
          x: entry.contentRect.x,
          y: entry.contentRect.y,
        });
      }
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref]);

  return positionContext;
};

export default useDomInspect;
