import React from "react";

const Skeleton = () => (
  <div className="animate-pulse">
    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <div className="h-12 bg-gray-200 rounded"></div>
      <div className="h-12 bg-gray-200 rounded"></div>
      <div className="h-12 bg-gray-200 rounded"></div>
    </div>
    <div className="my-8">
      <div className="h-4 bg-gray-200 rounded"></div>
    </div>
    <div className="flow-root mt-10 h-96 overflow-y-auto p-4 border rounded-lg shadow">
      <ul role="list" className="-mb-8">
        {Array(5)
          .fill(undefined)
          .map((_, index) => (
            <li key={index}>
              <div className="relative pb-8">
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-gray-200"></span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="font-medium h-4 bg-gray-200 rounded"></p>
                    </div>
                  </div>
                </div>
                <div className="ml-8 my-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  </div>
);

export default Skeleton;
