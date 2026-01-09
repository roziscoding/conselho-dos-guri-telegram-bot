import { bot } from "./bot.ts";

bot.start({
  onStart: ({ username }) => {
    console.log(`Bot started as @${username}`);
  },
});