import { userController } from "../../../db/models/user/user.controller.js";
import { adminController } from "../../../db/models/admin/admin.controller.js";
import { EMOJI } from "../../static/emoji.js";
const submitAddUser = async (ctx) => {
  try {
    const state = ctx.session.addUserState;
    const { name, telegramId: telegram_id } = state;
    if (!telegram_id) {
      return await ctx.reply(`Пройдіть процес створення користувача заново`);
    }
    const admin = await adminController.getAdmin({ telegram_id: ctx.from.id });
    const [user, created] = await userController.findOrCreate(
      { name, telegram_id, admin_id: admin.dataValues.id },
      { telegram_id }
    );

    if (created) {
      await ctx.reply(
        `Користувача ${name} успішно додано ${EMOJI.STATUS_TRUE}`
      );
    } else {
      await ctx.reply(
        `Користувач з telegram_id: ${telegram_id} вже існує під іменем ${user.dataValues.name} ${EMOJI.STATUS_TRUE}`
      );
    }
    if (state) {
      for (const message of state.messages) {
        await ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
      }
    }
    ctx.session.addUserState = null;
  } catch (error) {
    console.error(error);
    await ctx.reply(
      `При створенні користувача сталася помилка, спробуйте пізніше ${EMOJI.FORBIDDEN}.`
    );
  }
};
const cancelAddUser = async (ctx) => {
  try {
    ctx.answerCbQuery();
    const state = ctx.session.addUserState;

    if (state) {
      for (const message of state.messages) {
        await ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
      }
    }

    ctx.session.addUserState = null;
    return await ctx.scene.leave();
  } catch (error) {
    console.error(error);
    await ctx.reply(
      `При відміні створити користувача, сталася помилка ${EMOJI.FORBIDDEN}.`
    );
  }
};
export { submitAddUser, cancelAddUser };
