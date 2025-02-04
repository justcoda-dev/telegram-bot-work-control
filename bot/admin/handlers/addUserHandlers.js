import { userController } from "../../../db/models/user/user.controller.js";
import { adminController } from "../../../db/models/admin/admin.controller.js";
import { EMOJI } from "../../static/emoji.js";
const submitAddUser = async (ctx) => {
  try {
    const { name, telegramId: telegram_id } = ctx.session;
    console.log(telegram_id);
    const admin = await adminController.getAdmin({ telegram_id: ctx.from.id });
    const [user, created] = await userController.findOrCreate(
      { name, telegram_id, admin_id: admin.dataValues.id },
      { telegram_id }
    );

    if (created) {
      await ctx.answerCbQuery(
        `Користувача ${name} успішно додано ${EMOJI.STATUS_TRUE}`
      );
      await ctx.reply(
        `Користувача ${name} успішно додано ${EMOJI.STATUS_TRUE}`
      );
    } else {
      await ctx.reply(
        `Користувач з telegram_id: ${telegram_id} вже існує під іменем ${user.dataValues.name} ${EMOJI.STATUS_TRUE}`
      );
      await ctx.answerCbQuery(
        `Користувач з telegram_id: ${telegram_id} вже існує під іменем ${user.dataValues.name} ${EMOJI.STATUS_TRUE}`
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
const cancelAddUser = async (ctx) => {
  try {
    const { name } = ctx.session;
    await ctx.answerCbQuery(
      `Створення користувача ${name} скасовано ${EMOJI.STATUS_FALSE}`
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
export { submitAddUser, cancelAddUser };
