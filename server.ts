import { Application } from "oak";
import { webhookCallback } from "grammy";
import { bot } from "./bot.ts";

const app = new Application(); // or whatever you're using

export const webhookSecret = Deno.env.get("BOT_TOKEN")?.replace(/[^a-zA-Z0-9]/g, "");

if (!webhookSecret) {
  throw new Error("BOT_TOKEN is not set");
}

// Make sure to specify the framework you use.
app.use(webhookCallback(bot, "oak", { secretToken: webhookSecret }));

app.listen({ port: 3000 });
console.log("Server is running on http://localhost:3000");
