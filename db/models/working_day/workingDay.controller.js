import { WorkingDay } from "./../relations.js";

export const workingDayController = () => {};
workingDayController.getWorkingDays = async (searchParam) => {
  try {
    const workingDays = await WorkingDay.findAll({ where: searchParam });
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
    const workingDay = await WorkingDay.create(workingDayData);
    return workingDay;
  } catch (error) {
    console.error(error);
  }
};
workingDayController.findOrCreateWorkingDay = async (
  searchParam,
  workingDayData
) => {
  try {
    const workingDay = await WorkingDay.findOrCreate({
      where: searchParam,
      defaults: workingDayData,
    });
    return workingDay;
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
