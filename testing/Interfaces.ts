import { HttpMethod } from "@azure/functions";

export interface RequestParams { 
    method?: HttpMethod;
    url?: string;
    headers?: Record<string, string>;
    params?: Record<string, string>;
    body?: Record<string, string>;
    query?: Record<string, string>;
}