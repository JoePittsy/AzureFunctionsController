import { Context, HttpRequest } from "@azure/functions"
import { MyAuthService } from "../exampleServices/ExampleAuthService";
import { ExampleService } from "../exampleServices/ExampleService";
import { AzureFunctionsController } from "../..";
import { CheckAuth, Endpoint, responseFactory, Validate } from "../../helpers";
import { FunctionResponse } from "../../helpers/Interfaces";

class HTTPTest extends AzureFunctionsController {

    myService: ExampleService;
    
    constructor(exampleService: ExampleService, authService: MyAuthService) {
        super(authService)
        this.myService = exampleService;
    }
    
    @Validate({query: ['name']})
    @Endpoint({method: 'GET', route: 'test/wow'})
    async GET(context: Context, req: HttpRequest): Promise<FunctionResponse<string>> {
        const responseMessage = "Hello, " + req.query.name + ". This HTTP triggered function executed successfully. Service Message: " + this.myService.message()
        return responseFactory(200, responseMessage);
    }
    
    @CheckAuth({role: ['admin']})
    @Validate({body: ['name'], query: ['user']})
    @Endpoint({method: 'POST', route: 'test/wow'})
    async POST(context: Context, req: HttpRequest): Promise<FunctionResponse<string>> {
        const responseMessage = "Hello, " + req.body.name + ". This HTTP triggered function executed successfully. Service Message: " + this.myService.message()
        return responseFactory(200, responseMessage);
    }
}


const run = new HTTPTest(new ExampleService('Secret!'), new MyAuthService()).build()
export { HTTPTest, run };