"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { FetchProvider } from "@/context/FetchContext";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: false,
        retry: 0,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <FetchProvider>
        {children}
      </FetchProvider>
    </QueryClientProvider>
  );
}
