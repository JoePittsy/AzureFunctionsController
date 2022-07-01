import responseFactory, { FunctionResponse } from "../helpers/ResponseFactory";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { ExampleService } from "../helpers/ExampleService";
import { AzureClass } from "../helpers/AzureClass"
import {Validate} from "../helpers/ValidateDecorators"
class HTTPTest extends AzureClass {

    myService: ExampleService;
    constructor(exampleService: ExampleService) {
        super()
        this.myService = exampleService;
    }
    
    @Validate({query: ['name']})
    async GETimplementation(context: Context, req: HttpRequest): Promise<FunctionResponse | null> {
        const responseMessage = "Hello, " + req.query.name + ". This HTTP triggered function executed successfully. Service Message: " + this.myService.message()
        return responseFactory(200, responseMessage);
    }

    @Validate({body: ['name']})
    @Validate({query: ['test']})
    async POSTimplementation(context: Context, req: HttpRequest): Promise<FunctionResponse | null> {
        const responseMessage = "Hello, " + req.body.name + ". This HTTP triggered function executed successfully. Service Message: " + this.myService.message()
        return responseFactory(200, responseMessage);
    }
}


const run = new HTTPTest(new ExampleService('Secret!')).build()

export { HTTPTest, run };