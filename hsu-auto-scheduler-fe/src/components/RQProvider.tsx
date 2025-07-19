"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { queryClientCreater } from "../lib/QueryClientCreater";

type Props = {
  children: React.ReactNode;
};

export default function RQProvider({ children }: Props) {
  const [client] = useState(() => queryClientCreater());
  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools
        initialIsOpen={process.env.NODE_ENV === "development"}
      />
    </QueryClientProvider>
  );
}
