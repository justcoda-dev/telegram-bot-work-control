import { Markup } from "telegraf";
import { KEYBOARD_ID } from "../keyboardId.js";

export const startKeyboard = Markup.keyboard([
  [KEYBOARD_ID.MAIN.ADD_USER, KEYBOARD_ID.MAIN.DELETE_USER],
  [KEYBOARD_ID.MAIN.USERS_LIST, KEYBOARD_ID.MAIN.USERS_LIST_WITH_PING],
]);
