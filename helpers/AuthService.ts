import { Context, HttpRequest } from "@azure/functions";

export interface AuthService {

    hasRole(context: Context, req: HttpRequest, role: string): Promise<boolean>

    hasPermission(context: Context, req: HttpRequest, permission: string): Promise<boolean>
    
}