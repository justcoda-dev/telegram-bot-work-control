import { db } from "../../index.js";
import { DataTypes } from "@sequelize/core";

export const Admin = db.define(
  "Admin",
  {
    telegram_id: {
      type: DataTypes.BIGINT,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {}
);
