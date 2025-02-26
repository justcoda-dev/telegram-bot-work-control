import { userController } from "../../../db/models/user/user.controller.js";
import { workingDayController } from "../../../db/models/working_day/workingDay.controller.js";
import { workingDayPauseController } from "../../../db/models/workingDayPause/workingDayPause.controller.js";
import { workStartedKeyBoard } from "../keyboards/keyboard/workStartedKeyBoard.js";
import { workPausedKeyBoard } from "../keyboards/keyboard/workPausedKeyBoard.js";
import { startKeyBoard } from "../keyboards/keyboard/startKeyBoard.js";
import { updateOrCreateSpreadsheetWidthFolder } from "../../google/index.js";
import { EMOJI } from "../../static/emoji.js";
import { configDotenv } from "dotenv";
configDotenv();

const startWork = async (ctx) => {
  try {
    await ctx.deleteMessage();
    const startWorkDate = new Date();
    const filterDate = `${startWorkDate.getDate()}.${
      startWorkDate.getMonth() + 1
    }.${startWorkDate.getFullYear()}`;
    const user = await userController.getUser({ telegram_id: ctx.from.id });
    const [workingDay, created] =
      await workingDayController.findOrCreateWorkingDay(
        {
          filter_date: filterDate,
          user_id: user.dataValues.id,
        },
        {
          filter_date: filterDate,
          user_id: user.dataValues.id,
          work_start: startWorkDate,
        }
      );

    if (!created) {
      workingDay.work_start = startWorkDate;
      await workingDay.save();

      await workingDayPauseController.deleteWorkingDayPause({
        working_day_id: workingDay.dataValues.id,
      });
    }
    await ctx.reply(
      `Ви почали працювати о ${startWorkDate} ${EMOJI.ROCKET}`,
      workStartedKeyBoard
    );
  } catch (error) {
    console.error(error);
  }
};
const endWork = async (ctx) => {
  try {
    await ctx.deleteMessage();

    const kyivTimeISO = (date) =>
      date
        ? new Date(date)
            .toLocaleString("sv-SE", { timeZone: "Europe/Kyiv" })
            .replace(" ", "T")
        : null;

    const endWork = new Date();

    const user = await userController.getUser({ telegram_id: ctx.from.id });
    const sheetName = `${endWork.getDate()}.${
      endWork.getMonth() + 1
    }.${endWork.getFullYear()}`;

    const filterDate = sheetName;

    const workingDay = await workingDayController.getWorkingDay({
      user_id: user.dataValues.id,
      filter_date: filterDate,
    });

    if (!workingDay) {
      await ctx.reply("Помилка: Робочий день не знайдено.");
      return;
    }
    workingDay.work_end = endWork;
    await workingDay.save();

    const users = await userController.getUsers();
    const workingDays = await workingDayController.getWorkingDays({
      filter_date: filterDate,
    });
    const workingDaysPauses = await Promise.all(
      workingDays.map(async (workingDay) => {
        const pauses = await workingDayPauseController.getWorkingDayPauses({
          working_day_id: workingDay.dataValues.id,
        });
        return { userId: workingDay.user_id, pauses };
      })
    );

    const sheetUsersValues = users
      .map((user) => {
        const userWorkingDay = workingDays.find((wd) => {
          return wd.user_id === user.id;
        });

        const userPauses =
          workingDaysPauses.find((wp) => wp.userId === user.id)?.pauses || [];

        const startWorkTime = kyivTimeISO(
          userWorkingDay?.dataValues?.work_start
        );

        const endWorkTime = kyivTimeISO(userWorkingDay?.dataValues?.work_end);

        const totalPauseMs = userPauses.reduce((total, pause) => {
          const startPause = new Date(pause.dataValues.pause_start).getTime();
          const endPause = new Date(pause.dataValues.pause_end).getTime();
          return total + (endPause - startPause);
        }, 0);

        const diffMs =
          new Date(userWorkingDay?.dataValues?.work_end).getTime() -
          (new Date(userWorkingDay?.dataValues?.work_start).getTime() +
            totalPauseMs);
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60)) || 0;
        const diffMins =
          Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)) || 0;
        const diffSec = Math.floor((diffMs % (1000 * 60)) / 1000) || 0;
        const formattedTime = `${diffHours ? diffHours + " год., " : ""}${
          diffMins ? diffMins + " хв., " : ""
        }${diffSec} сек.`;

        const userRow = [
          user.dataValues.name,
          user.dataValues.telegram_id,
          startWorkTime || null,
          endWorkTime || null,
          kyivTimeISO(userPauses[0]?.dataValues?.pause_start),
          kyivTimeISO(userPauses[0]?.dataValues?.pause_end),
          formattedTime,
        ];

        const pausesRows = userPauses.map((pause) => [
          null,
          null,
          null,
          null,
          kyivTimeISO(pause.dataValues.pause_start),
          kyivTimeISO(pause.dataValues.pause_end),
          null,
        ]);
        pausesRows.shift();
        return [userRow, ...pausesRows];
      })
      .flat();

    const sheetValues = [
      [
        "Ім'я",
        "telegram_id",
        "Початок",
        "Кінець",
        "Початок паузи",
        "Кінець паузи",
        "Відпрацьовано годин",
      ],
      ...sheetUsersValues,
    ];

    await ctx.reply(`Ви закінчили працювати о ${endWork} ⏳`, startKeyBoard);

    await updateOrCreateSpreadsheetWidthFolder({
      userEmail: process.env.USER_ACCESS_OPEN_GMAIL,
      sheetName,
      values: sheetValues,
      folderName: "Телеграм звіти",
    });
  } catch (error) {
    console.error("Помилка у методі endWork:", error);
    await ctx.reply("Сталася помилка при завершенні роботи.");
  }
};

