import {
  HttpMethod,
  KVMethod,
  KVResponse,
  Request,
} from "../../../types/types";

const kvRequest = async (
  httpMethod: HttpMethod,
  kvMethod: KVMethod,
  key: string,
  body?: Record<string, unknown>
): Promise<KVResponse> => {
  const url = `${YEXT_PUBLIC_KV_BASE_URL}/${kvMethod}/${key}`;

  const request: Request = {
    method: httpMethod,
    headers: {
      Authorization: `Bearer ${YEXT_PUBLIC_KV_KEY}`,
    },
  };

  if (body) {
    request.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, request);
    return await response.json();
  } catch (err) {
    console.error(`Error with request to KV ${url}: ${err}`, err);
    throw err;
  }
};

const redis = {
  hget: async (key: string): Promise<KVResponse> => {
    return await kvRequest("GET", "hget", key);
  },
  hset: async (
    key: string,
    body: Record<string, unknown>
  ): Promise<KVResponse> => {
    return await kvRequest("PUT", "hset", key, body);
  },
  hgetall: async (key: string): Promise<KVResponse> => {
    return await kvRequest("GET", "hgetall", key);
  },
  del: async (key: string): Promise<KVResponse> => {
    return await kvRequest("GET", "del", key);
  },
};

export default redis;
