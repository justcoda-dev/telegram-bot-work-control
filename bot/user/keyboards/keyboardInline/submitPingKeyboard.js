import { Markup } from "telegraf";
import { EMOJI } from "../../../static/emoji.js";
import { USER_KEYBOARD_ACTION } from "../keyboardId.js";

export const submitPingKeyboard = (entity) =>
  Markup.inlineKeyboard([
    [
      Markup.button.callback(
        `${EMOJI.STATUS_TRUE} Підтвердити`,
        `${entity}@${USER_KEYBOARD_ACTION.INLINE.SUBMIT}`
      ),
      Markup.button.callback(
        `${EMOJI.STATUS_FALSE} Скасувати`,
        `${entity}@${USER_KEYBOARD_ACTION.INLINE.CANCEL}`
      ),
    ],
  ]).resize();
