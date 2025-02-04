import { userController } from "../../../db/models/user/user.controller.js";
import { EMOJI } from "../../static/emoji.js";
import { loading } from "../../utils/loading.js";
import { KEYBOARD_ID } from "../keyboards/keyboardId.js";
import { navigationKeyboard } from "../keyboards/keyboardInline/navigationKeyboard.js";

const items_per_page = 5;
const showUsersList = async (ctx) => {
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
      const usersList = users.rows
        .map(
          (user, index) =>
            `<code>${index + 1 + offset}. telegram_id: <b>${
              user.dataValues.telegram_id
            }.</b> Ім'я: <b>${user.dataValues.name}.</b></code>`
        )
        .join("\n");

      await ctx.replyWithHTML(
        `<b>Список користувачів:</b>\n${usersList}\n
        Сторінка ${ctx.session.usersPage} із ${ctx.session.usersMaxPage}`,
        navigationKeyboard(KEYBOARD_ID.INLINE.USERS_NAVIGATION)
      );
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
const nextPageUsersList = async (ctx) => {
  try {
    const { startLoadingMessage, endLoadingMessage } = loading(ctx);

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
      const usersList = users.rows
        .map(
          (user, index) =>
            `${index + 1 + offset}.  id: <b>${
              user.dataValues.telegram_id
            }</b> Імя: <b>${user.dataValues.name}</b>.`
        )
        .join("\n");
      await ctx.deleteMessage();
      await ctx.replyWithHTML(
        `<b>Список користувачів:</b>\n
        ${usersList}\n
        Сторінка ${ctx.session.usersPage} із ${ctx.session.usersMaxPage}`,
        navigationKeyboard(KEYBOARD_ID.INLINE.USERS_NAVIGATION)
      );
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
const prevPageUsersList = async (ctx) => {
  try {
    const { startLoadingMessage, endLoadingMessage } = loading(ctx);

    ctx.session.usersPage =
      ctx.session.usersPage > 1 ? ctx.session.usersPage - 1 : 1;
    const offset = (ctx.session.usersPage - 1) * items_per_page;
    await startLoadingMessage();
    const users = await userController.getAndCountUsers(offset, items_per_page);
    await endLoadingMessage();
    ctx.session.usersMaxPage = Math.ceil(users.count / items_per_page);
    if (users.rows.length) {
      const usersList = users.rows
        .map(
          (user, index) =>
            `${index + 1 + offset}. telegram_id: <b>${
              user.dataValues.telegram_id
            }</b> Імя: <b>${user.dataValues.name}</b>. telegram_`
        )
        .join("\n");
      await ctx.deleteMessage();
      await ctx.replyWithHTML(
        `<b>Список користувачів:</b>\n
        ${usersList}\n
        Сторінка ${ctx.session.usersPage} із ${ctx.session.usersMaxPage}`,
        navigationKeyboard(KEYBOARD_ID.INLINE.USERS_NAVIGATION)
      );
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

const closeUsersList = async (ctx) => {
  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.error(error);
    await ctx.reply(
      `Наразі бот не доступний, спробуйте пізніше ${EMOJI.FORBIDDEN}.`
    );
  }
};

export { showUsersList, nextPageUsersList, prevPageUsersList, closeUsersList };
