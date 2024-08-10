import { AssistantService } from './AssistantService.mjs';
import { VectorDbService } from './VectorDbService.mjs';
import { Thread } from './Thread.mjs';
import { bot } from './Api.mjs';

export class Application {
    constructor() {
        this.assistantService = new AssistantService();

        bot.on('text', this.textHandler.bind(this));

        this.assistant = null;

        this.userThreads = {};
    }

    async textHandler(ctx) {
        console.log('textHandler', ctx.message.text);
        if (!this.assistant) return;

        const userId = ctx.message.from.id;
        if (!this.userThreads[userId]) {
            this.userThreads[userId] = await Thread.createThread(ctx.message.text, this.assistant.vectorStore.id);
        } else {
            await Thread.addMessage(this.userThreads[userId].id, ctx.message.text);
        }

        await this.assistant.getResponse(userId, this.userThreads[userId].id);

    }

    async initialize() {
        
        this.assistant = await this.assistantService.retriveAssistant(process.env.ASSISTANT_ID);
        this.assistant.vectorStore = await VectorDbService.getVectorStore(process.env.VECTOR_STORE_ID);

        await VectorDbService.updateAssistantWithVectorStore(
            this.assistant.assistant.id, 
            this.assistant.vectorStore.id
        );

        await this.assistantService.updateAssistantWithVectorStore(this.assistant.assistant.id, this.assistant.vectorStore.id);
    }

    async start() {
        console.log('Bot has been started');
        await bot.launch();
        
    }
}