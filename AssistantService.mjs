import { openai } from './Api.mjs';
import { Assistant } from './Assistant.mjs';

export class AssistantService {
    
    async createAssistant(name, instructions) {
        return Assistant.createAssistant(name, instructions);
    }

    async retriveAssistant(assistantId) {
        return new Assistant(await openai.beta.assistants.retrieve(assistantId));
    }

    async listAssistants() {
        const assistants = await openai.beta.assistants.list({
            order: "desc",
            limit: "20",
        });
        return assistants.data.map(assistant => new Assistant(assistant));
    }

    

    async uploadFilesToVectorStore(filePaths, name) {
        const fileStreams = filePaths.map(path => fs.createReadStream(path));
    
        const vectorStores = await openai.beta.vectorStores.list({
            order: "desc",
            limit: "20",
        });
    
        const existingVectorStore = vectorStores.data.find((store) => store.name === name);
    
        if (existingVectorStore) {
        return existingVectorStore.id;
        }
    
        let vectorStore = await openai.beta.vectorStores.create({
            name
        });
    
        await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, fileStreams);
        return vectorStore.id;
    }
    
    async updateAssistantWithVectorStore(assistantId, vectorStoreId) {
        await openai.beta.assistants.update(assistantId, {
            tool_resources: { file_search: { vector_store_ids: [vectorStoreId] } },
        });
    }
}