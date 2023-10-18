import { SitesHttpResponse, SitesHttpRequest } from "@yext/pages/*";
import {
  DeployWebhookPayload,
  ResourcesWebhookPayload,
} from "../../../types/types";
import redis from "../utils/redis";

/*
* @param {Request} request
* POST Request: 
* Updates the KV based on the payload from Yext
  Accepts a Webhook payload from Yext
* GET Request: Not implemented
*/
const updateKV = async (
  request: SitesHttpRequest
): Promise<SitesHttpResponse> => {
  const { body, method } = request;

  console.log("Received request: ", request);

  if (method !== "POST") {
    return { body: "Method not allowed", headers: {}, statusCode: 405 };
  }

  const webhookPayload = JSON.parse(body) as
    | ResourcesWebhookPayload
    | DeployWebhookPayload;

  console.log("Received webhook payload: ", webhookPayload);

  const { meta } = webhookPayload;
  const subAccountId = webhookPayload.meta.accountId;

  // Parent ID is hardcoded for now
  switch (meta.eventType) {
    case "RESOURCE_APPLY_REQUEST_COMPLETE":
      await redis.hset(`3873282/${subAccountId}`, "rar_complete");
      break;
    case "DEPLOY_COMPLETE":
      await redis.hset(`3873282/${subAccountId}`, "deploy_complete");
      break;
    case "RESOURCE_APPLY_REQUEST_FAILURE":
      await redis.hset(`3873282/${subAccountId}`, "rar_failure");
      break;
    case "DEPLOY_FAILURE":
      await redis.hset(`3873282/${subAccountId}`, "deploy_failure");
      break;
    default:
      return { body: "Event type not supported", headers: {}, statusCode: 400 };
  }

  return { body: "Success", headers: {}, statusCode: 200 };
};

export default updateKV;
