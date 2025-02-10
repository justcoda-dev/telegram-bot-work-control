import { Markup } from "telegraf";
import { USER_KEYBOARD_ID } from "../keyboardId.js";
export const startKeyBoard = Markup.keyboard([
  [USER_KEYBOARD_ID.MAIN.START_WORK],
]).resize();
