import React from "react";

export interface StatProps {
  label: string;
  value: string;
}

const Stat = ({ label, value }: StatProps) => {
  return (
    <div
      key={label}
      className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
    >
      <dt className="truncate text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
        {value}
      </dd>
    </div>
  );
};

export default Stat;
