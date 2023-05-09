const API_KEY = "371ba6333664664048b449c5917ecb56";
const V = "20220101";
const url = `https://api.yext.com/v2/accounts/me/resourcesapplyrequests?v=${V}&api_key=${API_KEY}`


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
        };
        this.statusCode = statusCode;
    }
}

class PostRequest {
    method: string;
    headers?: any;
    body: any;

    constructor(body: any, headers?: any) {
        this.method = "POST";
        this.headers = headers || {
            "Content-Type": "application/json",
        };
        this.body = JSON.stringify(body);
    }

}


function buildSiteRequestBody(siteBody: SubAccountSiteConfig) {
    const { subAccountId, siteConfigRepoUrl, siteId, siteName, repoId, gitHubUrl } = siteBody;

    // subAccountId is also called partner id in the platform 
    const stripped = subAccountId.trim();

    const body = {
        targetAccountId: stripped,
        source: {
            type: "GitHub",
            url: siteConfigRepoUrl || "https://github.com/lambdaFun94/cac-pages-yextsite-config",
            variables: {
                siteId: siteId || `site-id-12345`,
                siteName: siteName || `API Deployed Site`,
                repoId: repoId || "basic-locations-repo-fleet",
                gitHubUrl: gitHubUrl || "github.com/lambdaFun94/basic-locations-site",
            },
        },
    };
    return body;
}

async function handlePost(body) {

    var accts: Array<SubAccountSiteConfig> = []
    try {
        accts = JSON.parse(body);
    } catch (err) {
        console.error(`Bad Request: `, err);
        return new Response(`Bad Request: Request must be an array of objects with the following properties:
        *   subAccountId: string;
        *   siteConfigRepoUrl: string;
        *   siteId: string; 
        *   siteName: string;
        *   repoId: string;
        *   gitHubUrl: string`, null, 400)
    }


    for (const acct of accts) {

        try {
            const siteBody = buildSiteRequestBody(acct);
            const request = new PostRequest(siteBody);
            const response = await fetch(url, request)
            const jsonResponse = await response.json()
            console.log(jsonResponse)
            return new Response(JSON.stringify(jsonResponse), null, Number(response.status))

        } catch (err) {
            console.error(`Error deploying site for sub account ID ${acct.subAccountId}:`, err);
            return new Response('Internal Server Error: Consult Logs', null, 500)
        }
    }
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

    const { body, method } = request

    switch (method) {
        case "POST":
            return await handlePost(body);
        default:
            return new Response("Method not allowed", null, 405)

    }
}






