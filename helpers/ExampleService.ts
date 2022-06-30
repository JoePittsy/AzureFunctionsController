export class ExampleService { 
    secret: string;
    constructor(secret: string) { 
        this.secret = secret;
    }

    message() {
        return "This is a message from the Example Service! Secret = " + this.secret;
    }
}