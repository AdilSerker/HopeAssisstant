import { Application } from "./Application.mjs";


(async () => {
  // Создаем ассистентов
  const app = new Application();
  await app.initialize();
  await app.start();
})();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
