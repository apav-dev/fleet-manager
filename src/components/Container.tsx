import React from "react";

export interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-xl">
      <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
        {children}
      </div>
    </div>
  );
};

export default Container;
