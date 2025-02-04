import { WizardScene } from "telegraf/scenes";
import { KEYBOARD_ID } from "../keyboards/keyboardId.js";
import { EMOJI } from "../../static/emoji.js";
import { isNumeric } from "../../utils/isNumeric.js";
import { submitKeyboard } from "../keyboards/keyboardInline/submitKeyboard.js";

export const addUserScene = new WizardScene(
  KEYBOARD_ID.MAIN.ADD_USER,
  async (ctx) => {
    try {
      ctx.deleteMessage();
      ctx.session.messagesToDelete = [];
      ctx.session.messagesToDelete.push(
        await ctx.reply("Введіть telegram_id користувача:")
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
      const telegramId = ctx.message.text.toString();
      if (isNumeric(telegramId)) {
        ctx.session.telegramId = telegramId;
        ctx.session.messagesToDelete.push(
          await ctx.reply("Введіть ім'я користувача:")
        );
        return ctx.wizard.next();
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
  },
  async (ctx) => {
    try {
      ctx.session.messagesToDelete.push(ctx.message);
      const name = ctx.message.text;
      if (name.length > 2) {
        ctx.session.name = name;
        ctx.session.messagesToDelete.push(
          await ctx.reply(
            `Підтвердіть створення користувача ${name}, telegram_id: ${ctx.session.telegramId}`,
            submitKeyboard(KEYBOARD_ID.INLINE.ADD_USER)
          )
        );
        return ctx.scene.leave();
      } else {
        await ctx.reply(
          "Ім'я повинен містити більше 2х символів, введіть ім'я ще раз:"
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
