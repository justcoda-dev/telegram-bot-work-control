import { db } from "../../index.js";
import { DataTypes } from "@sequelize/core";

export const User = db.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telegram_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    paused: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    is_pinged: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    pinged_admin: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {}
);
