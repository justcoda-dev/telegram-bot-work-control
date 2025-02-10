import { Admin } from "./admin/Admin.model.js";
import { User } from "./user/User.model.js";
import { WorkingDay } from "./working_day/WorkingDay.model.js";
import { WorkingDayPause } from "./workingDayPause/WorkingDayPause.model.js";

Admin.hasMany(User, {
  foreignKey: "admin_id",
});

User.hasMany(WorkingDay, {
  foreignKey: "user_id",
});

WorkingDay.hasMany(WorkingDayPause, {
  foreignKey: "working_day_id",
});

await Admin.sync();
await User.sync();
await WorkingDay.sync();
await WorkingDayPause.sync();

export { Admin, User, WorkingDay, WorkingDayPause };
