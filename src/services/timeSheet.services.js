import axios from "axios";
import { APIURL } from "../constants/config";
export const getProjectList = async (EmployeeId) => {
  try {
    const response = await axios.post(
      APIURL + "projects/getProjectListForDropDown/",
      {
        search: "",
        assigned_to: EmployeeId,
      }
    );
    const result = await response.data;
    if (result) {
      return result;
    }
  } catch (error) {
    console.log("error", error);
    if (error?.response?.data) return error?.response?.data;
  }
};


export const postProjectList = async (List) => {
  try {
    const response = await axios.post(
      APIURL + "tasks/saveProjectTask",
      {
        taskData:List,
      }
    );
    const result = await response.data;
    if (result) {
      return result;
    }
  } catch (error) {
    console.log("error", error);
    if (error?.response?.data) return error?.response?.data;
  }
};