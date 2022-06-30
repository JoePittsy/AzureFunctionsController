export interface RequestParams { 
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | "DELETE" | 'COPY' | 'HEAD' | 'OPTIONS' | 'LINK' | 'UNLINK' | 'PURGE' | 'LOCK' | 'UNLOCK' | 'PROPFIND' | 'VIEW';
    url?: string;
    headers?: Record<string, string>;
    params?: Record<string, string>;
    body?: Record<string, string>;
    query?: Record<string, string>;
}