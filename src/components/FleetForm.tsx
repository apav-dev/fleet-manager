import React, { useState } from "react";
import { OnSelectParams } from "@yext/search-ui-react";
import { FilterSearch } from "@yext/search-ui-react";
import { twMerge } from "tailwind-merge";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { FaSpaceShuttle } from "react-icons/fa";
import Container from "./Container";

const FleetForm = () => {
  const [selectedSubAccountIds, setSelectedSubAccountIds] = useState<string[]>(
    []
  );

  const handleSubAccountIdSelect = (params: OnSelectParams) => {
    const said = params.newFilter.value as string;
    setSelectedSubAccountIds([...selectedSubAccountIds, said]);
  };

  const handleRemoveSubAccountId = (said: string) => {
    setSelectedSubAccountIds(
      selectedSubAccountIds.filter((selectedSaid) => selectedSaid !== said)
    );
  };

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.hash = "deploying";
  };

  return (
    <Container>
      <form
        className="space-y-6"
        action="#"
        method="POST"
        onSubmit={handleDeploy}
      >
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Sub Account IDs
          </label>
          <FilterSearch
            customCssClasses={{
              filterSearchContainer: "mb-0 mt-2",
              inputElement:
                "block w-full rounded-md border-0 h-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
            }}
            searchFields={[
              {
                entityType: "ce_subAccount",
                fieldApiName: "c_saids",
              },
            ]}
            placeholder="Select Subaccount IDs"
            onSelect={handleSubAccountIdSelect}
          />
          <div>
            <ul role="list" className="divide-y divide-gray-100 pl-2">
              {selectedSubAccountIds.map((said) => (
                <li
                  key={said}
                  className="flex items-center justify-between gap-x-6 py-5"
                >
                  <div className="flex gap-x-4">
                    <FaSpaceShuttle className="mx-auto h-10 w-auto text-indigo-600 -rotate-90" />
                    <div className="min-w-0 flex items-center">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {said}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => handleRemoveSubAccountId(said)}>
                    <XCircleIcon className="h-6 w-6 text-gray-900 hover:text-gray-500" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <button
            type="submit"
            className={twMerge(
              "flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
              selectedSubAccountIds.length === 0 &&
                "opacity-50 hover:bg-indigo-600"
            )}
            disabled={selectedSubAccountIds.length === 0}
          >
            Deploy Fleet
          </button>
        </div>
      </form>
    </Container>
  );
};

export default FleetForm;
