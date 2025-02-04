import { User } from "./../relations.js";
export const userController = () => {};
userController.getUsers = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    console.error(error);
  }
};
userController.getAndCountUsers = async (offset, limit) => {
  try {
    const users = await User.findAndCountAll({ limit, offset });
    return users;
  } catch (error) {
    console.error(error);
  }
};
userController.getUser = async (searchParam) => {
  try {
    const user = await User.findOne({ where: searchParam });
    return user;
  } catch (error) {
    console.error(error);
  }
};
userController.findOrCreate = async (userData, searchParam) => {
  try {
    const user = await User.findOrCreate({
      where: searchParam,
      defaults: userData,
    });
    return user;
  } catch (error) {
    console.error(error);
  }
};
userController.createUser = async (userData) => {
  try {
    const user = await User.create(userData);
    return user;
  } catch (error) {
    console.error(error);
  }
};
userController.updateUser = async (userData, searchParam) => {
  try {
    const user = await User.update(userData, { where: searchParam });
    return user;
  } catch (error) {
    console.error(error);
  }
};
userController.deleteUser = async (searchParam) => {
  try {
    const user = await User.destroy({ where: searchParam });
    return user;
  } catch (error) {
    console.error(error);
  }
};
