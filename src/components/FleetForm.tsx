import React, { useState } from "react";
import { OnSelectParams } from "@yext/search-ui-react";
import { FilterSearch } from "@yext/search-ui-react";
import { twMerge } from "tailwind-merge";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { FaSpaceShuttle } from "react-icons/fa";
import Container from "./Container";
import { useMutation } from "@tanstack/react-query";

type Subaccount = {
  subAccountId: string;
};

const deployFleet = async (subAccounts: Subaccount[]) => {
  try {
    await fetch(`/api/deploy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subAccounts),
    });
  } catch (e) {
    console.error(e);
  }
};

const FleetForm = () => {
  const [selectedSubAccountIds, setSelectedSubAccountIds] = useState<string[]>(
    []
  );
  const [template, setTemplate] = useState("");

  const deployFleetMutation = useMutation({
    mutationFn: () =>
      deployFleet(
        selectedSubAccountIds.map((said) => ({ subAccountId: said }))
      ),
  });

  const handleSubAccountIdSelect = (params: OnSelectParams) => {
    const said = params.newFilter.value as string;
    setSelectedSubAccountIds([...selectedSubAccountIds, said]);
  };

  const handleRemoveSubAccountId = (said: string) => {
    setSelectedSubAccountIds(
      selectedSubAccountIds.filter((selectedSaid) => selectedSaid !== said)
    );
  };

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    await deployFleetMutation.mutateAsync();
    window.location.hash = "deploying";
  };

  return (
    <Container>
      <section aria-labelledby="products-heading" className="mb-8">
        <h2 id="products-heading" className="sr-only">
          Products
        </h2>
        <label
          htmlFor="password"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Select a Template
        </label>

        <div className="grid mt-2 grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 xl:gap-x-8 h-full">
          <div
            onClick={() => setTemplate("orange")}
            className={twMerge(
              "border-2 border-transparent p-2 hover:opacity-75",
              template === "orange" && "border-indigo-600"
            )}
          >
            <div className="w-full overflow-hidden rounded-lg h-80">
              <iframe
                src={
                  "https://qqahwmjhg3-131278-d.sbx.preview.pagescdn.com/6257137882478077830"
                }
                className="h-full w-full object-cover object-center"
              ></iframe>
            </div>
            <div className="mt-8 flex items-center justify-between text-base font-medium text-gray-900">
              <h3>Orange Template</h3>
              <p>$5</p>
            </div>
            <p className="mt-1 text-sm italic text-gray-500">Orange Template</p>
          </div>
          <div
            onClick={() => setTemplate("blue")}
            className={twMerge(
              "border-2 border-transparent p-2 hover:opacity-75",
              template === "blue" && "border-indigo-600"
            )}
          >
            <div className="w-full overflow-hidden rounded-lg h-80">
              <iframe
                src={
                  "https://ipuk5b5pdo-131277-d.sbx.preview.pagescdn.com/4429845563501038261"
                }
                className="h-full w-full object-cover object-center group-hover:opacity-75"
              ></iframe>
            </div>
            <div className="mt-8 flex items-center justify-between text-base font-medium text-gray-900">
              <h3>Blue Template</h3>
              <p>$1000000</p>
            </div>
            <p className="mt-1 text-sm italic text-gray-500">Blue Template</p>
          </div>
        </div>
      </section>
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
