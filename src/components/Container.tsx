import React from "react";
import { twMerge } from "tailwind-merge";

export interface ContainerProps {
  children: React.ReactNode;
  customCssClasses?: {
    outerContainer?: string;
    innerContainer?: string;
  };
}

const Container = ({ children, customCssClasses }: ContainerProps) => {
  return (
    <div
      className={twMerge(
        "mt-10 sm:mx-auto sm:w-full sm:max-w-4xl",
        customCssClasses?.outerContainer
      )}
    >
      <div
        className={twMerge(
          "bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12",
          customCssClasses?.innerContainer
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Container;
