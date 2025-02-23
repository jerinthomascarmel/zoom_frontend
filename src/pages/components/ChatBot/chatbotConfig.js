import { createChatBotMessage } from 'react-chatbot-kit';

const botName = 'ChatBot';

const config = {
    botName: botName,
    initialMessages: [createChatBotMessage(`Hi! I'm ${botName}. Tell me about the meeting `)],
    // Add more configurations like custom components, state handlers, etc.
};

export default config;
