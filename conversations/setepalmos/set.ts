import { Conversation } from "@grammyjs/conversations";
import { Context, Keyboard } from "grammy";
import { kv } from "../../kv.ts";
import { SetePalmosList } from "../../types.ts";

export async function setSetePalmos(
  conversation: Conversation,
  ctx: Context) {
  if (!ctx.chatId || ctx.chat?.type !== "private") {
    await ctx.reply("Por favor, usa esse comando em um chat privado comigo.");
    return conversation.halt();
  }

  const checkpoint = conversation.checkpoint();
  await ctx.reply(
    "Envia suas 7 apostas pra 2026, cada uma em uma mensagem separada."
  );

  const userName = ctx.from ? [ctx.from.first_name, ctx.from.last_name].filter(Boolean).join(" ") : ctx.chatId.toString();

  const entry: SetePalmosList = {
    chatId: ctx.chatId.toString(),
    userName,
    list: [],
  };

  while (entry.list.length < 7) {
    if (entry.list.length > 0) {
      await ctx.reply(`OK, envie a próxima aposta (${entry.list.length + 1}/7):`);
    }
    const answer = await conversation.form.text();

    if (answer === "/cancel") {
      await ctx.reply("Deixa pra lá então...");
      return conversation.halt();
    }

    if (answer) {
      entry.list.push(answer);
    }
  }

  const keyboard = new Keyboard().text("Sim").text("Não").oneTime();
  await ctx.reply("Lista de apostas finalizada! A lista abaixo tá correta?");
  await ctx.reply(entry.list.join("\n - "), { reply_markup: keyboard });

  const confirm = await conversation.form.select(["Sim", "Não"], {
    otherwise: (ctx) => ctx.reply(
      "Por favor, usa um dos botões pra confirmar ou começar novamente"
    ),
  });

  if (confirm === "Sim") {
    await kv.set([
      "setepalmos",
      ctx.chatId.toString(),
    ], entry);
    await ctx.reply("Apostas salvas com sucesso!");
  } else {
    await ctx.reply("Apostas não salvas. Começando novamente...");
    return conversation.rewind(checkpoint);
  }
}
