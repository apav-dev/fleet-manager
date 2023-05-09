import React from "react";
import {
  HeadlessConfig,
  SearchHeadlessProvider,
  provideHeadless,
} from "@yext/search-headless-react";
import { Environment } from "@yext/search-core";

export interface MainProps {
  children: React.ReactNode;
}

const searchConfig: HeadlessConfig = {
  apiKey: "c8e05730b2c5c284b5f29f757e65a1d4",
  experienceKey: "said-search",
  verticalKey: "sub_account",
  locale: "en",
  environment: Environment.SANDBOX,
};

const searcher = provideHeadless(searchConfig);

const Main = ({ children }: MainProps) => {
  return (
    <SearchHeadlessProvider searcher={searcher}>
      <div className="min-h-screen bg-gray-50">
        <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </SearchHeadlessProvider>
  );
};

export default Main;
