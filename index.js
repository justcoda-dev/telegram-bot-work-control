import { bot } from "./bot/bot.js";
import { configDotenv } from "dotenv";
configDotenv();
bot.launch();
