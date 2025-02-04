import { Markup } from "telegraf";
import { EMOJI } from "../../../static/emoji.js";
import { KEYBOARD_ACTION } from "../keyboardId.js";

export const submitKeyboard = (entity) =>
  Markup.inlineKeyboard([
    Markup.button.callback(
      `Підтвердити ${EMOJI.STATUS_TRUE}`,
      `${entity}@${KEYBOARD_ACTION.INLINE.SUBMIT}`
    ),
    Markup.button.callback(
      `Скасувати ${EMOJI.STATUS_FALSE}`,
      `${entity}@${KEYBOARD_ACTION.INLINE.CANCEL}`
    ),
  ]).resize();
