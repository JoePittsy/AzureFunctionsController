import { Context, HttpRequest } from "@azure/functions";
import { validationErrorLog } from "./Helpers";
import { AuthService, AuthSettings, AuthValidationError } from "./Interfaces";
import responseFactory from "./ResponseFactory";


/**
 * TO USE ENSURE CLASS HAS A PROPERTY CALLED authService. authService MUST IMPLEMENT THE AuthService INTERFACE.
 * 
 * @param settings The permissions & roles to check for
 */
export const CheckAuth = (settings: AuthSettings) => ( target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args) {


        const context: Context = args[0];
        const req: HttpRequest = args[1];
        const authService: AuthService = this.authService;

        if (authService == undefined) throw Error("authService IS NOT DEFINED! authService MUST BE DEFINED AND IMPLEMENT THE AuthService INTERFACE TO USE THE AUTH DECORATOR!")

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
    
        if (errors.length === 0) return originalMethod.apply(this, args);
        
        const errorMessages: string[] = [];
        errors.forEach(error => {
            validationErrorLog(context, error);
            errorMessages.push(error.message);
        });
        
        return responseFactory(400, 'Validation Errors', errorMessages);

    };

    return descriptor;
}; 