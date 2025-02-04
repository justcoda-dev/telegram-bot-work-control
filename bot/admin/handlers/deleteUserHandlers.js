import { userController } from "../../../db/models/user/user.controller.js";
import { EMOJI } from "../../static/emoji.js";
const submitDeleteUser = async (ctx) => {
  try {
    const { telegramId: telegram_id } = ctx.session;
    const deletedUserId = await userController.deleteUser({ telegram_id });

    if (deletedUserId) {
      await ctx.answerCbQuery(
        `Користувача ${telegram_id} успішно видалено ${EMOJI.STATUS_TRUE}`
      );
      await ctx.reply(
        `Користувача ${telegram_id} успішно видалено ${EMOJI.STATUS_TRUE}`
      );
    } else {
      await ctx.reply(
        `Користувача ${telegram_id} не знайдено, перевірте telegram_id ${EMOJI.STATUS_FALSE}`
      );
    }

    if (ctx.session.messagesToDelete) {
      for (const message of ctx.session.messagesToDelete) {
        await ctx.deleteMessage(message.message_id);
      }
      ctx.session = {};
    }
  } catch (error) {
    console.log(error);
    await ctx.reply(
      `Наразі бот не доступний, спробуйте пізніше ${EMOJI.FORBIDDEN}.`
    );
  }
};

const cancelDeleteUser = async (ctx) => {
  try {
    const { telegram_id } = ctx.session;
    await ctx.answerCbQuery(
      `Видалення користувача ${telegram_id} скасовано ${EMOJI.STATUS_FALSE}`
    );
    if (ctx.session.messagesToDelete) {
      for (const message of ctx.session.messagesToDelete) {
        await ctx.deleteMessage(message.message_id);
      }
      ctx.session = {};
    }
  } catch (error) {
    console.log(error);
    await ctx.reply(
      `Наразі бот не доступний, спробуйте пізніше ${EMOJI.FORBIDDEN}.`
    );
  }
};
export { submitDeleteUser, cancelDeleteUser };
