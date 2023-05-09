import React from "react";
import { FaSpaceShuttle } from "react-icons/fa";

const FleetIcon = () => {
  return (
    <>
      <FaSpaceShuttle className="mx-auto h-10 w-auto text-indigo-600 -rotate-90" />
      <div className="flex">
        <FaSpaceShuttle className="mx-auto h-10 w-auto text-indigo-600 -rotate-90" />
        <FaSpaceShuttle className="mx-auto h-10 w-auto text-indigo-600 -rotate-90" />
      </div>
      <FaSpaceShuttle className="mx-auto h-10 w-auto text-indigo-600 -rotate-90" />
    </>
  );
};

export default FleetIcon;
