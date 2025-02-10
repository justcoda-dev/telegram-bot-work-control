import { Markup } from "telegraf";
import { KEYBOARD_ACTION } from "../keyboardId.js";
import { EMOJI } from "../../../static/emoji.js";
export const repeatKeyboard = (entity) =>
  Markup.inlineKeyboard([
    Markup.button.callback(
      `Ввести повторно ${EMOJI.STATUS_TRUE}`,
      `${entity}@${KEYBOARD_ACTION.INLINE.REPEAT}`
    ),
    Markup.button.callback(
      `Скасувати ${EMOJI.STATUS_FALSE}`,
      `${entity}@${KEYBOARD_ACTION.INLINE.CANCEL}`
    ),
  ]).resize();
