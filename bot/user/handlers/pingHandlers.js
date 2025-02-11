import { userController } from "../../../db/models/user/user.controller.js";
import { EMOJI } from "../../static/emoji.js";

const submitPing = async (ctx) => {
  try {
    await ctx.deleteMessage();
    const userId = ctx.from.id;
    await ctx.reply(`Підтверджено ${EMOJI.STATUS_TRUE}`);
    const user = await userController.getUser({ telegram_id: userId });
    user.is_pinged = true;
    await user.save();

    await ctx.telegram.sendMessage(
      user.dataValues.pinged_admin,
      `${user.dataValues.name}, telegram_id:${user.dataValues.telegram_id} підтвердив присутність ${EMOJI.STATUS_TRUE}`
    );
  } catch (error) {
    console.error(error);
    await ctx.reply(`При підтвердженні сталась помилка ${EMOJI.STATUS_FALSE}`);
  }
};
const cancelPing = async (ctx) => {
  try {
    await ctx.deleteMessage();
    const userId = ctx.from.id;
    await ctx.reply(`Скасовано ${EMOJI.STATUS_FALSE}`);
    const user = await userController.getUser({ telegram_id: userId });
    user.is_pinged = false;
    await user.save();
    await ctx.telegram.sendMessage(
      user.dataValues.pinged_admin,
      `${user.dataValues.name}, telegram_id:${user.dataValues.telegram_id} відмінив підтвердження ${EMOJI.STATUS_FALSE}`
    );
  } catch (error) {
    console.error(error);
    await ctx.reply(`При скасуванні сталась помилка ${EMOJI.STATUS_FALSE}`);
  }
};

export { submitPing, cancelPing };
