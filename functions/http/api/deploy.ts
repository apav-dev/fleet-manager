const API_KEY = "371ba6333664664048b449c5917ecb56";
const V = "20220101";
const url = `https://api.yext.com/v2/accounts/me/resourcesapplyrequests?v=${V}&api_key=${API_KEY}`;

export interface SubAccountSiteConfig {
  subAccountId: string;
  siteConfigRepoUrl?: string;
  siteId?: string;
  siteName?: string;
  repoId?: string;
  gitHubUrl?: string;
}

class Response {
  body: string;
  headers: any;
  statusCode: number;

  constructor(body: string, headers: any, statusCode: number) {
    this.body = body;
    this.headers = headers || {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "http://localhost:5173",
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

class PostRequest extends Request {
  constructor(body: any, headers?: any) {
    super(
      "POST",
      headers || {
        "Content-Type": "application/json",
      },
      body
    );
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

type Account = {
  accountId: string;
  status: DeployStatus;
};

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

const clearAccountHash = async (accountId: string) => {
  const response = await kvRequest("GET", "del", [accountId]);
  if (response.error) {
    console.error(
      `Error deleting the Hash with the id ${accountId}: ${response.error}`
    );
  } else {
    console.log(`Successfully cleared the Hash with the id ${accountId}`);
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

function buildSiteRequestBody(siteBody: SubAccountSiteConfig) {
  const {
    subAccountId,
    siteConfigRepoUrl,
    siteId,
    siteName,
    repoId,
    gitHubUrl,
  } = siteBody;

  // subAccountId is also called partner id in the platform
  const stripped = subAccountId.trim();

  // random number 5 digits long
  const randomNumber = Math.floor(Math.random() * 100000);

  const body = {
    targetAccountId: stripped,
    source: {
      type: "GitHub",
      url:
        siteConfigRepoUrl ||
        "https://github.com/lambdaFun94/cac-pages-yextsite-config",
      variables: {
        siteId: siteId || `site-id-${randomNumber}`,
        siteName: siteName || `API Deployed Site ${randomNumber}`,
        repoId: repoId || "basic-locations-repo-fleet",
        gitHubUrl: gitHubUrl || "github.com/lambdaFun94/basic-locations-site",
      },
    },
  };
  return body;
}

async function handlePost(body, businessId) {
  let accts: Array<SubAccountSiteConfig> = [];
  try {
    accts = JSON.parse(body);
  } catch (err) {
    console.error(`Bad Request: `, err);
    return new Response(
      `Bad Request: Request must be an array of objects with the following properties:
        *   subAccountId: string;
        *   siteConfigRepoUrl: string;
        *   siteId: string; 
        *   siteName: string;
        *   repoId: string;
        *   gitHubUrl: string`,
      null,
      400
    );
  }

  const accountStatuses: Account[] = [];

  // Send off request for each account to Yext
  const deployPromises = accts.map(async (acct) => {
    try {
      const siteBody = buildSiteRequestBody(acct);
      const request = new PostRequest(siteBody);
      const response = await fetch(url, request);
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
  await Promise.allSettled(deployPromises).then((results) => {
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        const statusCode = result.value.statusCode;
        const jsonResponse = JSON.parse(result.value.body);
        if (statusCode === 200) {
          accountStatuses.push({
            accountId: jsonResponse.response.targetAccountId,
            status: "rar_submitted",
          });
        } else {
          accountStatuses.push({
            accountId: jsonResponse.targetAccountId,
            status: "rar_submission_failure",
          });
        }
      } else {
        console.error(result.reason);
      }
    });
  });

  // Update the KV store with the account statuses
  const hashPromises = accountStatuses.map((account) => {
    setAccountHashValue(businessId, account.accountId, account.status);
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
}

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
export default async function deploy(request) {
  const { body, method, site } = request;

  switch (method) {
    case "POST":
      await clearAccountHash(site.businessId);
      return await handlePost(body, site.businessId);
    default:
      return new Response("Method not allowed", null, 405);
  }
}
