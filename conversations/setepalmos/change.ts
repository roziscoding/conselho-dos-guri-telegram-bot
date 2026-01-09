import { Conversation } from "@grammyjs/conversations";
import { Context, Keyboard } from "grammy";
import { kv } from "../../kv.ts";
import { SetePalmosList } from "../../types.ts";

export async function changeSetePalmos(conversation: Conversation, ctx: Context) {
  if (!ctx.chatId || ctx.chat?.type !== "private") {
    await ctx.reply("Por favor, usa esse comando em um chat privado comigo.");
    return conversation.halt();
  }

  const chatId = ctx.chatId.toString();

  const beforePickItem = conversation.checkpoint();

  const entry = await conversation.external(async () => await kv.get<SetePalmosList>(["setepalmos", chatId]));

  if (!entry.value) {
    await ctx.reply("Não há apostas salvas para este chat.");
    return conversation.halt();
  }

  const list = entry.value.list;

  const listKeyboard = Keyboard.from(list.map((value) => [{ text: value }]).concat([[{ text: "Cancelar" }]])).oneTime();
  await ctx.reply("Qual item da lista você quer alterar?", { reply_markup: listKeyboard });

  const toChange = await conversation.form.select(list.concat(["Cancelar"]), {
    otherwise: (ctx) => ctx.reply("Por favor, usa um dos botões pra selecionar um item da lista"),
  });

  if (toChange === "Cancelar") {
    await ctx.reply("Deixa pra lá então...");
    return conversation.halt();
  }

  const itemIndex = list.indexOf(toChange);

  if (itemIndex === -1) {
    await ctx.reply("Item não encontrado na lista.");
    return conversation.rewind(beforePickItem);
  }

  const afterPickItem = conversation.checkpoint();

  await ctx.reply("Qual o novo valor para o item?");
  const newItem = await conversation.form.text({ otherwise: (ctx) => ctx.reply("Por favor, envie o nome da pessoa numa mensagem de texto") });

  const confirmKeyboard = new Keyboard().text("Sim").text("Não").oneTime();
  await ctx.reply("Novo item: " + newItem + ". Está correto?", { reply_markup: confirmKeyboard });

  const confirm = await conversation.form.select(["Sim", "Não"], {
    otherwise: (ctx) => ctx.reply("Por favor, usa um dos botões pra confirmar ou começar novamente"),
  });

  if (confirm === "Sim") {
    list[itemIndex] = newItem;
    await kv.set(["setepalmos", chatId], {
      ...entry.value,
      list,
    });
    await ctx.reply("Item alterado com sucesso! Gostaria de alterar outro item?", { reply_markup: confirmKeyboard });
    const changeAnotherItem = await conversation.form.select(["Sim", "Não"], {
      otherwise: (ctx) => ctx.reply("Por favor, usa um dos botões pra continuar ou começar novamente"),
    });

    if (changeAnotherItem === "Sim") {
      return conversation.rewind(beforePickItem);
    } else {
      await ctx.reply("OK, então...");
    }
  } else {
    return conversation.rewind(afterPickItem);
  }
}
