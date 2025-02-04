import { db } from "../../index.js";
import { DataTypes } from "@sequelize/core";

export const WorkingDay = db.define(
  "WorkingDay",
  {
    work_start: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    work_end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    break_start: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    break_end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {}
);
