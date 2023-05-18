const V = "20220101";
const YEXT_API_KEY = "371ba6333664664048b449c5917ecb56";
const createAccountEndpoint = `https://api.yext.com/v2/accounts/me/createsubaccount?v=${V}&api_key=${YEXT_API_KEY}`;
const rarEndpoint = `https://api.yext.com/v2/accounts/me/resourcesapplyrequests?v=${V}&api_key=${YEXT_API_KEY}`
const OPENAI_API_KEY = `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`
const OPEN_AI_URL = 'https://api.openai.com/v1/chat/completions';


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

    const { businessName, address, hours } = body
    const url = buildLocationURL(subAccountId);
    const formattedAddress = await formAddress(address)
    // const formattedHours = await formHours(hours)

    const requestBody = {
        name: businessName,
        address: formattedAddress,
        //  hours: formattedHours
    }

    return await postRequest(url, requestBody)
}


function buildLocationURL(subAccountId) {
    return `https://api.yext.com/v2/accounts/${subAccountId}/entities?v=${V}&entityType=location&api_key=${YEXT_API_KEY}`;
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

const handlePost = async (body, queryParams) => {



    const parsedBody = JSON.parse(body);
    const newSubAccountId = parsedBody.businessName + '-' + parsedBody.subAccountId;

    let createAccountResponse;
    let createLocationResponse;
    let createSiteResponse;
    try {
        if (queryParams?.createAccount !== 'false') {
            createAccountResponse = await createSubAccount(parsedBody, newSubAccountId);
        }
        if (queryParams?.createLocation !== 'false') {
            createLocationResponse = await createLocation(parsedBody, newSubAccountId);
        }
        if (queryParams?.createSite !== 'false') {
            createSiteResponse = await createSite(parsedBody, newSubAccountId);
        }
    }
    catch (error) {
        return new Response(error.message, null, error.statusCode);
    }

    const resp = {
        createAccountResponse: {
            data: createAccountResponse?.data || 'Account creation skipped',
            status: createAccountResponse?.status || 304,
        },
        createLocationResponse: {
            data: createLocationResponse.data || 'Location creation skipped',
            status: createLocationResponse.status || 304,
        },
        createSiteResponse: {
            data: createSiteResponse?.data || 'Site creation skipped',
            status: createSiteResponse?.status || 304,
        }
    }

    const json = JSON.stringify(resp)
    return new Response(json, null, 201);

}

export default async function createAccount(request) {
    const { body, method, queryParams } = request;

    switch (method) {
        case "POST":
            return handlePost(body, queryParams);
        default:
            return new Response("Method not allowed", null, 405);
    }
}

async function formAddress(address: string) {

    const prompt =
        `take this address (${address}) and return it as JSON of this form: "address": { "line1": string, "city": string, "region": string, "postalCode": string, "countryCode": string } 
    `;

    try {
        const response = await fetch(OPEN_AI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [{ "role": "user", "content": prompt }]
            })
        });

        console.log("data", response)
        const data = await response.json();
        const completion = data.choices[0].message.content;

        // Parse the completion as JSON
        const parsedCompletion = JSON.parse(completion);

        // Extract the address object from the parsed completion
        const { address } = parsedCompletion;

        return address;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function formHours(hours: string) {
    const prompt =
        `json representation of these (${hours}) in this form: ${hoursFormat}`
        ;

    try {
        const response = await fetch(OPEN_AI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [{ "role": "user", "content": prompt }]
            })
        });

        const data = await response.json();
        const completion = data.choices[0].message.content;

        // Parse the completion as JSON
        const parsedCompletion = JSON.parse(completion);

        // Extract the address object from the parsed completion
        const { hours } = parsedCompletion;

        return hours;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }


}

const hoursFormat = `"hours": {
    "friday": {
      "isClosed": false,
      "openIntervals": [
        {
          "end": "22:00",
          "start": "08:00"
        }
      ]
    },
    "monday": {
      "isClosed": false,
      "openIntervals": [
        {
          "end": "22:00",
          "start": "08:00"
        }
      ]
    },
    "saturday": {
      "isClosed": false,
      "openIntervals": [
        {
          "end": "22:00",
          "start": "08:00"
        }
      ]
    },
    "sunday": {
      "isClosed": true
    },
    "thursday": {
      "isClosed": false,
      "openIntervals": [
        {
          "end": "22:00",
          "start": "08:00"
        }
      ]
    },
    "tuesday": {
      "isClosed": false,
      "openIntervals": [
        {
          "end": "22:00",
          "start": "08:00"
        }
      ]
    },
    "wednesday": {
      "isClosed": false,
      "openIntervals": [
        {
          "end": "22:00",
          "start": "08:00"
        }
      ]
    }
  }`

