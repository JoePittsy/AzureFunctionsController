import responseFactory, { FunctionResponse } from "../helpers/ResponseFactory";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { ExampleService } from "../exampleServices/ExampleService";
import { AzureClass } from "../helpers/AzureClass"
import {Validate} from "../helpers/ValidateDecorator"
import { MyAuthService } from "../exampleServices/ExampleAuthService";
import { CheckAuth } from "../helpers/AuthDecorator";
class HTTPTest extends AzureClass {

    myService: ExampleService;
    
    constructor(exampleService: ExampleService, authService: MyAuthService) {
        super(authService)
        this.myService = exampleService;
    }
    
    @Validate({query: ['name']})
    async GET(context: Context, req: HttpRequest): Promise<FunctionResponse | null> {
        const responseMessage = "Hello, " + req.query.name + ". This HTTP triggered function executed successfully. Service Message: " + this.myService.message()
        return responseFactory(200, responseMessage);
    }

    @Validate({body: ['name']})
    @CheckAuth({role: ['admin']})
    async POST(context: Context, req: HttpRequest): Promise<FunctionResponse | null> {
        const responseMessage = "Hello, " + req.body.name + ". This HTTP triggered function executed successfully. Service Message: " + this.myService.message()
        return responseFactory(200, responseMessage);
    }
}


const run = new HTTPTest(new ExampleService('Secret!'), new MyAuthService()).build()

export { HTTPTest, run };