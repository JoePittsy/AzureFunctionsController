
import { HTTPTest, run } from './index';
import { FunctionResponseBody } from '../helpers/ResponseFactory';
import { mockedRequestFactory } from '../testing/FunctionRunner';


describe('Example Test', () => {
    
    let mockService;
    let api: HTTPTest;

    beforeEach(() => {
        mockService = jasmine.createSpyObj('ExampleService', ['message']);
        mockService.message.and.returnValue('This is a message from the mocked service!');

        api = new HTTPTest(mockService);

    });

    it('Should work with a mocked service', async () => {
        const azureFunc = api.build();
        const response = await mockedRequestFactory(azureFunc, {query: {'name': 'Joe'}});
        const resBody = JSON.parse(response.body) as FunctionResponseBody;
        expect(response.status).toEqual(200);
        expect(resBody.success).toEqual(true);
        expect(resBody.data).toEqual(undefined);
        expect(resBody.message).toEqual('Hello, Joe. This HTTP triggered function executed successfully. Service Message: This is a message from the mocked service!');
    });

    it('Should work with a GET request', async () => {
        const azureFunc = api.build();
        const response = await mockedRequestFactory(azureFunc, {method: 'GET', query: {'name': 'Joe'}});
        const resBody = JSON.parse(response.body) as FunctionResponseBody;
        expect(response.status).toEqual(200);
        expect(resBody.success).toEqual(true);
        expect(resBody.data).toEqual(undefined);
        expect(resBody.message).toEqual('Hello, Joe. This HTTP triggered function executed successfully. Service Message: This is a message from the mocked service!');
    });

    it('Should work with a POST request', async () => {
        const azureFunc = api.build();
        const response = await mockedRequestFactory(azureFunc, {method: 'POST', body: {'name': 'Joe'}});
        const resBody = JSON.parse(response.body) as FunctionResponseBody;
        expect(response.status).toEqual(200);
        expect(resBody.success).toEqual(true);
        expect(resBody.data).toEqual(undefined);
        expect(resBody.message).toEqual('Hello, Joe. This HTTP triggered function executed successfully. Service Message: This is a message from the mocked service!');
    });
});
