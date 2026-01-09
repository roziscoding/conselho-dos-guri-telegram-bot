const token = Deno.env.get("BOT_TOKEN")

if (!token) {
  throw new Error("BOT_TOKEN is not set");
}

export const config = {
  token,
  webhookSecret: token.replace(/[^a-zA-Z0-9]/g, ""),
}