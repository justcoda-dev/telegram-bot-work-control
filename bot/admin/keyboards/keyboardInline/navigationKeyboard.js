import { Markup } from "telegraf";
import { EMOJI } from "../../../static/emoji.js";
import { KEYBOARD_ACTION } from "../keyboardId.js";

export const navigationKeyboard = (entity) =>
  Markup.inlineKeyboard([
    [
      Markup.button.callback(
        `${EMOJI.PREV} Попередня`,
        `${entity}@${KEYBOARD_ACTION.INLINE.PREV}`
      ),
      Markup.button.callback(
        ` Наступна ${EMOJI.NEXT}`,
        `${entity}@${KEYBOARD_ACTION.INLINE.NEXT}`
      ),
    ],
    // [
    //   Markup.button.callback(
    //     `${EMOJI.STATUS_FALSE} Закрити`,
    //     `${entity}@${KEYBOARD_ACTION.INLINE.CLOSE}`
    //   ),
    // ],
  ]).resize();
