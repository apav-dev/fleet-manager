import React, { useState } from "react";
import Container from "./Container";
import FormInput from "./FormInput";
import { twMerge } from "tailwind-merge";
import { useMutation } from "@tanstack/react-query";
import { createAccount } from "../utils/api";

const AccountForm = () => {
  const [businessName, setBusinessName] = useState("");
  const [accountId, setAccountId] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  const isFormValid = () => {
    // check if there are values for everything
    if (businessName && accountId && address && city && state && zip) {
      return false;
    }
    return true;
  };

  const createAccountMutation = useMutation({
    mutationFn: () =>
      createAccount({
        businessName,
        subAccountId: accountId,
        countryCode: "US",
        location: {
          line1: address,
          city,
          region: state,
          postalCode: zip,
          countryCode: "US",
        },
        sites: [
          {
            gitHubUrl: "github.com/lambdaFun94/basic-locations-site",
            repoId: "basic-locations-repo-fleet",
            siteId: `site-id-${Math.floor(Math.random() * 100000)}`,
            siteName: `API Deployed Site at ${new Date().toLocaleString()}`,
          },
        ],
      }),
  });

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAccountMutation.mutateAsync();
    window.location.hash = "deploying";
  };

  return (
    <Container>
      <form
        className="space-y-6"
        action="#"
        method="POST"
        onSubmit={handleCreateAccount}
      >
        <FormInput
          label="Business Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Enter a business name"
        />
        {/* accountId */}
        <FormInput
          label="Account Id"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          placeholder="Enter an account id"
        />
        {/* address */}
        <FormInput
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter an address"
        />
        {/* city */}
        <div className="flex space-x-4">
          <div className="flex-[2]">
            <FormInput
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter a city"
            />
          </div>
          {/* state */}
          <FormInput
            label="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Enter a state"
          />
          {/* zip */}
          <FormInput
            label="Zip"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="Enter a zip code"
          />
        </div>
        <div>
          <button
            type="submit"
            className={twMerge(
              "flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
              isFormValid() && "opacity-50 hover:bg-indigo-600"
            )}
            disabled={isFormValid()}
          >
            Create Account
          </button>
        </div>
      </form>
    </Container>
  );
};

export default AccountForm;
