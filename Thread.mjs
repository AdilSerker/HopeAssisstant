import { openai } from './Api.mjs';

export class Thread {
    static async createThread(question, vectorStoreId) {
        return openai.beta.threads.create({
            messages: [
              {
                role: "user",
                content: question,
              },
            ],
            tool_resources: {
              "file_search": {
                "vector_store_ids": [vectorStoreId]
              }
            }
          });
    }

    static async addMessage(threadId, message) {
        return openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: message,
        });
    }
}