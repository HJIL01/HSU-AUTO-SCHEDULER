import { useState } from "react";

export default function useFocusState() {
  const [isFocus, setIsFocus] = useState<boolean>(false);

  const onFocus = () => {
    setIsFocus(true);
  };

  const onBlur = () => {
    setIsFocus(false);
  };

  return { isFocus, setIsFocus, onFocus, onBlur };
}
