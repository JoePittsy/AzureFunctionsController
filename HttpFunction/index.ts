import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { AzureClass } from "../helpers/AzureClass"
import responseFactory, { FunctionResponse } from "../helpers/ResponseFactory";
import { Settings } from "../helpers/Validator";
import { ExampleService } from "../helpers/ExampleService";

class HTTPTest extends AzureClass {

    settings?: Settings = {
        query: [
            'name'
        ]
    }

    myService: ExampleService;
    
    constructor(exampleService: ExampleService) {
        super()
        this.myService = exampleService;
    }

    async implementation(context: Context, req: HttpRequest): Promise<FunctionResponse | null> {
        context.log('HTTP trigger function processed a request.');
        const responseMessage =  "Hello, " + req.query.name + ". This HTTP triggered function executed successfully. Service Message: " + this.myService.message()
        return responseFactory(200, responseMessage)
    }
}


const run = new HTTPTest(new ExampleService('Secret!')).build()

export { HTTPTest, run };