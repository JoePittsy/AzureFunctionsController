import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { FunctionResponse } from "./ResponseFactory";
import { Settings, validate } from "./Validator";

export class AzureClass {


    /**
     * Custom validation method that is ran before the implementation, 
     * this method can be used to check for auth or more
     * 
     * @param context AzureFunction context object
     * @param req HTTPRequest object
     * @returns An error FunctionResponse or null if no error
     */
    async validation (context: Context, req: HttpRequest):  Promise<FunctionResponse | null> { return null }

    /**
     * This method is intended as a space to set class paramaters 
     * The setup method is excecuted after validation by defualt.
     * 
     * @param context AzureFunction context object
     * @param req HTTPRequest object
     * @returns An error FunctionResponse or null if no error
    */
    async setup (context: Context, req: HttpRequest):  Promise<FunctionResponse | null> { return null }
   
    /**
     * The implementation of the GET API logic, by default excecuted last.
     * * 
     * @param context AzureFunction context object
     * @param req HTTPRequest object
     * @returns A FunctionResponse
     */
    async GETimplementation (context: Context, req: HttpRequest):  Promise<FunctionResponse> { return }
    /**
     * The implementation of the POST API logic, by default excecuted last.
     * * 
     * @param context AzureFunction context object
     * @param req HTTPRequest object
     * @returns A FunctionResponse
     */
    async POSTimplementation (context: Context, req: HttpRequest):  Promise<FunctionResponse> { return }
    /**
     * The implementation of the PATCH API logic, by default excecuted last.
     * * 
     * @param context AzureFunction context object
     * @param req HTTPRequest object
     * @returns A FunctionResponse
     */
    async PATCHimplementation (context: Context, req: HttpRequest):  Promise<FunctionResponse> { return }
    /**
     * The implementation of the DELETE API logic, by default excecuted last.
     * * 
     * @param context AzureFunction context object
     * @param req HTTPRequest object
     * @returns A FunctionResponse
     */
    async DELETEimplementation (context: Context, req: HttpRequest):  Promise<FunctionResponse> { return }

    build(): AzureFunction { 
        return async (context: Context, req: HttpRequest) => {
            let rval: FunctionResponse | null;
            if (rval = await this.validation(context, req)) return context.res = rval;

            switch (req.method) {
                case 'GET':
                    return context.res = await this.GETimplementation(context, req);
                case 'POST':
                    return context.res = await this.POSTimplementation(context, req);
                case 'PATCH':
                    return context.res = await this.PATCHimplementation(context, req);
                case 'DELETE':
                    return context.res = await this.DELETEimplementation(context, req);
            }
        }
    }
}