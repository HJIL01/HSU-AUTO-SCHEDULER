"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: React.ReactNode;
  selector?: string;
}

export default function Portal({ children, selector = "body" }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  const [element, setElement] = useState<Element | null>(null);

  useEffect(() => {
    const el = document.querySelector(selector);
    if (el) setElement(el);
    setMounted(true);
  }, [selector]);

  if (!mounted || !element) return null;

  return createPortal(children, element);
}
