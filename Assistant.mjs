import { openai, bot } from './Api.mjs';

export class Assistant {
    static async createAssistant(name, instructions) {
        const assistant = await openai.beta.assistants.create({
            name: name,
            instructions: instructions,
            model: "gpt-4o-mini",
            tools: [{ type: "file_search" }],
        });
        return new Assistant(assistant);
    }

    constructor(assistant) {
        this.assistant = assistant;
        this.vectorStore = null;
        this.threads = [];
    }

    async getResponse(userId, threadId) {
        try {
            
            const stream = openai.beta.threads.runs.stream(threadId, {
                assistant_id: this.assistant.id,
                stream: true,
            });
    
            let messages = null;
    
            let text = '';

            let lastSentText = '';
    
            let currentTime = new Date().getTime();
    
            await bot.telegram.sendChatAction(userId, 'typing');
            // send action bot typing
            const timer = setInterval(async () => {
                await bot.telegram.sendChatAction(userId, 'typing');
            }, 5000);
    
            console.log('start answering...');
            for await (const response of stream) {
                console.log('awaiting response...', response.event);
                if (response.event === "thread.message.delta") {
                    if (!messages) {
                        text = response.data.delta.content[0].text.value;
                        messages = await bot.telegram.sendMessage(userId, text);
                        lastSentText = text;
                    } else {
                        text += response.data.delta.content[0].text.value;
                    }
                }

                if (currentTime + 2000 < new Date().getTime()) {
                    currentTime = new Date().getTime();
                    if (messages) {
                        await bot.telegram.editMessageText(userId, messages.message_id, null, text);
                        lastSentText = text;
                    }
                }
    
                if (response.event === "thread.message.completed") {
                    if (lastSentText != response.data.content[0].text.value) {
                        text = response.data.content[0].text.value;
                        await bot.telegram.editMessageText(userId, messages.message_id, null, text);
                    }   
                    
                    
                    clearInterval(timer);
                }

                if (response.event === "thread.run.completed") {
                    clearInterval(timer);
                }
            }
        } catch (error) {
            await bot.telegram.sendMessage(userId, error.message);
        }
        

    }

    
}