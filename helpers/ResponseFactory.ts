export interface FunctionResponse {
    status: number
    body: string
    headers: Record<string, string>
}

export interface FunctionResponseBody {
    success: boolean
    message: string
    data: any | undefined
}

export function responseFactory(httpCode: number, message: string, data?: any, cache = 0): FunctionResponse {
    const body: FunctionResponseBody = {
        success: (`${httpCode}`)[0] === '2',
        message,
        data,
    };

    const headers = {
        'content-type': 'application/json; charset=utf-8',
    };

    if (cache) {
        headers['Cache-Control'] = `public,max-age=${cache}`;
    }

    return {
        status: httpCode,
        body: JSON.stringify(body),
        headers,
    };
}

export default responseFactory;
