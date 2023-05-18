export default function postRequest(args) {
    const { body, queryParams } = args;
    const parsedBody = JSON.parse(body);
    return {
        body: JSON.stringify(parsedBody),
        status: 200,
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    }
}