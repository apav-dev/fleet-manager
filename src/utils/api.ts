import { DeployStatus, SubAccountEntity, Subaccount } from "../types/types";
import { fetch } from "@yext/pages/util";

export const deployFleet = async (subAccounts: Subaccount[]) => {
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

export const fetchSubAccounts = async (): Promise<SubAccountEntity> => {
  const response = await fetch(
    `https://cdn.yextapis.com/v2/accounts/me/content/subaccounts?api_key=${YEXT_PUBLIC_ADMIN_API_KEY}&v=20230501`
  );
  return response.json();
};

export const fetchFleetStatuses = async (): Promise<
  {
    accountId: string;
    status: DeployStatus;
  }[]
> => {
  const response = await fetch(`/api/deploys`);
  return response.json();
};

export const createAccount = async (request: {
  businessName: string;
  subAccountId: string;
  location: {
    address: string;
    city: string;
    state: string;
    zip: string;
    countryCode: string;
  };
  sites: {
    gitHubUrl: string;
    repoId: string;
    siteId: string;
    siteName: string;
  }[];
}) => {
  // post request to /api/account with json body
  const response = await fetch(`/api/account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  return response.json();
};
