import * as fs from 'fs';
import { openai } from './Api.mjs';

export class VectorDbService {
    static async createVectorStore(name) {
        return openai.beta.vectorStores.create({
            name
        });
    }

    static async uploadFilesToVectorStore(filePaths, vectorStore) {

        const fileStreams = filePaths.map(path => fs.createReadStream(path));
        await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, fileStreams);
    }

    static async updateAssistantWithVectorStore(assistantId, vectorStoreId) {
        await openai.beta.assistants.update(assistantId, {
          tool_resources: { file_search: { vector_store_ids: [vectorStoreId] } },
        });
    }

    static async getVectorStore(vecorStoreId) {
        const vectorStores = await openai.beta.vectorStores.list();
        
        return vectorStores.data.find((store) => store.id === vecorStoreId);
    }
}