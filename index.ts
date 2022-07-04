import { AzureFunction, Context, HttpMethod, HttpRequest } from "@azure/functions";

import "reflect-metadata";
import { responseFactory } from "./helpers";
import { AuthService, FunctionResponse } from "./helpers/Interfaces";
export class AzureFunctionsController {

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
    async preValidation(context: Context, req: HttpRequest): Promise<FunctionResponse<unknown> | null> { return null }

    /**
     * Custom validation method that is ran before the GET/POST/PATCH logic 
     * 
     * @param context AzureFunction context object
     * @param req HTTPRequest object
     * @returns An error FunctionResponse or null if no error
     */
    async validation(context: Context, req: HttpRequest): Promise<FunctionResponse<unknown> | null> { return null }


    /**
     * Custom setup method that is ran after validation but before the GET/POST/PATCH logic 
     * 
     * @param context AzureFunction context object
     * @param req HTTPRequest object
     * @returns An error FunctionResponse or null if no error
    */
    async postValidation(context: Context, req: HttpRequest): Promise<FunctionResponse<unknown> | null> { return null }


    /**
     * Builds the Azure Function call this and export the returned function.
     * 
     * @returns An AzureFunction
     */
    build(): AzureFunction {

        let routes: Record<HttpMethod, Record<string, Function>> = {
            'GET': {},
            'POST': {},
            'PATCH': {},
            'DELETE': {},
            'CONNECT': {},
            'OPTIONS': {},
            'PUT': {},
            'TRACE': {},
            'HEAD': {}
        }

        return async (context: Context, req: HttpRequest) => {

            // Use relection to get a list of all the methods the user has implemented
            const proto = Reflect.getPrototypeOf(this);
            const methods = Object.getOwnPropertyNames(proto).filter(m => m !== 'constructor');

            // For each of those check if the @Endpoint decorater was used by checking the reflected metadata
            for (let i = 0; i < methods.length; i++) {
                const methodName = methods[i];
                const httpMethod = Reflect.getMetadata('tn:anotations:method', this, methodName);
                const httpRoute = Reflect.getMetadata('tn:anotations:route', this, methodName);
                if (httpMethod && httpRoute) routes[httpMethod][httpRoute] = proto[methodName].bind(this)
            }

            // Split on /api/ and take the later half then split on ? to seperate the query params out.
            const route = req.url.split('/api/')[1].split('?')[0];
            const method = req.method;
            const endpoint = routes[method][route];
            if (!endpoint) return context.res = responseFactory(404, `${method}: ${route} could not be resolved`);

            // Run the preValidation, validation and postValidation functions
            let rval: FunctionResponse<unknown> | null;
            if (rval = await this.preValidation(context, req)) return context.res = rval;
            if (rval = await this.validation(context, req)) return context.res = rval;
            if (rval = await this.postValidation(context, req)) return context.res = rval;

            // Finally run the function that matches the method & route
            return context.res = await endpoint(context, req);
        }
    }
}