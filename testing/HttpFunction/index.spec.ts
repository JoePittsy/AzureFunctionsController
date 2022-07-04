
import { HTTPTest } from './index';
import { mockedRequestFactory } from '../FunctionRunner';
import { FunctionResponseBody } from '../../helpers/Interfaces';


describe('Example Test', () => {
    
    let mockService;
    let mockAuthService
    let api: HTTPTest;

    beforeEach(() => {
        mockService = jasmine.createSpyObj('ExampleService', ['message']);
        mockService.message.and.returnValue('This is a message from the mocked service!');
        
        mockAuthService = jasmine.createSpyObj('AuthService', ['hasRole', 'hasPermission']);
        mockAuthService.hasPermission.and.returnValue(true);
        mockAuthService.hasRole.and.returnValue(true);

        api = new HTTPTest(mockService, mockAuthService);

    });

    it('Should work with a mocked service', async () => {
        const azureFunc = api.build();
        const response = await mockedRequestFactory(azureFunc, {url: '/test/wow', query: {'name': 'Joe'}});
        const resBody = JSON.parse(response.body as unknown as string) as FunctionResponseBody<string>;
        expect(response.status).toEqual(200);
        expect(resBody.success).toEqual(true);
        expect(resBody.data).toEqual(undefined);
        expect(resBody.message).toEqual('Hello, Joe. This HTTP triggered function executed successfully. Service Message: This is a message from the mocked service!');
    });

    it('Should work with a GET request', async () => {
        const azureFunc = api.build();
        const response = await mockedRequestFactory(azureFunc, {url: '/test/wow', method: 'GET', query: {'name': 'Joe'}});
        const resBody = JSON.parse(response.body as unknown as string) as FunctionResponseBody<string>;
        expect(response.status).toEqual(200);
        expect(resBody.success).toEqual(true);
        expect(resBody.data).toEqual(undefined);
        expect(resBody.message).toEqual('Hello, Joe. This HTTP triggered function executed successfully. Service Message: This is a message from the mocked service!');
    });

    it('Should work with a POST request', async () => {
        const azureFunc = api.build();
        const response = await mockedRequestFactory(azureFunc, {url: '/test/wow', method: 'POST', body: {'name': 'Joe'}, query: {'user': 'Alex'}});
        const resBody = JSON.parse(response.body as unknown as string) as FunctionResponseBody<string>;
        expect(response.status).toEqual(200);
        expect(resBody.success).toEqual(true);
        expect(resBody.data).toEqual(undefined);
        expect(resBody.message).toEqual('Hello, Joe. This HTTP triggered function executed successfully. Service Message: This is a message from the mocked service!');
    });
});
