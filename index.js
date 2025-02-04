import { app } from "./server/server.js";
import { bot } from "./bot/bot.js";
import { configDotenv } from "dotenv";
configDotenv();
const server_port = process.env.SERVER_PORT;
app.listen(server_port, () => {
  console.log(
    `Application started on port ${server_port}. http://localhost:${server_port}`
  );
});
bot.launch();
