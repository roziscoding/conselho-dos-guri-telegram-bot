import { Conversation } from "@grammyjs/conversations";
import { Context } from "grammy";
import { kv } from "../../kv.ts";
import { SetePalmosList } from "../../types.ts";

export async function getSetePalmos(conversation: Conversation, ctx: Context) {
  if (!ctx.chatId || ctx.chat?.type !== "private") {
    await ctx.reply("Por favor, usa esse comando em um chat privado comigo.");
    return conversation.halt();
  }
  
  const existingList = await kv.get<SetePalmosList>([
    "setepalmos",
    ctx.chatId.toString(),
  ]);

  if (!existingList.value) {
    return ctx.reply("Não há apostas salvas para você.");
  }

  const formattedList = existingList.value.list.map((value) => `- ${value}`)
    .join("\n");

  return ctx.reply(`Lista de apostas:\n${formattedList}`);
}