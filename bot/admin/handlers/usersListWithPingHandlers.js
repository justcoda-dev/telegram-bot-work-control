import { Markup } from "telegraf";
import { userController } from "../../../db/models/user/user.controller.js";
import { EMOJI } from "../../static/emoji.js";
import { loading } from "../../utils/loading.js";
import { KEYBOARD_ID } from "../keyboards/keyboardId.js";
import { navigationKeyboard } from "../keyboards/keyboardInline/navigationKeyboard.js";

const items_per_page = 5;
const showUsersListWithPing = async (ctx) => {
  try {
    const { startLoadingMessage, endLoadingMessage } = loading(ctx);
    await startLoadingMessage();
    ctx.session.usersPage = 1;
    const offset = (ctx.session.usersPage - 1) * items_per_page;
    const users = await userController.getAndCountUsers(offset, items_per_page);
    await endLoadingMessage();
    await ctx.deleteMessage();
    ctx.session.usersMaxPage = Math.ceil(users.count / items_per_page);
    if (users.rows.length) {
      ctx.session.messagesToDelete = [
        await ctx.reply(
          "Пінганути користувачу:",
          Markup.inlineKeyboard(
            users.rows.map((user) => [
              Markup.button.callback(
                `Пінганути ${user.dataValues.name}, telegram_id:${user.dataValues.telegram_id}`,
                user.dataValues.telegram_id
              ),
            ])
          )
        ),
        await ctx.replyWithHTML(
          `${ctx.session.usersPage}із${ctx.session.usersMaxPage}`,
          navigationKeyboard(KEYBOARD_ID.INLINE.USERS_NAVIGATION_WITH_PING)
        ),
      ];
    } else {
      await ctx.reply("Список клієнтів пустий.");
    }
  } catch (error) {
    console.error(error);
    await ctx.reply(
      `Наразі бот не доступний, спробуйте пізніше ${EMOJI.FORBIDDEN}.`
    );
  }
};
const nextPageUsersListWithPing = async (ctx) => {
  try {
    const { startLoadingMessage, endLoadingMessage } = loading(ctx);

    if (ctx.session.messagesToDelete) {
      for (const message of ctx.session.messagesToDelete) {
        ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
      }
    }
    ctx.session.usersPage =
      ctx.session.usersPage < ctx.session.usersMaxPage
        ? ctx.session.usersPage + 1
        : ctx.session.usersMaxPage;

    const offset = (ctx.session.usersPage - 1) * items_per_page;
    await startLoadingMessage();
    const users = await userController.getAndCountUsers(offset, items_per_page);
    await endLoadingMessage();
    ctx.session.usersMaxPage = Math.ceil(users.count / items_per_page);
    if (users.rows.length) {
      ctx.session.messagesToDelete = [
        await ctx.reply(
          "Пінганути користувачу:",
          Markup.inlineKeyboard(
            users.rows.map((user) => [
              Markup.button.callback(
                `Пінганути ${user.dataValues.name}, telegram_id:${user.dataValues.telegram_id}`,
                user.dataValues.telegram_id
              ),
            ])
          )
        ),
        await ctx.replyWithHTML(
          `${ctx.session.usersPage}із${ctx.session.usersMaxPage}`,
          navigationKeyboard(KEYBOARD_ID.INLINE.USERS_NAVIGATION_WITH_PING)
        ),
      ];
    } else {
      await ctx.reply("Список клієнтів пустий.");
    }
  } catch (error) {
    console.error(error);
    await ctx.reply(
      `Наразі бот не доступний, спробуйте пізніше ${EMOJI.FORBIDDEN}.`
    );
  }
};
const prevPageUsersListWithPing = async (ctx) => {
  try {
    if (ctx.session.messagesToDelete) {
      for (const message of ctx.session.messagesToDelete) {
        ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
      }
    }
    const { startLoadingMessage, endLoadingMessage } = loading(ctx);

    ctx.session.usersPage =
      ctx.session.usersPage > 1 ? ctx.session.usersPage - 1 : 1;
    const offset = (ctx.session.usersPage - 1) * items_per_page;
    await startLoadingMessage();
    const users = await userController.getAndCountUsers(offset, items_per_page);
    await endLoadingMessage();
    ctx.session.usersMaxPage = Math.ceil(users.count / items_per_page);
    if (users.rows.length) {
      ctx.session.messagesToDelete = [
        await ctx.reply(
          "Пінганути користувачу:",
          Markup.inlineKeyboard(
            users.rows.map((user) => [
              Markup.button.callback(
                `Пінганути ${user.dataValues.name}, telegram_id:${user.dataValues.telegram_id}`,
                user.dataValues.telegram_id
              ),
            ])
          )
        ),
        await ctx.replyWithHTML(
          `${ctx.session.usersPage}із${ctx.session.usersMaxPage}`,
          navigationKeyboard(KEYBOARD_ID.INLINE.USERS_NAVIGATION_WITH_PING)
        ),
      ];
    } else {
      await ctx.reply("Список клієнтів пустий.");
    }
  } catch (error) {
    console.error(error);
    await ctx.reply(
      `Наразі бот не доступний, спробуйте пізніше ${EMOJI.FORBIDDEN}.`
    );
  }
};

const closeUsersListWithPing = async (ctx) => {
  try {
    if (ctx.session.messagesToDelete) {
      for (const message of ctx.session.messagesToDelete) {
        ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
      }
    }
  } catch (error) {
    console.error(error);
    await ctx.reply(
      `Наразі бот не доступний, спробуйте пізніше ${EMOJI.FORBIDDEN}.`
    );
  }
};

export {
  showUsersListWithPing,
  nextPageUsersListWithPing,
  prevPageUsersListWithPing,
  closeUsersListWithPing,
};
