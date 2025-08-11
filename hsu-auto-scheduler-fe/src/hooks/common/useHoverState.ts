import { useState } from "react";

export default function useHoverState() {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const onMouseEnter = () => {
    setIsHovered(true);
  };
  const onMouseLeave = () => {
    setIsHovered(false);
  };

  return { isHovered, onMouseEnter, onMouseLeave };
}
