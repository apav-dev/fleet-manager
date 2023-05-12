type WebhookEventType =
  | "RESOURCE_APPLY_REQUEST_COMPLETE"
  | "DEPLOY_COMPLETE"
  | "RESOURCE_APPLY_REQUEST_FAILURE"
  | "DEPLOY_FAILURE";

interface Source {
  type: string;
  url: string;
  variables: {
    title?: string;
    repoId?: string;
    siteId?: string;
    siteName?: string;
    gitHubUrl?: string;
  };
}

interface ApiResourcesRequest {
  id: number;
  targetAccountId: string;
  dateSubmitted: string;
  dateCompleted?: string;
  source: Source;
  status: string;
  statusDetail?: string;
}

interface Meta {
  uuid: string;
  timestamp: number;
  accountId?: string;
  appSpecificAccountId: string;
  eventType: WebhookEventType;
}

interface ResourcesWebhookPayload {
  apiResourcesRequest: ApiResourcesRequest;
  meta: Meta;
}

interface Deploy {
  deployId: string;
  repoBranchName: string;
  commitHash: string;
  commitMessage: string;
  businessName: string;
  siteName: string;
  pagesSiteId: number;
  cacSiteId: string;
  repoUrl: string;
  platformUrl: string;
  previewDomain: string;
  stagingDomain: string;
  productionDomain: string;
  displayUrlPrefix: string;
  documentUrl: string;
  entityId: string;
  locale: string;
  errorType: string;
  rawMessage: string;
}

interface DeployWebhookPayload {
  deploy: Deploy;
  text: string;
  meta: Meta;
}

class Response {
  body: string;
  headers: any;
  statusCode: number;

  constructor(body: string, headers: any, statusCode: number) {
    this.body = body;
    this.headers = headers || {
      "Content-Type": "application/json",
    };
    this.statusCode = statusCode;
  }
}

class Request {
  method: string;
  headers?: any;
  body?: any;

  constructor(method: string, headers?: any, body?: any) {
    this.method = method;
    if (headers) {
      this.headers = headers;
    }
    if (body) {
      this.body = JSON.stringify(body);
    }
  }
}

type KVResponse = {
  result?: string | string[];
  error?: string;
};

type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";

type KVMethod = "hget" | "hset" | "hgetall" | "del";

type DeployStatus =
  | "rar_submitted"
  | "rar_submission_failure"
  | "rar_complete"
  | "rar_failure"
  | "deploy_failure"
  | "deploy_complete";

const kvRequest = async (
  httpMethod: HttpMethod,
  kvMethod: KVMethod,
  pathParams: Array<string>,
  body?: string
): Promise<KVResponse> => {
  const url = `${YEXT_PUBLIC_KV_BASE_URL}/${kvMethod}/${pathParams.join("/")}`;

  const request: Request = {
    method: httpMethod,
    headers: {
      "Authorization": `Bearer ${YEXT_PUBLIC_KV_KEY}`,
    },
  };

  if (body) {
    request.body = body;
  }

  try {
    const response = await fetch(url, request);
    return await response.json();
  } catch (err) {
    console.error(`Error with request to KV ${url}: ${err}`, err);
    throw err;
  }
};

const setAccountHashValue = async (
  parentAccountId: string,
  subAccountId: string,
  status: DeployStatus
) => {
  const response = await kvRequest(
    "POST",
    "hset",
    [parentAccountId, subAccountId],
    status
  );
  if (response.error) {
    console.error(
      `Error setting the Hash with the id ${parentAccountId}: ${response.error}`
    );
  } else {
    console.log(`Successfully set the Hash with the id ${parentAccountId}`);
  }
};

/*
* @param {Request} request
* POST Request: 
* Updates the KV based on the payload from Yext
  Accepts a Webhook payload from Yext
* GET Request: Not implemented
*/
const updateKV = async (request) => {
  const { body, method } = request;

  if (method !== "POST") {
    return new Response("Method not allowed", null, 405);
  }

  const webhookPayload = JSON.parse(body) as
    | ResourcesWebhookPayload
    | DeployWebhookPayload;

  const { meta } = webhookPayload;

  // Parent ID is hardcoded for now
  let subAccountId = "";
  switch (meta.eventType) {
    case "RESOURCE_APPLY_REQUEST_COMPLETE":
      // webhookPayload.meta.accountId will be present for RAR Successes
      subAccountId = webhookPayload.meta.accountId as string;
      await setAccountHashValue("3873282", subAccountId, "rar_complete");
      break;
    case "DEPLOY_COMPLETE":
      // webhookPayload.meta.appSpecificAccountId will NOT BE present for deploy completes
      subAccountId = webhookPayload.deploy?.businessName?.split("-")[3];
      await setAccountHashValue("3873282", subAccountId, "deploy_complete");
      break;
    case "RESOURCE_APPLY_REQUEST_FAILURE":
      // webhookPayload.meta.accountId will be present for RAR Failures
      subAccountId = webhookPayload.meta.accountId as string;
      await setAccountHashValue("3873282", subAccountId, "rar_failure");
      break;
    case "DEPLOY_FAILURE":
      // webhookPayload.meta.accountId will be present for RAR Failures
      subAccountId = webhookPayload.meta.accountId as string;
      await setAccountHashValue("3873282", subAccountId, "deploy_failure");
      break;
    default:
      return new Response("Event type not supported", null, 400);
  }

  return new Response("Success", null, 200);
};

export default updateKV;
