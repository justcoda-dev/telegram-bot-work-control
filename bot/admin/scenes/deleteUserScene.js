import { WizardScene } from "telegraf/scenes";
import { KEYBOARD_ID } from "../keyboards/keyboardId.js";
import { EMOJI } from "../../static/emoji.js";
import { isNumeric } from "../../utils/isNumeric.js";
import { submitKeyboard } from "../keyboards/keyboardInline/submitKeyboard.js";

export const deleteUserScene = new WizardScene(
  KEYBOARD_ID.MAIN.DELETE_USER,
  async (ctx) => {
    try {
      ctx.deleteMessage();
      ctx.session.messagesToDelete = [];
      ctx.session.messagesToDelete.push(
        await ctx.reply(`Введіть telegram_id користувача ${EMOJI.USER}:`)
      );
      return ctx.wizard.next();
    } catch (error) {
      console.log(error);
      await ctx.reply(
        `Наразі створення клієнта недоступне, спробуйте пізніше ${EMOJI.FORBIDDEN}.`
      );
      ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      ctx.session.messagesToDelete.push(ctx.message);
      const telegramId = ctx.message.text;
      if (isNumeric(telegramId)) {
        ctx.session.telegramId = telegramId;
        ctx.session.messagesToDelete.push(
          await ctx.reply(
            `Підтвердіть видалення користувача telegram_id: ${telegramId} ${EMOJI.USER}`,
            submitKeyboard(KEYBOARD_ID.INLINE.DELETE_USER)
          )
        );
        return ctx.scene.leave();
      } else {
        await ctx.reply(
          "telegram_id повинен містити тільки числа, введіть ще раз:"
        );
        return ctx.scene.reenter();
      }
    } catch (error) {
      console.log(error);
      await ctx.reply(
        `Наразі створення клієнта недоступне, спробуйте пізніше ${EMOJI.FORBIDDEN}.`
      );
      ctx.scene.leave();
    }
  }
);