const pauseWork = async (ctx) => {
  try {
    await ctx.deleteMessage();
    const pauseStartDate = new Date();

    const filterDate = `${pauseStartDate.getDate()}.${
      pauseStartDate.getMonth() + 1
    }.${pauseStartDate.getFullYear()}`;

    const user = await userController.getUser({ telegram_id: ctx.from.id });
    const workingDay = await workingDayController.getWorkingDay({
      user_id: user.dataValues.id,
      filter_date: filterDate,
    });

    if (workingDay) {
      const pause = await workingDayPauseController.createWorkingDayPause({
        pause_start: pauseStartDate,
        working_day_id: workingDay.dataValues.id,
      });

      await ctx.reply(
        `Ви поставили паузу о ${pauseStartDate} ${EMOJI.COFFEE}`,
        workPausedKeyBoard
      );
    } else {
      await ctx.reply(`Ви не почали робочий день`);
    }
  } catch (error) {
    console.error(error);
  }
};

const continueWork = async (ctx) => {
  try {
    await ctx.deleteMessage();
    const pauseEndDate = new Date();
    const filterDate = `${pauseEndDate.getDate()}.${
      pauseEndDate.getMonth() + 1
    }.${pauseEndDate.getFullYear()}`;

    const user = await userController.getUser({ telegram_id: ctx.from.id });
    const workingDay = await workingDayController.getWorkingDay({
      user_id: user.dataValues.id,
      filter_date: filterDate,
    });
    const pause = await workingDayPauseController.getWorkingDayPause({
      working_day_id: workingDay.dataValues.id,
      pause_end: null,
    });

    if (pause) {
      pause.pause_end = pauseEndDate;
      await pause.save();
      await ctx.reply(
        `Ви продовжили працювати о ${pauseEndDate} ${EMOJI.ROCKET}`,
        workStartedKeyBoard
      );
    } else {
      await ctx.reply(`Ви не поставили паузу`);
    }
  } catch (error) {
    console.error(error);
  }
};

export { startWork, endWork, pauseWork, continueWork };
