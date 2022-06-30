import { Context, HttpRequest, HttpRequestHeaders } from "@azure/functions";
import { FunctionResponse, responseFactory } from "./ResponseFactory";


export interface Settings {
    headers?: string[] | null;
    query?: string[] | null;
    body?: string[] | null;
}

interface ValidationError {
    type: 'headers' | 'query' | 'body';
    message: string;
    expected: string[];
    missing: string[];
    all: string[];
    request: HttpRequest;
}



function validationErrorLog(context: Context, error: ValidationError) {
    context.log.error(JSON.stringify(error))
}


export async function validate(context: Context, req: HttpRequest, settings: Settings): Promise<FunctionResponse | null> {

    const validator = (type: 'headers' | 'query' | 'body', settings: Settings) => {
        const all = req[type] ? Object.keys(req[type]) : [];
        const expected = settings[type];
        const missing = expected.filter((value) => !all.includes(value));
        if (missing.length == 0) return
        const error: ValidationError = {
            type: type,
            message: `Missing ${type} ${(type === 'query' || type === 'body') ? 'paramaters:': ':'} ${missing.join(', ')}`,
            expected: expected,
            missing: missing,
            all: all,
            request: req
        } 
        return error;
    }

    const errors: ValidationError[] = [];
    if (settings.body) {const e = validator('body', settings); e ? errors.push(e) : null}
    if (settings.query) {const e = validator('query', settings); e ? errors.push(e) : null}
    if (settings.headers) {const e = validator('headers', settings); e ? errors.push(e) : null}

    context.log("Errors: ", errors)
    if (errors.length === 0) return null;
    
    const errorMessages: string[] = [];
    errors.forEach(error => {
        validationErrorLog(context, error);
        errorMessages.push(error.message);
    });
    
    return responseFactory(400, 'Validation Errors', errorMessages);
}
