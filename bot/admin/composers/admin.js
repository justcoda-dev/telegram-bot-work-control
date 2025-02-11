import { Composer } from "telegraf";
import { startKeyBoard } from "../keyboards/keyboard/startKeyBoard.js";
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
  nextPageUsersList,
  prevPageUsersList,
  showUsersList,
} from "../handlers/usersListHandlers.js";
import { deleteUserScene } from "../scenes/deleteUserScene.js";
import {
  nextPageUsersListWithPing,
  pingAllUsers,
  pingAllUsersToDrinkWater,
  pingUser,
  prevPageUsersListWithPing,
  showUsersListWithPing,
} from "../handlers/usersListWithPingHandlers.js";

const stages = new Stage([addUserScene, deleteUserScene]);
export const admin = new Composer();
admin.use(stages.middleware());
// commands
admin.start(async (ctx) => {
  try {
    await ctx.reply(
      `Вітаю!Ви авторизовані як адміністратор telegram_id:${ctx.from.id}.`,
      startKeyBoard
    );
  } catch (error) {
    console.error(error);
    await ctx.reply(
      `Наразі бот не доступний, спробуйте пізніше ${EMOJI.FORBIDDEN}.`
    );
  }
});

// add user
admin.hears(
  KEYBOARD_ID.MAIN.ADD_USER,
  async (ctx) => await ctx.scene.enter(KEYBOARD_ID.MAIN.ADD_USER)
);

admin.action(
  `${KEYBOARD_ID.INLINE.ADD_USER}@${KEYBOARD_ACTION.INLINE.SUBMIT}`,
  submitAddUser
);

admin.action(
  `${KEYBOARD_ID.INLINE.ADD_USER}@${KEYBOARD_ACTION.INLINE.CANCEL}`,
  cancelAddUser
);
admin.action(`${KEYBOARD_ID.INLINE.ADD_USER}@${KEYBOARD_ACTION.INLINE.PREV}`);
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
  `${KEYBOARD_ID.INLINE.USERS_NAVIGATION_WITH_PING}@${KEYBOARD_ACTION.INLINE.PING_ALL}`,
  pingAllUsers
);
admin.action(
  `${KEYBOARD_ID.INLINE.USERS_NAVIGATION_WITH_PING}@${KEYBOARD_ACTION.INLINE.DRINK_WATER}`,
  pingAllUsersToDrinkWater
);

admin.action(RegExp(`^${KEYBOARD_ACTION.INLINE.PING}@(\\d+)$`), pingUser);
