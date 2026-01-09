import { bot } from "./bot.ts";
import { config } from "./config.ts";

const webhookUrl = Deno.args[0]

if (!webhookUrl) {
  console.error("Webhook URL is required");
  Deno.exit(1);
}

new URL(webhookUrl);

console.log(`Setting webhook to ${webhookUrl}`);
await bot.api.setWebhook(webhookUrl, { secret_token: config.webhookSecret });