import { Context, HttpRequest } from "@azure/functions";

export interface Settings {
    headers?: string[] | null;
    query?: string[] | null;
    body?: string[] | null;
}

export interface AuthSettings { 
    role?: string[],
    permission?: string[]
}

export interface ValidationError {
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

export interface AuthService {
    hasRole(context: Context, req: HttpRequest, role: string): Promise<boolean>
    hasPermission(context: Context, req: HttpRequest, permission: string): Promise<boolean>
}

export interface FunctionResponse<T> {
    status: number
    body: FunctionResponseBody<T>
    headers: Record<string, string>
}

export interface FunctionResponseBody<T> {
    success: boolean
    message: string
    data: T | undefined
}