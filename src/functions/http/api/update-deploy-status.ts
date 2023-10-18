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

  if (method !== "POST") {
    return { body: "Method not allowed", headers: {}, statusCode: 405 };
  }

  const webhookPayload = JSON.parse(body) as
    | ResourcesWebhookPayload
    | DeployWebhookPayload;

  const { meta } = webhookPayload;

  // Parent ID is hardcoded for now
  let subAccountId = "";
  switch (meta.eventType) {
    case "RESOURCE_APPLY_REQUEST_COMPLETE":
      console.log("RESOURCE_APPLY_REQUEST_COMPLETE");
      // webhookPayload.meta.accountId will be present for RAR Successes
      subAccountId = webhookPayload.meta.accountId as string;
      await redis.hset(`3873282/${subAccountId}`, "rar_complete");
      break;
    case "DEPLOY_COMPLETE":
      // webhookPayload.meta.appSpecificAccountId will NOT BE present for deploy completes
      console.log("DEPLOY_COMPLETE");
      subAccountId = webhookPayload.deploy.businessName;
      await redis.hset(`3873282/${subAccountId}`, "deploy_complete");
      break;
    case "RESOURCE_APPLY_REQUEST_FAILURE":
      // webhookPayload.meta.accountId will be present for RAR Failures
      subAccountId = webhookPayload.meta.accountId as string;
      await redis.hset(`3873282/${subAccountId}`, "rar_failure");
      break;
    case "DEPLOY_FAILURE":
      // webhookPayload.meta.accountId will be present for Deploy Failures
      subAccountId = webhookPayload.meta.accountId as string;
      await redis.hset(`3873282/${subAccountId}`, "deploy_failure");
      break;
    default:
      return { body: "Event type not supported", headers: {}, statusCode: 400 };
  }

  return { body: "Success", headers: {}, statusCode: 200 };
};

export default updateKV;
