// Chat message
export class Message {
    contents: string;
    // Is this message by a person (or the chatbot).
    isPerson: boolean;

    constructor(contents: string, isPerson: boolean) {
      this.contents = contents;
      this.isPerson = isPerson;
    }

    static create(contents: string, isPerson: boolean) {
        return new Message(contents, isPerson);
    }
}
