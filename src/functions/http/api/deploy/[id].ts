import { SitesHttpRequest } from "@yext/pages/*";
import redis from "../../utils/redis";
import {
  Account,
  SubAccountSiteConfig,
  Response,
  PostRequest,
} from "../../../../types/types";

const buildSiteRequestBody = (siteBody: SubAccountSiteConfig) => {
  const {
    subAccountId,
    siteConfigRepoUrl,
    siteId,
    siteName,
    repoId,
    repoUrl,
    apiKey,
    entityId,
  } = siteBody;

  // subAccountId is also called partner id in the platform
  const stripped = subAccountId.trim();

  // random number 5 digits long
  const randomNumber = Math.floor(Math.random() * 100000);

  // current date time as a string in the form 03/04/2023 11:08:26
  const deployedDate = new Date().toLocaleString();

  const body = {
    targetAccountId: stripped,
    source: {
      type: "GitHub",
      url: siteConfigRepoUrl || "https://github.com/apav-dev/smb-pages-cac",
      variables: {
        siteId: siteId || `site-id-${randomNumber}`,
        siteName: siteName || `API Deployed Site at ${deployedDate}`,
        repoId: repoId || "basic-smb-starter",
        repoUrl: "github.com/apav-dev/fleet-smb-starter",
        entityId: entityId || "loc-1",
        apiKey: apiKey || "",
      },
    },
  };
  console.log("Built site request body: ", body);
  return body;
};

const handlePost = async (bodyStr: string, businessId: string) => {
  let accts: Array<SubAccountSiteConfig> = [];
  try {
    accts = JSON.parse(bodyStr);
  } catch (err) {
    console.error(`Bad Request: `, err);
    return new Response(
      `Bad Request: Request must be an array of objects with the following properties:
        *   subAccountId: string;
        *   siteConfigRepoUrl: string;
        *   siteId: string; 
        *   siteName: string;
        *   repo_id: string;
        *   gitHubUrl: string`,
      null,
      400
    );
  }

  const accountStatuses: Account[] = [];

  // Send off request for each account to Yext
  const rarPromises = accts.map(async (acct) => {
    try {
      const siteBody = buildSiteRequestBody(acct);
      const request = new PostRequest(siteBody);

      const response = await fetch(
        `https://api.yext.com/v2/accounts/me/resourcesapplyrequests?v=20231001&api_key=${YEXT_PUBLIC_YEXT_API_KEY}`,
        request
      );
      const jsonResponse = await response.json();

      return new Response(
        JSON.stringify(jsonResponse),
        null,
        Number(response.status)
      );
    } catch (err) {
      console.error(
        `Error deploying site for sub account ID ${acct.subAccountId}:`,
        err
      );
      return new Response("Internal Server Error: Consult Logs", null, 500);
    }
  });

  // Check if the requests succeeded or failed and update the account Statuses list accordingly
  await Promise.allSettled(rarPromises).then((results) => {
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        const statusCode = result.value.statusCode;
        const jsonResponse = JSON.parse(result.value.body);
        if (statusCode === 200) {
          console.log("RAR submitted successfully");
          accountStatuses.push({
            accountId: jsonResponse.response.targetAccountId,
            status: "rar_submitted",
          });
        } else {
          accountStatuses.push({
            accountId: jsonResponse.targetAccountId,
            status: "rar_submission_failure",
          });
          console.error(
            `Failed to submit RAR for sub account ID ${jsonResponse.targetAccountId}: ${jsonResponse.message}`
          );
        }
      } else {
        console.error(result.reason);
      }
    });
  });

  // Update the KV store with the account statuses
  const hashPromises = accountStatuses.map(async (account) => {
    await redis.hset(`${businessId}/${account.accountId}`, {
      status: account.status,
    });
  });

  // Wait for all the hash promises to resolve
  await Promise.allSettled(hashPromises).then((results) => {
    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error("Failed to set hash value");
      }
    });
  });

  return new Response("OK", null, 200);
};

/*
* @param {Request} request
* POST Request: 
* Deploys a site to the specified sub account with the specified configuration
  Accepts an array of objects with the following properties:
*   subAccountId: string;
*   siteConfigRepoUrl: string;
*   siteId: string; 
*   siteName: string;
*   repoId: string;
*   gitHubUrl: string;
* GET Request: Not implemented
*/
export default async function deploy(request: SitesHttpRequest) {
  const { body, method, pathParams } = request;

  const { id } = pathParams;

  switch (method) {
    case "POST":
      await redis.del(id);
      return await handlePost(body, id);
    default:
      return new Response("Method not allowed", null, 405);
  }
}
