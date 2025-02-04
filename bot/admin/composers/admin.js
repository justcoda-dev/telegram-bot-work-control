import { Composer } from "telegraf";
import { startKeyboard } from "../keyboards/keyboard/startKeyboard.js";
import { Stage } from "telegraf/scenes";
import { addUserScene } from "../scenes/addUserScene.js";
import { KEYBOARD_ACTION, KEYBOARD_ID } from "../keyboards/keyboardId.js";
import { EMOJI } from "../../static/emoji.js";
import { cancelAddUser, submitAddUser } from "../handlers/addUserHandlers.js";
import {
  cancelDeleteUser,
  submitDeleteUser,
} from "../handlers/deleteUserHandlers.js";
import {
  closeUsersList,
  nextPageUsersList,
  prevPageUsersList,
  showUsersList,
} from "../handlers/usersListHandlers.js";
import { deleteUserScene } from "../scenes/deleteUserScene.js";
import {
  closeUsersListWithPing,
  nextPageUsersListWithPing,
  prevPageUsersListWithPing,
  showUsersListWithPing,
} from "../handlers/usersListWithPingHandlers.js";
//hears(/^🗑️ Видалити_(\d+)$/)
//Видалити_31323123

// bot.command("start", (ctx) => {
//   ctx.reply("Виберіть дію:", Markup.keyboard([
//     ["🗑️ Видалити_12345"], // ID юзера в назві
//     ["📋 Інші опції"]
//   ]).resize());
// });

// bot.hears(/^🗑️ Видалити_(\d+)$/, async (ctx) => {
//   const userId = ctx.match[1]; // Витягуємо ID
//   await ctx.reply(`Видаляю користувача з ID: ${userId}`);
// });

const stages = new Stage([addUserScene, deleteUserScene]);

export const admin = new Composer();
admin.use(stages.middleware());
// commands
admin.start(async (ctx) => {
  try {
    await ctx.reply(
      `Вітаю!Ви авторизовані як адміністратор telegram_id:${ctx.from.id}.`,
      startKeyboard
    );
  } catch (error) {
    console.log(error);
    await ctx.reply(
      `Наразі бот не доступний, спробуйте пізніше ${EMOJI.FORBIDDEN}.`
    );
  }
});

// scenes
admin.hears(
  KEYBOARD_ID.MAIN.ADD_USER,
  async (ctx) => await ctx.scene.enter(KEYBOARD_ID.MAIN.ADD_USER)
);

// actions
// add user keyboard
admin.action(
  `${KEYBOARD_ID.INLINE.ADD_USER}@${KEYBOARD_ACTION.INLINE.SUBMIT}`,
  submitAddUser
);

admin.action(
  `${KEYBOARD_ID.INLINE.ADD_USER}@${KEYBOARD_ACTION.INLINE.CANCEL}`,
  cancelAddUser
);
// delete user keyboard
admin.hears(
  `${KEYBOARD_ID.MAIN.DELETE_USER}`,
  async (ctx) => await ctx.scene.enter(KEYBOARD_ID.MAIN.DELETE_USER)
);
admin.action(
  `${KEYBOARD_ID.INLINE.DELETE_USER}@${KEYBOARD_ACTION.INLINE.SUBMIT}`,
  submitDeleteUser
);

admin.action(
  `${KEYBOARD_ID.INLINE.DELETE_USER}@${KEYBOARD_ACTION.INLINE.CANCEL}`,
  cancelDeleteUser
);
// users list keyboard
admin.hears(`${KEYBOARD_ID.MAIN.USERS_LIST}`, showUsersList);
admin.action(
  `${KEYBOARD_ID.INLINE.USERS_NAVIGATION}@${KEYBOARD_ACTION.INLINE.NEXT}`,
  nextPageUsersList
);
admin.action(
  `${KEYBOARD_ID.INLINE.USERS_NAVIGATION}@${KEYBOARD_ACTION.INLINE.PREV}`,
  prevPageUsersList
);
admin.action(
  `${KEYBOARD_ID.INLINE.USERS_NAVIGATION}@${KEYBOARD_ACTION.INLINE.CLOSE}`,
  closeUsersList
);
// users list with ping
admin.hears(`${KEYBOARD_ID.MAIN.USERS_LIST_WITH_PING}`, showUsersListWithPing);
admin.action(
  `${KEYBOARD_ID.INLINE.USERS_NAVIGATION_WITH_PING}@${KEYBOARD_ACTION.INLINE.NEXT}`,
  nextPageUsersListWithPing
);
admin.action(
  `${KEYBOARD_ID.INLINE.USERS_NAVIGATION_WITH_PING}@${KEYBOARD_ACTION.INLINE.PREV}`,
  prevPageUsersListWithPing
);
admin.action(
  `${KEYBOARD_ID.INLINE.USERS_NAVIGATION_WITH_PING}@${KEYBOARD_ACTION.INLINE.CLOSE}`,
  closeUsersListWithPing
);
