import { Command } from "@grammyjs/commands";
import { kv } from "../kv.ts";
import { BotContext } from "../context.ts";
import { SetePalmosList } from "../types.ts";

export const setePalmosCommand = new Command<BotContext>(
  "setepalmos",
  "Escolha 7 pessoas que você acha que termina 2026 a 7 palmos da terra :)",
  async (ctx) => {
    if (!ctx.chatId) {
      return ctx.reply(
        "Por favor, usa esse comando em um chat privado comigo.",
      );
    }

    const param = ctx.msg.text?.split(" ")[1];

    if (!param) {
      return ctx.reply("Uso: `/setepalmos [get|set|change|participants]`", {
        parse_mode: "MarkdownV2",
      });
    }

    switch (param) {
      case "set":
        return ctx.conversation.enter("setSetePalmos");
      case "change":
        return ctx.conversation.enter("changeSetePalmos");
      case "get": {
        return ctx.conversation.enter("getSetePalmos");
      }
      case "participants": {
        const items = kv.list<SetePalmosList>({ prefix: ["setepalmos"] });
        const users: string[] = [];
        for await (const item of items) {
          const { userName, chatId } = item.value;
          users.push(`[${userName}](tg://user?id=${chatId})`);
        }

        if (users.length === 0) {
          return ctx.reply("Não há usuários com apostas salvas.");
        }

        return ctx.reply(`Usuários com apostas salvas: ${users.join(", ")}`, {
          parse_mode: "MarkdownV2",
        });
      }
      default:
        return ctx.reply("Uso: `/setepalmos [set|change]`", {
          parse_mode: "MarkdownV2",
        });
    }
  },
)
  .addToScope({ type: "default" });
