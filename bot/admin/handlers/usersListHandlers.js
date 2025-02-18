import { userController } from "../../../db/models/user/user.controller.js";
import { workingDayController } from "../../../db/models/working_day/workingDay.controller.js";
import { EMOJI } from "../../static/emoji.js";
import { loading } from "../../utils/loading.js";
import { KEYBOARD_ID } from "../keyboards/keyboardId.js";
import { navigationKeyboard } from "../keyboards/keyboardInline/navigationKeyboard.js";

const items_per_page = 5;
const showUsersList = async (ctx) => {
  try {
    const { startLoadingMessage, endLoadingMessage } = loading(ctx);
    await ctx.deleteMessage();
    if (ctx.session.usersListState) {
      for (const message of ctx.session.usersListState.listMessages) {
        await ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
      }
      ctx.session.usersListState.listMessages = [];
    } else {
      ctx.session.usersListState = {};
      ctx.session.usersListState.listMessages = [];
    }

    const state = ctx.session.usersListState;
    state.usersPage = 1;
    const offset = (state.usersPage - 1) * items_per_page;
    await startLoadingMessage();
    const users = await userController.getAndCountUsers(offset, items_per_page);
    await endLoadingMessage();
    const usersWorkingTime = users.rows.map((user) =>
      workingDayController.getWorkingDay({ user_id: user.dataValues.id })
    );

    state.usersMaxPage = Math.ceil(users.count / items_per_page);
    if (users.rows.length) {
      const usersList = users.rows
        .map(
          (user, index) =>
            `${index + 1 + offset}. telegram_id: <b>${
              user.dataValues.telegram_id
            }.</b> Ім'я: <b>${user.dataValues.name}.</b> <b>Присутність</b> ${
              user.dataValues.is_pinged ? EMOJI.STATUS_TRUE : EMOJI.STATUS_FALSE
            }`
        )
        .join("\n");

      state.listMessages.push(
        await ctx.replyWithHTML(
          `<b>Список користувачів:</b>\n${usersList}\n
        Сторінка ${state.usersPage} із ${state.usersMaxPage}`,
          navigationKeyboard(KEYBOARD_ID.INLINE.USERS_NAVIGATION)
        )
      );
      console.log(ctx.session);
    } else {
      state.listMessages.push(await ctx.reply("Список користувачів пустий."));
    }
  } catch (error) {
    console.error(error);
    await ctx.reply(
      `Не вдалось отримати список користувачів, спробуйте пізніше ${EMOJI.FORBIDDEN}.`
    );
  }
};
const nextPageUsersList = async (ctx) => {
  try {
    const state = ctx.session.usersListState;
    if (state.listMessages) {
      for (const message of state.listMessages) {
        await ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
        state.listMessages = [];
      }
    }
    const { startLoadingMessage, endLoadingMessage } = loading(ctx);

    state.usersPage =
      state.usersPage < state.usersMaxPage
        ? state.usersPage + 1
        : state.usersMaxPage;

    const offset = (state.usersPage - 1) * items_per_page;
    await startLoadingMessage();
    const users = await userController.getAndCountUsers(offset, items_per_page);
    await endLoadingMessage();
    state.usersMaxPage = Math.ceil(users.count / items_per_page);
    if (users.rows.length) {
      const usersList = users.rows
        .map(
          (user, index) =>
            `${index + 1 + offset}. telegram_id: <b>${
              user.dataValues.telegram_id
            }.</b> Ім'я: <b>${user.dataValues.name}.</b> <b>Присутність</b> ${
              user.dataValues.is_pinged ? EMOJI.STATUS_TRUE : EMOJI.STATUS_FALSE
            }`
        )
        .join("\n");

      state.listMessages.push(
        await ctx.replyWithHTML(
          `<b>Список користувачів:</b>\n
      ${usersList}\n
      Сторінка ${state.usersPage} із ${state.usersMaxPage}`,
          navigationKeyboard(KEYBOARD_ID.INLINE.USERS_NAVIGATION)
        )
      );
    } else {
      state.listMessages(await ctx.reply("Список користувачів пустий."));
    }
  } catch (error) {
    console.error(error);
    await ctx.reply(
      `Не вдалось отримати список користувачів, спробуйте пізніше ${EMOJI.FORBIDDEN}.`
    );
  }
};
const prevPageUsersList = async (ctx) => {
  try {
    const state = ctx.session.usersListState;
    if (state.listMessages) {
      for (const message of state.listMessages) {
        await ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
        state.listMessages = [];
      }
    }
    const { startLoadingMessage, endLoadingMessage } = loading(ctx);
    state.usersPage = state.usersPage > 1 ? state.usersPage - 1 : 1;
    const offset = (state.usersPage - 1) * items_per_page;
    await startLoadingMessage();
    const users = await userController.getAndCountUsers(offset, items_per_page);
    await endLoadingMessage();
    state.usersMaxPage = Math.ceil(users.count / items_per_page);
    if (users.rows.length) {
      const usersList = users.rows
        .map(
          (user, index) =>
            `${index + 1 + offset}. telegram_id: <b>${
              user.dataValues.telegram_id
            }.</b> Ім'я: <b>${user.dataValues.name}.</b> <b>Присутність</b> ${
              user.dataValues.is_pinged ? EMOJI.STATUS_TRUE : EMOJI.STATUS_FALSE
            }`
        )
        .join("\n");

      state.listMessages.push(
        await ctx.replyWithHTML(
          `<b>Список користувачів:</b>\n
        ${usersList}\n
        Сторінка ${state.usersPage} із ${state.usersMaxPage}`,
          navigationKeyboard(KEYBOARD_ID.INLINE.USERS_NAVIGATION)
        )
      );
    } else {
      state.push(await ctx.reply("Список користувачів пустий."));
    }
  } catch (error) {
    console.error(error);
    await ctx.reply(
      `Не вдалось отримати список користувачів, спробуйте пізніше ${EMOJI.FORBIDDEN}.`
    );
  }
};

export { showUsersList, nextPageUsersList, prevPageUsersList };
