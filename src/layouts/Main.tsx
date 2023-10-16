import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface MainProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

const Main = ({ children }: MainProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default Main;
