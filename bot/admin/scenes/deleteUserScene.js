import { WizardScene } from "telegraf/scenes";
import { KEYBOARD_ID } from "../keyboards/keyboardId.js";
import { EMOJI } from "../../static/emoji.js";
import { isNumeric } from "../../utils/isNumeric.js";
import { submitKeyboard } from "../keyboards/keyboardInline/submitKeyboard.js";

export const deleteUserScene = new WizardScene(
  KEYBOARD_ID.MAIN.DELETE_USER,
  async (ctx) => {
    try {
      if (ctx.session.deleteUserState) {
        for (const message of ctx.session.deleteUserState.messages) {
          await ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
        }
        ctx.session.deleteUserState.messages = [];
      } else {
        ctx.session.deleteUserState = {};
        ctx.session.deleteUserState.messages = [];
        ctx.session.deleteUserState.messages.push(ctx.message);
      }

      const state = ctx.session.deleteUserState;
      state.messages.push(
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
      const state = ctx.session.deleteUserState;
      state.messages.push(ctx.message);
      const telegramId = ctx.message.text;
      if (isNumeric(telegramId)) {
        state.telegramId = telegramId;
        state.messages.push(
          await ctx.reply(
            `Підтвердіть видалення користувача telegram_id: ${telegramId} ${EMOJI.USER}`,
            submitKeyboard(KEYBOARD_ID.INLINE.DELETE_USER)
          )
        );
        return ctx.scene.leave();
      } else {
        ctx.wizard.back();
        await ctx.wizard.steps[ctx.wizard.cursor](ctx);
        state.messages.push(
          await ctx.reply(
            "telegram_id повинен містити тільки числа, введіть ще раз."
          )
        );
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
