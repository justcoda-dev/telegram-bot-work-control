import { Markup } from "telegraf";
import { USER_KEYBOARD_ID } from "../keyboardId.js";
export const workPausedKeyBoard = Markup.keyboard([
  [USER_KEYBOARD_ID.MAIN.CONTINUE_WORK],
]).resize();
