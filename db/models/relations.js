import { Admin } from "./admin/Admin.model.js";
import { User } from "./user/User.model.js";
import { WorkingDay } from "./working_day/WorkingDay.model.js";

Admin.hasMany(User, {
  foreignKey: "admin_id",
});
User.hasMany(WorkingDay, {
  foreignKey: "user_id",
});

await Admin.sync();
await User.sync();
await WorkingDay.sync();
// await Admin.create({
//   telegram_id: 420400425,
// });
export { Admin, User, WorkingDay };
