import redis from "../../utils/redis";
import { Account, DeployStatus, Response } from "../../../../types/types";
import { SitesHttpRequest } from "@yext/pages/*";

const hgetall = async (accountId: string) => {
  try {
    const response = await redis.hgetall(accountId);

    if (response.result === null) {
      return new Response("Not Found", null, 404);
    }

    const resultList = response.result as string[];
    const accounts: Account[] = [];
    for (let i = 0; i < resultList.length; i += 2) {
      const accountId = resultList[i];
      const status = resultList[i + 1] as DeployStatus;
      accounts.push({ accountId, status });
    }

    return new Response(JSON.stringify(accounts), null, 200);
  } catch (err) {
    console.error(`Error fetching the Hash with the key ${accountId}: ${err}`);
    return new Response("Internal Server Error: Consult Logs", null, 500);
  }
};

/*
 * @param {Request} request
 * GET Request:
 * Fetches all active deploys of subaccount sites for a given parent account.
 *   subAccountId: string;
 */
const deploys = async (request: SitesHttpRequest) => {
  const { method, pathParams } = request;

  const id = pathParams.id;

  switch (method) {
    case "GET":
      return await hgetall(id);
    default:
      return new Response("Method not allowed", null, 405);
  }
};

export default deploys;
