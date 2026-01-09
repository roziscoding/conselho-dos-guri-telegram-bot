import { CommandGroup } from "@grammyjs/commands";
import {
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import { DenoKVAdapter } from "denokv";
import { Bot } from "grammy";
import { setSetePalmos } from "./conversations/setepalmos/set.ts";
import { changeSetePalmos } from "./conversations/setepalmos/change.ts";
import { kv } from "./kv.ts";
import { BotContext } from "./context.ts";
import { setePalmosCommand } from "./commands/setepalmos.ts";

const bot = new Bot<BotContext>(Deno.env.get("BOT_TOKEN")!);

bot.use(conversations({
  storage: new DenoKVAdapter(kv),
}));

bot.use(createConversation(setSetePalmos));
bot.use(createConversation(changeSetePalmos));

const commands = new CommandGroup<BotContext>();

commands.command("cancel", "Cancela o que você está fazendo", async (ctx) => {
  await ctx.reply("Deixa pra lá então...");
  return ctx.conversation.exitAll();
});

commands.add(setePalmosCommand);

bot.use(commands);

await commands.setCommands(bot);

bot.start({
  onStart: ({ username }) => {
    console.log(`Bot started as @${username}`);
  },
});
