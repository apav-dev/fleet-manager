import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import Container from "./Container";
import { useMutation } from "@tanstack/react-query";
import { deployFleet } from "../utils/api";
import { SubAccountSiteConfig } from "../types/types";
import { clsx } from "clsx";
import { CheckIcon } from "@heroicons/react/20/solid";

interface FleetFormProps {
  subAccounts: {
    name: string;
    partnerCustomerID: string;
    yextCustomerID: string;
    locationID: string;
    aPIKey: string;
  }[];
}

const tiers = [
  {
    name: "Standard Site",
    id: "tier-personal",
    href: "#",
    priceMonthly: "$39",
    description:
      "The perfect plan if you're just getting started with our product.",
    features: ["SEO-performant site deployed on Global CDN"],
    iFrameLink:
      "https://ipuk5b5pdo-131277-d.sbx.preview.pagescdn.com/4429845563501038261",
  },
  {
    name: "Elite Site",
    id: "tier-team",
    href: "#",
    priceMonthly: "$99",
    description: "A plan that scales with your rapidly growing business.",
    features: [
      "SEO-performant site deployed on Global CDN",
      "Reviews and Review Submissions",
      "Social Posts",
      "AI-Powered Chat Bot",
    ],
    iFrameLink:
      "https://supremely-federal-ferret.pgsdemo.com/locations/1633753833297642956",
  },
];

const FleetForm = ({ subAccounts }: FleetFormProps) => {
  const [selectedSubAccounts, setSelectedSubAccounts] = useState<
    SubAccountSiteConfig[]
  >([]);
  const [template, setTemplate] = useState("");
  const [featuredTier, setFeaturedTier] = useState(0);

  const deployFleetMutation = useMutation({
    mutationFn: () => deployFleet(selectedSubAccounts),
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
      </section>
      <div className="mx-auto mt-10  grid max-w-lg grid-cols-1 items-center gap-y-6 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier, tierIdx) => (
          <div
            onClick={() => setFeaturedTier(tierIdx)}
            key={tier.id}
            className={clsx(
              "transition-transform duration-500 transform",
              featuredTier === tierIdx
                ? "relative bg-white shadow-2xl scale-110 z-10"
                : "bg-white/60 sm:mx-8 lg:mx-0 z-0",
              featuredTier === tierIdx
                ? ""
                : tierIdx === 0
                ? "rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl"
                : "sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none",
              "rounded-3xl p-8 ring-1 ring-gray-900/10 h-[780px] sm:p-10"
            )}
          >
            <div className="w-full overflow-hidden rounded mb-4 border h-80">
              <iframe
                src={tier.iFrameLink}
                className="h-full w-full object-cover object-center"
              ></iframe>
            </div>
            <h3
              id={tier.id}
              className="text-base font-semibold leading-7 text-indigo-600"
            >
              {tier.name}
            </h3>

            {/* <p className="mt-6 text-base leading-7 text-gray-600">
              {tier.description}
            </p> */}
            <ul
              role="list"
              className="mt-4 space-y-3 text-sm leading-6 text-gray-600 "
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    className="h-6 w-5 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <form
        className="space-y-6"
        action="#"
        method="POST"
        onSubmit={handleDeploy}
      >
        <div className="mt-20">
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
                          setSelectedSubAccounts([
                            ...selectedSubAccounts,
                            {
                              subAccountId: account.partnerCustomerID,
                              entityId: account.locationID,
                              apiKey: account.aPIKey,
                            },
                          ]);
                        } else {
                          setSelectedSubAccounts(
                            selectedSubAccounts.filter(
                              (said) =>
                                said.subAccountId !== account.partnerCustomerID
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
              selectedSubAccounts.length === 0 &&
                "opacity-50 hover:bg-indigo-600"
            )}
            disabled={selectedSubAccounts.length === 0}
          >
            Deploy Fleet
          </button>
        </div>
      </form>
    </Container>
  );
};

export default FleetForm;
