class Response {
  body: string;
  headers: any;
  statusCode: number;

  constructor(body: string, headers: any, statusCode: number) {
    this.body = body;
    this.headers = headers || {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "http://localhost:5173",
      "Cache-Control": "no-cache, no-store, must-revalidate",
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
  result: string | string[];
};

type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";

type KVMethod = "hget" | "hset" | "hgetall";

type Account = {
  accountId: string;
  status: string;
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

const hgetall = async (accountId: string) => {
  try {
    const response = await kvRequest("GET", "hgetall", [accountId]);

    if (response.result === null) {
      return new Response("Not Found", null, 404);
    }

    const resultList = response.result as string[];
    const accounts: Account[] = [];
    for (let i = 0; i < resultList.length; i += 2) {
      accounts.push({
        accountId: response.result[i],
        status: response.result[i + 1],
      });
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
const deploys = async (request) => {
  const { method, site } = request;

  switch (method) {
    case "GET":
      return await hgetall(site.businessId);
    default:
      return new Response("Method not allowed", null, 405);
  }
};

export default deploys;
