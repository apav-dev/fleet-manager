import React from "react";
import {
  HeadlessConfig,
  SearchHeadlessProvider,
  provideHeadless,
} from "@yext/search-headless-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Environment } from "@yext/search-core";

export interface MainProps {
  children: React.ReactNode;
}

const searchConfig: HeadlessConfig = {
  apiKey: YEXT_PUBLIC_SEARCH_API_KEY,
  experienceKey: "said-search",
  verticalKey: "sub_account",
  locale: "en",
  environment: Environment.SANDBOX,
};

const searcher = provideHeadless(searchConfig);
const queryClient = new QueryClient();

const Main = ({ children }: MainProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchHeadlessProvider searcher={searcher}>
        <div className="min-h-screen bg-gray-50">
          <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </SearchHeadlessProvider>
    </QueryClientProvider>
  );
};

export default Main;
