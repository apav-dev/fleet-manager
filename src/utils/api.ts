import {
  DeployStatus,
  SubAccountEntity,
  SubAccountSiteConfig,
  Subaccount,
} from "../types/types";
import { fetch } from "@yext/pages/util";

export const deployFleet = async (subAccounts: SubAccountSiteConfig[]) => {
  try {
    await fetch(`/api/deploy/3873282`, {
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
    `https://cdn.yextapis.com/v2/accounts/me/content/subaccounts?api_key=${YEXT_PUBLIC_YEXT_API_KEY}&v=20230501`
  );
  return response.json();
};

export const fetchFleetStatuses = async (): Promise<
  {
    accountId: string;
    status: DeployStatus;
  }[]
> => {
  const response = await fetch(`/api/deploys/3873282`);
  return response.json();
};

export const createAccount = async (request: {
  businessName: string;
  subAccountId: string;
  countryCode: string;
  address: {
    line1: string;
    city: string;
    region: string;
    postalCode: string;
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
