import { Settings, validate } from "./Validators";

export const Validate = (settings: Settings) => ( target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args) {
        return validate(args[0], args[1], settings).then(value => {
            if (value) return value
            return originalMethod.apply(this, args);
        })

    };

    return descriptor;
}; 