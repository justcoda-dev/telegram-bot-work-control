import { Admin } from "./../relations.js";
export const adminController = () => {};

adminController.getAdmins = async () => {
  try {
    const admins = await Admin.findAll();
    return admins;
  } catch (error) {
    console.error(error);
    return error;
  }
};
adminController.getAdmin = async (search_params) => {
  try {
    const user = await Admin.findOne({ where: search_params });
    return user;
  } catch (error) {
    console.error(error);
    return error;
  }
};
adminController.createAdmin = async (adminData) => {
  try {
    const admin = await Admin.create(adminData);
    return admin;
  } catch (error) {
    console.error(error);
    return error;
  }
};
adminController.updateAdmin = async (adminData, { where: searchParam }) => {
  try {
    const admins = await Admin.update(adminData, { where: searchParam });
    return admins;
  } catch (error) {
    console.error(error);
    return error;
  }
};
adminController.deleteAdmin = async (searchParam) => {
  try {
    const admin = await Admin.destroy({ where: searchParam });
    return admin;
  } catch (error) {
    console.error(error);
    return error;
  }
};
