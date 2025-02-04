import { admin } from "../admin/composers/admin.js";
import { user } from "../user/composers/user.js";
import { userController } from "../../db/models/User/user.controller.js";
import { adminController } from "../../db/models/admin/admin.controller.js";

export const authorization = async (ctx, next) => {
  try {
    const telegram_id = ctx.from.id;
    const is_admin = await adminController.getAdmin({
      telegram_id,
    });
    const is_user = await userController.getUser({
      telegram_id,
    });
    if (is_user) {
      return user.middleware()(ctx, next);
    } else if (is_admin) {
      return admin.middleware()(ctx, next);
    } else {
      await ctx.reply(MESSAGES.FORBIDDEN);
    }
  } catch (error) {
    console.error(error);
    await ctx.reply(`Помилка при авторизації`);
  }
};
