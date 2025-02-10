import { WizardScene } from "telegraf/scenes";
import { KEYBOARD_ID } from "../keyboards/keyboardId.js";
import { EMOJI } from "../../static/emoji.js";
import { isNumeric } from "../../utils/isNumeric.js";
import { submitKeyboard } from "../keyboards/keyboardInline/submitKeyboard.js";
import { repeatKeyboard } from "../keyboards/keyboardInline/repeatKeyboard.js";

export const addUserScene = new WizardScene(
  KEYBOARD_ID.MAIN.ADD_USER,
  async (ctx) => {
    try {
      if (ctx.session.addUserState) {
        for (const message of ctx.session.addUserState.messages) {
          await ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
        }
        ctx.session.addUserState.messages = [];
      } else {
        ctx.session.addUserState = {};
        ctx.session.addUserState.messages = [];
        ctx.session.addUserState.messages.push(ctx.message);
      }
      const state = ctx.session.addUserState;
      state.messages.push(await ctx.reply("Введіть telegram_id користувача:"));
      ctx.wizard.next();
    } catch (error) {
      console.log(error);
      await ctx.reply(
        `Наразі створення клієнта недоступне, спробуйте пізніше ${EMOJI.FORBIDDEN}.`
      );
      await ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      const state = ctx.session.addUserState;
      state.messages.push(ctx.message);
      const telegramId = ctx.message.text;
      if (isNumeric(telegramId)) {
        state.telegramId = telegramId;
        state.messages.push(await ctx.reply("Введіть ім'я користувача:"));
        return ctx.wizard.next();
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
      await ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      const state = ctx.session.addUserState;
      state.messages.push(ctx.message);
      const name = ctx.message.text;
      if (name.length > 2) {
        state.name = name;
        state.messages.push(
          await ctx.reply(
            `Підтвердіть створення користувача ${name}, telegram_id: ${state.telegramId}`,
            submitKeyboard(KEYBOARD_ID.INLINE.ADD_USER)
          )
        );

        await ctx.scene.leave();
      } else {
        await ctx.reply(
          "Ім'я повинен містити більше 2х символів, введіть ім'я ще раз:"
        );
        await ctx.scene.leave();
      }
    } catch (error) {
      console.log(error);
      await ctx.reply(
        `Наразі створення клієнта недоступне, спробуйте пізніше ${EMOJI.FORBIDDEN}.`
      );
      await ctx.scene.leave();
    }
  }
);
