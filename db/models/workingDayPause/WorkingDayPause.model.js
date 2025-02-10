import { db } from "../../index.js";
import { DataTypes } from "@sequelize/core";

export const WorkingDayPause = db.define(
  "WorkingDayPause",
  {
    pause_start: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    pause_end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    work_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {}
);
