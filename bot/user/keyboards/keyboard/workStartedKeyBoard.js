import { Markup } from "telegraf";
import { USER_KEYBOARD_ID } from "../keyboardId.js";
export const workStartedKeyBoard = Markup.keyboard([
  [USER_KEYBOARD_ID.MAIN.PAUSE_WORK, USER_KEYBOARD_ID.MAIN.END_WORK],
]).resize();
