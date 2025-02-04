import { Telegraf } from "telegraf";
import { session } from "telegraf";
import { authorization } from "./middlewares/authorization.js";
import { configDotenv } from "dotenv";
configDotenv();
export const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());
// bot.use(stage.middleware());
bot.use(authorization);
