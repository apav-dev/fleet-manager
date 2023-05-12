import React from "react";
import { Transition } from "@headlessui/react";

export interface TransitionContainerProps {
  children: React.ReactNode;
  show?: boolean;
}

const TransitionContainer = ({ children, show }: TransitionContainerProps) => {
  return (
    <Transition
      show={show}
      enter="transition-opacity duration-500 ease-out"
      enterFrom="opacity-0 h-0"
      enterTo="opacity-100 h-full"
      leave="transition-opacity duration-500 ease-out"
      leaveFrom="opacity-100 h-full"
      leaveTo="opacity-0 h-0"
    >
      {children}
    </Transition>
  );
};

export default TransitionContainer;
