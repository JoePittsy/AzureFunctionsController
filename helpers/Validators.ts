import { Context, HttpMethod, HttpRequest, HttpRequestHeaders } from "@azure/functions";
import { AuthService } from "./AuthService";
import { FunctionResponse, responseFactory } from "./ResponseFactory";


export interface Settings {
    headers?: string[] | null;
    query?: string[] | null;
    body?: string[] | null;
}

export interface AuthSettings { 
    role?: string[],
    permission?: string[]
}

interface ValidationError {
    type: 'headers' | 'query' | 'body';
    message: string;
    expected: string[];
    missing: string[];
    all: string[];
    request: HttpRequest;
}

export interface AuthValidationError {
    type: 'permission' | 'role';
    message: string;
    expected: string[];
    missing: string[];
    request: HttpRequest;
}


export function validationErrorLog(context: Context, error: ValidationError | AuthValidationError) {
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

    if (errors.length === 0) return null;
    
    const errorMessages: string[] = [];
    errors.forEach(error => {
        validationErrorLog(context, error);
        errorMessages.push(error.message);
    });
    
    return responseFactory(400, 'Validation Errors', errorMessages);
}


export async function validateAuth(context: Context, req: HttpRequest, settings: AuthSettings, authService: AuthService): Promise<FunctionResponse | null> {

    const validator = async (type: 'permission' | 'role', settings: AuthSettings) => {
        const expected = settings[type];
        let missing = []
        for (let i = 0; i < expected.length; i++) {
            const item = expected[i];
            let present = false;
            if (type == 'permission') present = await authService.hasPermission(context, req, item);
            if (type == 'role') present = await authService.hasRole(context, req, item);
            if (!present) missing.push(item);
        }

        if (missing.length == 0) return
        const error: AuthValidationError = {
            type: type,
            message: `Missing ${type}: ${missing.join(', ')}`,
            expected: expected,
            missing: missing,
            request: req
        } 
        return error;
    }

    const errors: AuthValidationError[] = [];
    if (settings.permission) {const e = await validator('permission', settings); e ? errors.push(e) : null}
    if (settings.role) {const e = await validator('role', settings); e ? errors.push(e) : null}

    if (errors.length === 0) return null;
    
    const errorMessages: string[] = [];
    errors.forEach(error => {
        validationErrorLog(context, error);
        errorMessages.push(error.message);
    });
    
    return responseFactory(400, 'Validation Errors', errorMessages);
}
