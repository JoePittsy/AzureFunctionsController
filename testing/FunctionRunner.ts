import { AzureFunction } from "@azure/functions";
import { runStubFunctionFromBindings, createHttpTrigger } from 'stub-azure-function-context';
import { FunctionResponse } from "../src/helpers/Interfaces";
import { RequestParams } from "./Interfaces";


export async function mockedRequestFactory(func: AzureFunction, {method = 'GET', baseURL = '/api', url = '/', headers = {}, params = {}, body = {}, query = {} }: RequestParams): Promise<FunctionResponse<unknown>> {
    const data = await (runStubFunctionFromBindings(
        func, [{
            type: 'httpTrigger', name: 'req', direction: 'in', data: createHttpTrigger(method, baseURL+url, headers, params, body, query),
        }, { type: 'http', name: 'res', direction: 'out' }],
        new Date(),
    ));
    return data.res;
}