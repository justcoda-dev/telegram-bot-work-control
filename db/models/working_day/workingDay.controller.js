import { WorkingDay } from "./../relations.js";

export const workingDayController = () => {};
workingDayController.getWorkingDays = async () => {
  try {
    const workingDays = await WorkingDay.findAll();
    return workingDays;
  } catch (error) {
    console.error(error);
  }
};

workingDayController.getWorkingDay = async (searchParam) => {
  try {
    const workingDay = await WorkingDay.findOne({ where: searchParam });
    return workingDay;
  } catch (error) {
    console.error(error);
  }
};
workingDayController.createWorkingDay = async (workingDayData) => {
  try {
    const workingDays = await WorkingDay.create(workingDayData);
    return workingDays;
  } catch (error) {
    console.error(error);
  }
};
workingDayController.updateWorkingDay = async (workingDayData, searchParam) => {
  try {
    const workingDay = await WorkingDay.update(workingDayData, {
      where: searchParam,
    });
    return workingDay;
  } catch (error) {
    console.error(error);
  }
};
workingDayController.deleteWorkingDay = async (searchParam) => {
  try {
    const workingDay = await WorkingDay.destroy({ where: searchParam });
    return workingDay;
  } catch (error) {
    console.error(error);
  }
};
