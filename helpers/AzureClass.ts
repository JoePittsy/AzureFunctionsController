import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { AuthService } from "./AuthService";
import { FunctionResponse } from "./ResponseFactory";
export class AzureClass {


    authService?: AuthService;

    /**
     * @param authService The AuthService to use with the '@CheckAuth' decorater
     */
    constructor(authService?: AuthService) {
        if (authService) this.authService = authService;
    }

    /**
     * Custom setup method that is ran first before validation.
     * 
     * @param context AzureFunction context object
     * @param req HTTPRequest object
     * @returns An error FunctionResponse or null if no error
    */
    async preValidation (context: Context, req: HttpRequest):  Promise<FunctionResponse | null> { return null }

    /**
     * Custom validation method that is ran before the GET/POST/PATCH logic 
     * 
     * @param context AzureFunction context object
     * @param req HTTPRequest object
     * @returns An error FunctionResponse or null if no error
     */
    async validation (context: Context, req: HttpRequest):  Promise<FunctionResponse | null> { return null }

    
    /**
     * Custom setup method that is ran after validation but before the GET/POST/PATCH logic 
     * 
     * @param context AzureFunction context object
     * @param req HTTPRequest object
     * @returns An error FunctionResponse or null if no error
    */
     async postValidation (context: Context, req: HttpRequest):  Promise<FunctionResponse | null> { return null }

    /**
     * The implementation of the GET API logic, excecuted last.
     * * 
     * @param context AzureFunction context object
     * @param req HTTPRequest object
     * @returns A FunctionResponse
     */
    async GET (context: Context, req: HttpRequest):  Promise<FunctionResponse> { return }
    /**
     * The implementation of the POST API logic, excecuted last.
     * * 
     * @param context AzureFunction context object
     * @param req HTTPRequest object
     * @returns A FunctionResponse
     */
    async POST (context: Context, req: HttpRequest):  Promise<FunctionResponse> { return }
    /**
     * The implementation of the PATCH API logic, excecuted last.
     * * 
     * @param context AzureFunction context object
     * @param req HTTPRequest object
     * @returns A FunctionResponse
     */
    async PATCH (context: Context, req: HttpRequest):  Promise<FunctionResponse> { return }
        /**
     * The implementation of the PUT API logic,  excecuted last.
     * * 
     * @param context AzureFunction context object
     * @param req HTTPRequest object
     * @returns A FunctionResponse
     */
    async PUT (context: Context, req: HttpRequest):  Promise<FunctionResponse> { return }
    /**
     * The implementation of the DELETE API logic, excecuted last.
     * * 
     * @param context AzureFunction context object
     * @param req HTTPRequest object
     * @returns A FunctionResponse
     */
    async DELETE (context: Context, req: HttpRequest):  Promise<FunctionResponse> { return }

    build(): AzureFunction { 
        return async (context: Context, req: HttpRequest) => {
            let rval: FunctionResponse | null;


            if (rval = await this.preValidation(context, req)) return context.res = rval;
            if (rval = await this.validation(context, req)) return context.res = rval;
            if (rval = await this.postValidation(context, req)) return context.res = rval;

            switch (req.method) {
                case 'GET':
                    return context.res = await this.GET(context, req);
                case 'POST':
                    return context.res = await this.POST(context, req);
                case 'PATCH':
                    return context.res = await this.PATCH(context, req);
                case 'PUT':
                    return context.res = await this.PUT(context, req);
                case 'DELETE':
                    return context.res = await this.DELETE(context, req);
            }
        }
    }
}