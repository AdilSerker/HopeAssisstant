import { config as dotenvConfig } from "dotenv";
dotenvConfig({ path: ".env" });

import OpenAI from 'openai';
import { Telegraf } from 'telegraf';
import { HttpsProxyAgent } from "https-proxy-agent";

const aiProxy = () => {
    return {
      username: process.env.AI_HTTP_PROXY_USERNAME,
      password: process.env.AI_HTTP_PROXY_PASSWORD,
      host: process.env.AI_HTTP_PROXY_HOST,
      port: process.env.AI_HTTP_PROXY_PORT,
    };
  }

const aiProxyUrl = () => {
    const { username, password, host, port } = aiProxy();
    return Boolean(username && password && host && port)
      ? `http://${username}:${password}@${host}:${port}`
      : "";
  }

const proxyUrl = aiProxyUrl();

export const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY,
    httpAgent: proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined
});

export const bot = new Telegraf(process.env.BOT_TOKEN, { polling: true, handlerTimeout: 1000 * 60 * 10});