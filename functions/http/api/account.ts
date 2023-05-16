const V = "20220101";
const API_KEY = "371ba6333664664048b449c5917ecb56";
const createAccountEndpoint = `https://api.yext.com/v2/accounts/me/createsubaccount?v=${V}&api_key=${API_KEY}`;
const rarEndpoint = `https://api.yext.com/v2/accounts/me/resourcesapplyrequests?v=${V}&api_key=${API_KEY}`


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

class HttpError {
    message: any;
    statusCode: number;

    constructor(errorMessage: any, statusCode: number) {
        this.message = errorMessage;
        this.statusCode = statusCode;
    }
}


async function postRequest(url, body): Promise<any> {

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new HttpError(JSON.stringify(data), response.status);
    }
    return { data: data, status: response.status }
}

async function createSubAccount(body, newSubAccountId) {
    const { businessName, countryCode } = body
    const requestBody = {
        newSubAccountId: newSubAccountId,
        newSubAccountName: businessName,
        countryCode: countryCode
    }
    return await postRequest(createAccountEndpoint, requestBody)
}

async function createLocation(body, subAccountId) {
    const url = buildLocationURL(subAccountId);
    const { businessName, address } = body
    const requestBody = {
        name: businessName,
        address: address
    }

    return await postRequest(url, requestBody)
}


function buildLocationURL(subAccountId) {
    return `https://api.yext.com/v2/accounts/${subAccountId}/entities?v=${V}&entityType=location&api_key=${API_KEY}`;
}

async function createSite(body: any, subAccountId) {
    const { sites } = body

    let responses: Array<any> = []
    for (const site of sites) {
        const requestBody = {
            source: {
                type: "GitHub",
                url: "https://github.com/lambdaFun94/cac-pages-yextsite-config",
                variables: {
                    gitHubUrl: site.gitHubUrl,
                    repoId: site.repoId,
                    siteId: site.siteId,
                    siteName: site.siteName

                }
            },
            targetAccountId: subAccountId
        };
        const siteCreationResponse = await postRequest(rarEndpoint, requestBody)
        responses.push(siteCreationResponse)

    }

    const errorResponses = responses.filter(response => response.status !== 200)
    return { data: responses, status: errorResponses.length > 0 ? 500 : 200 }
}

const handlePost = async (body) => {

    const parsedBody = JSON.parse(body);
    const newSubAccountId = parsedBody.businessName + '-' + parsedBody.subAccountId;

    let createAccountResponse;
    let createLocationResponse;
    let createSiteResponse;
    try {
        createAccountResponse = await createSubAccount(parsedBody, newSubAccountId);
        createLocationResponse = await createLocation(parsedBody, newSubAccountId);
        createSiteResponse = await createSite(parsedBody, newSubAccountId);
    }
    catch (error) {
        return new Response(error.message, null, error.statusCode);
    }

    const resp = {
        createAccountResponse: {
            data: createAccountResponse.data,
            status: createAccountResponse.status,
        },
        createLocationResponse: {
            data: createLocationResponse.data,
            status: createLocationResponse.status,
        },
        createSiteResponse: {
            data: createSiteResponse.data,
            status: createSiteResponse.status,
        }
    }

    const json = JSON.stringify(resp)
    return new Response(json, null, 201);

}

export default async function createAccount(request) {
    const { body, method } = request;

    switch (method) {
        case "POST":
            return handlePost(body);
        default:
            return new Response("Method not allowed", null, 405);
    }
}
