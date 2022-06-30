import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { FunctionResponse } from "./ResponseFactory";
import { Settings, validate } from "./Validator";

export class AzureClass {

    excecutionOrder: AzureFunction[] = [
        this.settingsValidation,
        this.setup,
        this.validation,
        this.implementation
    ]
    
    settings?: Settings;


    /**
     * In built settings validation. To use populate the
     * settings paramater with required query & body paramaters 
     * and required headers. 
     * 
     * @param context AzureFunction context object
     * @param req HTTPRequest object
     * @returns An error Function resoponse or null if no error
     */
    async settingsValidation (context: Context, req: HttpRequest): Promise<FunctionResponse | null> {
        if (this.settings) {
            return validate(context, req, this.settings)
        }
        return null;
    }

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
     * The implementation of the API logic, by default excecuted last.
     * * 
     * @param context AzureFunction context object
     * @param req HTTPRequest object
     * @returns A FunctionResponse
     */
    async implementation (context: Context, req: HttpRequest):  Promise<FunctionResponse> { return }

    build(): AzureFunction { 
        return async (context: Context, req: HttpRequest) => {
            for (let i = 0; i < this.excecutionOrder.length; i++) {
                const func = this.excecutionOrder[i];
                const value = await func.bind(this)(context, req);
                if (value) return context.res = value;                
            }
        }
    }
}