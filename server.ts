import { Application } from "oak";
import { webhookCallback } from "grammy";
import { bot } from "./bot.ts";
import { config } from "./config.ts";

const app = new Application();

app.use(webhookCallback(bot, "oak", { secretToken: config.webhookSecret }));

const port = Number(Deno.env.get("PORT") ?? '3000');

app.listen({ port });
console.log(`Server is running on http://localhost:${port}`);
