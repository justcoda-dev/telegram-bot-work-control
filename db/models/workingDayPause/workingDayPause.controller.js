import { WorkingDayPause } from "../relations.js";

export const workingDayPauseController = () => {};
workingDayPauseController.getWorkingDayPauses = async (searchParam) => {
  try {
    const workingDayPauses = await WorkingDayPause.findAll({
      where: searchParam,
    });
    return workingDayPauses;
  } catch (error) {
    console.error(error);
  }
};

workingDayPauseController.getWorkingDayPause = async (searchParam) => {
  try {
    const workingDayPause = await WorkingDayPause.findOne({
      where: searchParam,
    });
    return workingDayPause;
  } catch (error) {
    console.error(error);
  }
};
workingDayPauseController.createWorkingDayPause = async (
  workingDayPauseData
) => {
  try {
    const workingDayPause = await WorkingDayPause.create(workingDayPauseData);
    return workingDayPause;
  } catch (error) {
    console.error(error);
  }
};
workingDayPauseController.updateWorkingDayPause = async (
  workingDayPauseData,
  searchParam
) => {
  try {
    const workingDayPause = await WorkingDayPause.update(workingDayPauseData, {
      where: searchParam,
    });
    return workingDayPause;
  } catch (error) {
    console.error(error);
  }
};
workingDayPauseController.deleteWorkingDayPause = async (searchParam) => {
  try {
    const workingDayPause = await WorkingDayPause.destroy({
      where: searchParam,
    });
    return workingDayPause;
  } catch (error) {
    console.error(error);
  }
};
