class MessageParser {
    constructor(actionProvider) {
        this.actionProvider = actionProvider;
    }

    parse(message) {
        const userInput = message.toLowerCase();
        this.actionProvider.getResponse(userInput);
    }
}

export default MessageParser;
