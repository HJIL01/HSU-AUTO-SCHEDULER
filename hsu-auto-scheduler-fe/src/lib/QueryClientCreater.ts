import { QueryClient } from "@tanstack/react-query";

export function queryClientCreater() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnReconnect: true,
        retryOnMount: true,
        refetchOnWindowFocus: true,
        retry: 2,
        staleTime: 1000 * 60,
        gcTime: 5 * 1000 * 60,
      },
    },
  });

  return queryClient;
}
