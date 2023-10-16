export type Subaccount = {
  subAccountId: string;
};

export type DeployStatus =
  | "rar_submitted"
  | "rar_submission_failure"
  | "rar_complete"
  | "rar_failure"
  | "deploy_failure"
  | "deploy_complete";

export interface SubAccountEntity {
  meta: {
    uuid: string;
    errors: string[];
  };
  response: {
    docs: {
      $key: {
        locale: string;
        primaryKey: string;
      };
      c_subAccounts: {
        name: string;
        partnerCustomerID: string;
        yextCustomerID: string;
      }[];
    }[];
    count: number;
  };
}

export type WebhookEventType =
  | "RESOURCE_APPLY_REQUEST_COMPLETE"
  | "DEPLOY_COMPLETE"
  | "RESOURCE_APPLY_REQUEST_FAILURE"
  | "DEPLOY_FAILURE";

export interface Source {
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

export interface ApiResourcesRequest {
  id: number;
  targetAccountId: string;
  dateSubmitted: string;
  dateCompleted?: string;
  source: Source;
  status: string;
  statusDetail?: string;
}

export interface Meta {
  uuid: string;
  timestamp: number;
  accountId?: string;
  appSpecificAccountId: string;
  eventType: WebhookEventType;
}

export interface ResourcesWebhookPayload {
  apiResourcesRequest: ApiResourcesRequest;
  meta: Meta;
}

export interface Deploy {
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

export interface DeployWebhookPayload {
  deploy: Deploy;
  text: string;
  meta: Meta;
}

export class Response {
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

export class Request {
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

export class PostRequest extends Request {
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

export type KVResponse = {
  result?: string | string[];
  error?: string;
};

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";

export type KVMethod = "hget" | "hset" | "hgetall" | "del";

export interface SubAccountSiteConfig {
  subAccountId: string;
  siteConfigRepoUrl?: string;
  siteId?: string;
  siteName?: string;
  repoId?: string;
  gitHubUrl?: string;
}

export type Account = {
  accountId: string;
  status: DeployStatus;
};
