import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import Container from "./Container";
import { useMutation } from "@tanstack/react-query";
import { deployFleet } from "../utils/api";

interface FleetFormProps {
  subAccounts: {
    name: string;
    partnerCustomerID: string;
    yextCustomerID: string;
  }[];
}

const FleetForm = ({ subAccounts }: FleetFormProps) => {
  const [selectedSubAccountIds, setSelectedSubAccountIds] = useState<string[]>(
    []
  );
  const [template, setTemplate] = useState("");

  const deployFleetMutation = useMutation({
    mutationFn: () =>
      deployFleet(
        selectedSubAccountIds.map((subAccountId) => ({ subAccountId }))
      ),
  });

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
          className="block text-base font-semibold leading-6 text-gray-900"
        >
          Select a Template
        </label>

        <div className="grid mt-2 grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 xl:gap-x-8 h-full">
          <div
            onClick={() => setTemplate("orange")}
            className={twMerge(
              "border-2 border-gray-300 p-2 hover:opacity-75",
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
              "border-2 border-gray-300 p-2 hover:opacity-75",
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
          <fieldset>
            <legend className="text-base font-semibold leading-6 text-gray-900">
              Sub Account Ids
            </legend>
            <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200 overflow-auto h-96 px-4">
              {subAccounts.map((account, accountIdx) => (
                <div
                  key={accountIdx}
                  className="relative flex items-start py-4"
                >
                  <div className="min-w-0 flex-1 text-sm leading-6">
                    <label
                      htmlFor={`account-${account.yextCustomerID}`}
                      className="select-none font-medium text-gray-900"
                    >
                      <span>
                        {account.name}{" "}
                        <span className="text-xs text-gray-500">
                          {account.yextCustomerID}
                        </span>
                      </span>
                    </label>
                  </div>
                  <div className="ml-3 flex h-6 items-center">
                    <input
                      id={`account-${account.yextCustomerID}`}
                      name={`person-${account.yextCustomerID}`}
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSubAccountIds([
                            ...selectedSubAccountIds,
                            account.partnerCustomerID,
                          ]);
                        } else {
                          setSelectedSubAccountIds(
                            selectedSubAccountIds.filter(
                              (said) => said !== account.partnerCustomerID
                            )
                          );
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
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
