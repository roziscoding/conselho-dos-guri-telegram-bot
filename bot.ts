import { CommandGroup } from "@grammyjs/commands";
import { conversations, createConversation } from "@grammyjs/conversations";
import { DenoKVAdapter } from "denokv";
import { Bot } from "grammy";
import { setePalmosCommand } from "./commands/setepalmos.ts";
import { config } from "./config.ts";
import { BotContext } from "./context.ts";
import { changeSetePalmos } from "./conversations/setepalmos/change.ts";
import { getSetePalmos } from "./conversations/setepalmos/get.ts";
import { setSetePalmos } from "./conversations/setepalmos/set.ts";
import { kv } from "./kv.ts";

export const bot = new Bot<BotContext>(config.token);

bot.use(conversations({
  storage: new DenoKVAdapter(kv),
}));

bot.use(createConversation(setSetePalmos));
bot.use(createConversation(changeSetePalmos));
bot.use(createConversation(getSetePalmos));

const commands = new CommandGroup<BotContext>();

commands.command("cancel", "Cancela o que você está fazendo", async (ctx) => {
  await ctx.reply("Deixa pra lá então...");
  return ctx.conversation.exitAll();
});

commands.add(setePalmosCommand);

bot.use(commands);

await commands.setCommands(bot);
