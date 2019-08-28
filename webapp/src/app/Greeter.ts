export class Greeter {
    greeting: string;
    list: Array<number>;

    constructor(message: string) {
        this.greeting = message;
        this.list = [1, 2, 3];
    }
    greet() {
      let response = "";
      response += "Hello, " + this.greeting;
      for (let entry of this.list) {
        response += " " + entry;
      }
      return response;
    }
}

export const greeter = new Greeter("world");
