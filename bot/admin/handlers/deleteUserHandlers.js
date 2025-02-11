import { userController } from "../../../db/models/user/user.controller.js";
import { EMOJI } from "../../static/emoji.js";
import { loading } from "../../utils/loading.js";
const submitDeleteUser = async (ctx) => {
  try {
    const { startLoadingMessage, endLoadingMessage } = loading(ctx);
    const state = ctx.session.deleteUserState;
    const { telegramId: telegram_id } = state;
    await startLoadingMessage();
    const deletedUserId = await userController.deleteUser({ telegram_id });
    await endLoadingMessage();

    if (deletedUserId) {
      await ctx.reply(
        `Користувача ${telegram_id} успішно видалено ${EMOJI.STATUS_TRUE}`
      );
    } else {
      await ctx.reply(
        `Користувача ${telegram_id} не знайдено, перевірте telegram_id ${EMOJI.STATUS_FALSE}`
      );
    }

    if (state) {
      for (const message of state.messages) {
        await ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
      }
    }
    ctx.session.deleteUserState = null;
  } catch (error) {
    console.error(error);
    await ctx.reply(
      `Наразі бот не доступний, спробуйте пізніше ${EMOJI.FORBIDDEN}.`
    );
  }
};

const cancelDeleteUser = async (ctx) => {
  try {
    const state = ctx.session.deleteUserState;
    const { telegram_id } = state;
    state.messages.push(
      await ctx.reply(
        `Видалення користувача ${telegram_id} скасовано ${EMOJI.STATUS_FALSE}`
      )
    );
    if (ctx.session.deleteUserState) {
      for (const message of ctx.session.deleteUserState.messages) {
        await ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
      }
    }
    ctx.session.deleteUserState = null;
  } catch (error) {
    console.error(error);
    await ctx.reply(`При скасуванні сталася помилка ${EMOJI.FORBIDDEN}.`);
  }
};
export { submitDeleteUser, cancelDeleteUser };
