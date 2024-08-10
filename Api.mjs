import { config as dotenvConfig } from "dotenv";
dotenvConfig({ path: ".env" });

import OpenAI from 'openai';
import { Telegraf } from 'telegraf';

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const bot = new Telegraf(process.env.BOT_TOKEN, { polling: true, handlerTimeout: 1000 * 60 * 10});