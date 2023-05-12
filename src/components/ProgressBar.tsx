import React, { useEffect, useState } from "react";

interface ProgressBarProps {
  total: number;
  progress: number;
}

const ProgressBar = ({ total, progress }: ProgressBarProps) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const newPercentage = (progress / total) * 100;
    setPercentage(newPercentage);
  }, [total, progress]);

  return (
    <div className="w-full h-4 bg-indigo-200 rounded-full relative">
      <div
        style={{ width: `${percentage}%` }}
        className="h-full bg-indigo-500 transition-all duration-500 ease-in-out rounded-full"
      />
      <div className="absolute  h-full flex items-center pr-4 top-6 right-0 mx-auto sm:top-0 sm:-right-14 sm">
        <p className="text-sm font-medium text-gray-900">{percentage}%</p>
      </div>
    </div>
  );
};

export default ProgressBar;
