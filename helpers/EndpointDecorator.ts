import { HttpMethod } from "@azure/functions";
import "reflect-metadata";

export const Endpoint = (settings: {method: HttpMethod, route: string}) => ( target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    Reflect.defineMetadata('tn:anotations:method', settings.method, target, propertyKey);
    Reflect.defineMetadata('tn:anotations:route', settings.route, target, propertyKey);
    descriptor.value = function (...args) {
        return originalMethod.apply(this, args);
    };

    return descriptor;
}; 