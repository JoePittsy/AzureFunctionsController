# Azure Functions Controller

This package allows for Azure unctions to be grouped together in a single controller.
Using the @Endpoint decorator we can easily make any method in the controller exposed to the API, futhermore the @Validate and @CheckAuth decorators allow you to stop worrying about validating input and get to writing code!

> IMPORTANT! Add "experimentalDecorators": true & "emitDecoratorMetadata": true to tsconfig!

## Example Controller
### index.ts
```ts
import {AuthService, AzureFunctionsController, CheckAuth, Endpoint, FunctionResponse, responseFactory, Validate} from "azure-functions-controller"
import { Context, HttpRequest } from "@azure/functions"

import { userService, authService } from "./myServices"

class ExampleUserController extends AzureFunctionsController {

    exampleUserService;
    constructor(exampleUserService, exampleAuthService: AuthService) { 
        super(exampleAuthService)
        this.exampleUserService = exampleUserService;
    }

    @Endpoint({'method': 'GET', 'route': '/ping'})
    async Ping(context: Context, req: HttpRequest): Promise<FunctionResponse<string>> {
        return responseFactory(200, "Pong");
    }

    @Validate({'body': ['username', 'id']})
    @Endpoint({'method': 'PATCH', 'route': '/updateUser'})
    async test(context: Context, req: HttpRequest): Promise<FunctionResponse<string>> {
        // Since we validated that the body has username and id we can use them knowing they are defined.
        const {username, id} = req.body;
        const result = this.exampleUserService.updateUsername(id, username);
        return responseFactory(200, "Updated username!", {result});
    }
    
    @Validate({'body': ['id']})
    @CheckAuth({'role': ['admin']})
    @Endpoint({'method': 'DELETE', 'route': '/deleteUser'})
    async deleteUser(context: Context, req: HttpRequest): Promise<FunctionResponse<string>> {
        // Since we used the CheckAuth decorater we know the user is an admin so we can go ahead and delete the user.
        const {id} = req.body;
        const result = this.exampleUserService.deleteUser(id);
        return responseFactory(200, "Deleted user", {result});
    }
}
// Pass in the userService & authService, this allows us to swap out the services for mocks during testing.
const run = new ExampleUserController(userService, authService).build();
export {run, ExampleUserController as ExampleController}
```
### function.json
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      // Must match path(s) used in controller
      "route": "{operation:alpha}",
      // Must match methods used in controller
      "methods": [
        "get",
        "patch",
        "delete"
      ]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ],
  "scriptFile": "../dist/HttpTrigger1/index.js"
}
```
### tsconfig.json
``` json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es6",
    "outDir": "dist",
    "rootDir": ".",
    "sourceMap": true,
    "strict": false,
    "experimentalDecorators": true, // NEEDED
    "emitDecoratorMetadata": true // NEEEDED
  }
}
```