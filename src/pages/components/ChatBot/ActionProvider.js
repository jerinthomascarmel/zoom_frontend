import axios from "axios";

class ActionProvider {
    constructor(createChatBotMessage, setState, createClientMessage, stateRef, ...rest) {
        this.createChatBotMessage = createChatBotMessage;
        this.setState = setState;
        this.createClientMessage = createClientMessage;
        this.stateRef = stateRef;

        const { transcripts } = rest;
        this.transcripts = transcripts
    }


    getResponse = async (userInput) => {


        const GROQ_API_KEY = import.meta.env.VITE_GROQ_KEY;

        const prompt = `
            You are an AI assistant specialized in summarizing and answering questions based on meeting transcripts.
            Don't say you are given with transcripts, just say that was discussed in the meeting


            Meeting Transcript:
            ${this.transcripts || "this meetings has no information"}

            
            User Question: ${userInput}

            Answer:
        `;

        const messages = [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt },
        ];


        let botMessage = "how can i assist you ? "
        try {
            let url = 'https://api.groq.com/openai/v1/chat/completions'
            const response = await axios.post(
                url,
                {
                    model: "gemma2-9b-it",
                    messages: messages
                },
                {
                    headers: {
                        Authorization: `Bearer ${GROQ_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            botMessage = this.createChatBotMessage(response.data.choices[0].message.content.trim())

        } catch (error) {
            console.error('Error fetching response from Groq:', error);
            botMessage = this.createChatBotMessage('An error occurred while fetching the response.')
        }

        this.setState((prev) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
        }));
    }
}

export default ActionProvider;
