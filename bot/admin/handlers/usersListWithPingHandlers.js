import { Markup } from "telegraf";
import { userController } from "../../../db/models/user/user.controller.js";
import { EMOJI } from "../../static/emoji.js";
import { loading } from "../../utils/loading.js";
import { KEYBOARD_ACTION, KEYBOARD_ID } from "../keyboards/keyboardId.js";
import { navigationKeyboard } from "../keyboards/keyboardInline/navigationKeyboard.js";
import { submitPingKeyboard } from "../../user/keyboards/keyboardInline/submitPingKeyboard.js";
import { USER_KEYBOARD_ID } from "../../user/keyboards/keyboardId.js";

const items_per_page = 5;
const showUsersListWithPing = async (ctx) => {
  try {
    const { startLoadingMessage, endLoadingMessage } = loading(ctx);
    await ctx.deleteMessage();
    if (ctx.session.usersListWithPingState) {
      for (const message of ctx.session.usersListWithPingState
        .pingListMessages) {
        await ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
      }
      ctx.session.usersListWithPingState.pingListMessages = [];
    } else {
      ctx.session.usersListWithPingState = {};
      ctx.session.usersListWithPingState.pingListMessages = [];
    }

    const state = ctx.session.usersListWithPingState;
    state.pingListMessages = [];

    state.usersPage = 1;
    const offset = (state.usersPage - 1) * items_per_page;
    await startLoadingMessage();
    const users = await userController.getAndCountUsers(offset, items_per_page);
    await endLoadingMessage();

    state.usersMaxPage = Math.ceil(users.count / items_per_page);
    if (users.rows.length) {
      state.pingListMessages.push(
        await ctx.replyWithHTML(
          "<b>Перевірити присутність користувачів:</b>",
          Markup.inlineKeyboard([
            ...users.rows.map((user) => [
              Markup.button.callback(
                `${user.dataValues.name}, telegram_id:${user.dataValues.telegram_id}`,
                `${KEYBOARD_ACTION.INLINE.PING}@${user.dataValues.telegram_id}`
              ),
            ]),
            [
              Markup.button.callback(
                "Вислати всім",
                `${KEYBOARD_ID.INLINE.USERS_NAVIGATION_WITH_PING}@${KEYBOARD_ACTION.INLINE.PING_ALL}`
              ),
            ],
          ])
        )
      );

      state.pingListMessages.push(
        await ctx.replyWithHTML(
          `Сторінка ${state.usersPage} із ${state.usersMaxPage}`,
          navigationKeyboard(KEYBOARD_ID.INLINE.USERS_NAVIGATION_WITH_PING)
        )
      );
    } else {
      state.pingListMessages.push(
        await ctx.reply("Список користувачів пустий.")
      );
    }
  } catch (error) {
    console.error(error);
    await ctx.reply(
      `Не вдалось отримати список клієнтів, спробуйте пізніше ${EMOJI.FORBIDDEN}.`
    );
  }
};

const nextPageUsersListWithPing = async (ctx) => {
  try {
    const state = ctx.session.usersListWithPingState;
    const { startLoadingMessage, endLoadingMessage } = loading(ctx);

    if (state.pingListMessages) {
      for (const message of state.pingListMessages) {
        await ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
        state.pingListMessages = [];
      }
    }

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
      state.pingListMessages.push(
        await ctx.replyWithHTML(
          "<b>Перевірити присутність користувачів:</b>",
          Markup.inlineKeyboard([
            ...users.rows.map((user) => [
              Markup.button.callback(
                `${user.dataValues.name}, telegram_id:${user.dataValues.telegram_id}`,
                `${KEYBOARD_ACTION.INLINE.PING}@${user.dataValues.telegram_id}`
              ),
            ]),
            [
              Markup.button.callback(
                "Вислати всім",
                `${KEYBOARD_ID.INLINE.USERS_NAVIGATION_WITH_PING}@${KEYBOARD_ACTION.INLINE.PING_ALL}`
              ),
            ],
          ])
        )
      );

      state.pingListMessages.push(
        await ctx.replyWithHTML(
          `Сторінка ${state.usersPage} із ${state.usersMaxPage}`,
          navigationKeyboard(KEYBOARD_ID.INLINE.USERS_NAVIGATION_WITH_PING)
        )
      );
    } else {
      state.pingListMessages.push(
        await ctx.reply("Список користувачів пустий.")
      );
    }
  } catch (error) {
    console.error(error);
    await ctx.reply(
      `Не вдалось отримати список користувачів, спробуйте пізніше ${EMOJI.FORBIDDEN}.`
    );
  }
};
const prevPageUsersListWithPing = async (ctx) => {
  try {
    const state = ctx.session.usersListWithPingState;
    if (state.pingListMessages) {
      for (const message of state.pingListMessages) {
        await ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
        state.pingListMessages = [];
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
      state.pingListMessages.push(
        await ctx.replyWithHTML(
          "<b>Перевірити присутність користувачів:</b>",
          Markup.inlineKeyboard([
            ...users.rows.map((user) => [
              Markup.button.callback(
                `${user.dataValues.name}, telegram_id:${user.dataValues.telegram_id}`,
                `${KEYBOARD_ACTION.INLINE.PING}@${user.dataValues.telegram_id}`
              ),
            ]),
            [
              Markup.button.callback(
                "Вислати всім",
                `${KEYBOARD_ID.INLINE.USERS_NAVIGATION_WITH_PING}@${KEYBOARD_ACTION.INLINE.PING_ALL}`
              ),
            ],
          ])
        )
      );

      state.pingListMessages.push(
        await ctx.replyWithHTML(
          `Сторінка ${state.usersPage} із ${state.usersMaxPage}`,
          navigationKeyboard(KEYBOARD_ID.INLINE.USERS_NAVIGATION_WITH_PING)
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

const pingUser = async (ctx) => {
  try {
    const userId = ctx.match[1];
    const user = await userController.getUser({ telegram_id: userId });

    user.is_pinged = false;
    user.pinged_admin = ctx.from.id;
    await user.save();
    await ctx.telegram.sendMessage(
      userId,
      `Підтвердіть що ви на місці`,
      submitPingKeyboard(USER_KEYBOARD_ID.INLINE.PING)
    );
  } catch (error) {
    await ctx.reply(
      `Користувач ${user.dataValues.name} в телеграм не зареєстрований ${EMOJI.FORBIDDEN}.`
    );
  }
};
const pingAllUsers = async (ctx) => {
  try {
    const users = await userController.getUsers();
    const messagesToUsers = users.map(async (user) => {
      try {
        user.is_pinged = false;
        user.pinged_admin = ctx.from.id;
        await user.save();
        await ctx.telegram.sendMessage(
          user.dataValues.telegram_id,
          `Підтвердіть що ви на місці`,
          submitPingKeyboard(USER_KEYBOARD_ID.INLINE.PING)
        );
      } catch (error) {
        console.error(error);
        await ctx.reply(
          `Користувач ${user.dataValues.name} з telegram_id:${user.dataValues.telegram_id} не зареєстрований в телеграм ${EMOJI.STATUS_FALSE}`
        );
      }
      return user;
    });

    await Promise.all(messagesToUsers);
  } catch (error) {
    console.error(error);
    await ctx.reply(`Помилка при отриманні користувачів ${EMOJI.FORBIDDEN}.`);
  }
};

export {
  showUsersListWithPing,
  nextPageUsersListWithPing,
  prevPageUsersListWithPing,
  pingUser,
  pingAllUsers,
};
