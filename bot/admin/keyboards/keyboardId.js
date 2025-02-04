import { EMOJI } from "../../static/emoji.js";

export const KEYBOARD_ID = {
  MAIN: {
    USERS_LIST: `${EMOJI.MENU} Список користувачів`,
    ADD_USER: `${EMOJI.USER} Додати користувача`,
    DELETE_USER: `${EMOJI.DELETE} Видалити користувача`,
    USERS_LIST_WITH_PING: `${EMOJI.MENU} Список користувачів з перевіркою`,
  },
  INLINE: {
    ADD_USER: "ADD_USER",
    DELETE_USER: "DELETE_USER",
    USERS_NAVIGATION: "USERS_NAVIGATION",
    USERS_NAVIGATION_WITH_PING: "USERS_NAVIGATION_WITH_PING",
  },
};

export const KEYBOARD_ACTION = {
  INLINE: {
    SUBMIT: "SUBMIT",
    CANCEL: "CANCEL",
    NEXT: "NEXT",
    PREV: "PREV",
    CLOSE: "CLOSE",
    DELETE: "DELETE",
    PING: "PING",
  },
};
