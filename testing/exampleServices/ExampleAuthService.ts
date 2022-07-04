import { Context, HttpRequest } from "@azure/functions";
import { Validate } from "../../src/helpers/Helpers";
import { AuthService } from "../../src/helpers/Interfaces";

export class MyAuthService implements AuthService {

    @Validate({query: ['user']})
    async hasRole(context: Context, req: HttpRequest, role: string, ): Promise<boolean> {
        context.log('CHECKING AUTGH')
        const user = req.query.user;
        if (user == 'Joe')  {
            switch (role) {
                case  'admin': return true;
                case 'user': return true;
                default: return false;
            }
        }
        if (user == 'Alex')  {
            switch (role) {
                case  'admin': return false;
                case 'user': return true;
                default: return false;
            }
        }
    }

    @Validate({query: ['user']})
    async hasPermission(context: Context, req: HttpRequest, role: string, ): Promise<boolean> {
        const user = req.query.user;
        if (user == 'Joe')  {
            switch (role) {
                case  'read': return true;
                case 'write': return true;
                default: return false;
            }
        }
        if (user == 'Alex')  {
            switch (role) {
                case  'read': return true;
                case 'write': return false;
                default: return false;
            }
        }
    }
    
}