import { EMOJI } from "./emoji";

export const MESSAGE = {
  ADMIN: {
    MENU: {
      SUBMIT: `${EMOJI.STATUS_TRUE} Підтвердити`,
      CANCEL: `${EMOJI.STATUS_FALSE} Скасувати`,
      CLOSE: `${EMOJI.FORBIDDEN} Закрити`,
    },
    ERROR: {
      NO_ACCESS: `Нажаль у вас немає доступу до користування цим ботом ${EMOJI.FORBIDDEN}.`,
    },
  },
  USER: {
    MENU: {
      SUBMIT: `${EMOJI.STATUS_TRUE} Підтвердити`,
      CANCEL: `${EMOJI.STATUS_FALSE} Скасувати`,
      CLOSE: `${EMOJI.FORBIDDEN} Закрити`,
    },
    ERROR: {
      ERROR: {
        NO_ACCESS: `Нажаль у вас немає доступу до користування цим ботом ${EMOJI.FORBIDDEN}.`,
      },
    },
  },
};
