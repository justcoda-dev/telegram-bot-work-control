import { Composer } from "telegraf";
import { startKeyBoard } from "../keyboards/keyboard/startKeyBoard.js";
import {
  USER_KEYBOARD_ACTION,
  USER_KEYBOARD_ID,
} from "../keyboards/keyboardId.js";
import { cancelPing, submitPing } from "../handlers/pingHandlers.js";
import {
  endWork,
  pauseWork,
  continueWork,
  startWork,
} from "../handlers/workHandlers.js";
import { userController } from "../../../db/models/user/user.controller.js";
export const user = new Composer();
user.command("start", async (ctx) => {
  try {
    const user = await userController.getUser({ telegram_id: ctx.from.id });
    await ctx.reply(`Вітаю вас ${user.dataValues.name}`, startKeyBoard);
  } catch (error) {
    console.error(error);
  }
});
//main menu
user.hears(`${USER_KEYBOARD_ID.MAIN.START_WORK}`, startWork);
user.hears(`${USER_KEYBOARD_ID.MAIN.END_WORK}`, endWork);
user.hears(`${USER_KEYBOARD_ID.MAIN.PAUSE_WORK}`, pauseWork);
user.hears(`${USER_KEYBOARD_ID.MAIN.CONTINUE_WORK}`, continueWork);
// ping menu
user.action(
  `${USER_KEYBOARD_ID.INLINE.PING}@${USER_KEYBOARD_ACTION.INLINE.SUBMIT}`,
  submitPing
);
user.action(
  `${USER_KEYBOARD_ID.INLINE.PING}@${USER_KEYBOARD_ACTION.INLINE.CANCEL}`,
  cancelPing
);
