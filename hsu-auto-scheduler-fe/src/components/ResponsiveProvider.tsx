"use client";

import { debounce } from "lodash";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type DeviceType = "desktop" | "mobile";

type Props = {
  children: ReactNode;
  initialDevice?: DeviceType;
};

const ResponsiveContext = createContext<DeviceType | null>(null);

export default function ResponsiveProvider({
  children,
  initialDevice = "desktop",
}: Props) {
  const [deviceType, setDeviceType] = useState<DeviceType>(initialDevice);

  useEffect(() => {
    const updateDeviceType = () => {
      if (window.innerWidth <= 768) {
        setDeviceType("mobile");
      } else {
        setDeviceType("desktop");
      }
    };

    const handleResize = debounce(updateDeviceType, 100);

    updateDeviceType();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ResponsiveContext.Provider value={deviceType}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export function useResponsiveContext() {
  const context = useContext(ResponsiveContext);

  if (context === null) {
    throw new Error("Can't find Responsive Context");
  }

  return context;
}
