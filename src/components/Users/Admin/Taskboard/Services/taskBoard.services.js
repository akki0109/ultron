import { APIURL } from "../../../../../constants/config";
import axios from "axios";
import { authHeader } from "../../../../../helpers";

export const getProjectName = (data)=>{
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  return fetch(APIURL + "projects/editProject", requestOptions)
    .then(handleResponse)
    .then((UserListForReporting) => {
      return UserListForReporting;
    }).catch(error=>error);
};
export const changeTaskSprint= (data) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  return fetch(APIURL + "sprint/sprintSwitch", requestOptions)
    .then(handleResponse)
    .then((UserListForReporting) => {
      return UserListForReporting;
    });
};
export const getSingleModuleData= (data) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  return fetch(APIURL + "taskModules/editTaskModule", requestOptions)
    .then(handleResponse)
    .then((UserListForReporting) => {
      return UserListForReporting;
    });
};
export const updateModule = (data) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  return fetch(APIURL + "taskModules/updateTaskModule", requestOptions)
    .then(handleResponse)
    .then((UserListForReporting) => {
      return UserListForReporting;
    }).catch(error=>error);
};
export const deleteModule = (_id) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      _id,
    }),
  };
  return fetch(APIURL + "taskModules/deleteTaskModule", requestOptions)
    .then(handleResponse)
    .then((UserListForReporting) => {
      return UserListForReporting;
    });
};
export const updateTask = (data, taskModuleId) => {
  // console.log(data,"<==servicedata");
  const formatData = {
    ...data,
    userId: data?.userId.map((i) => i.value),
    taskModuleId,
  };
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formatData),
  };
  return fetch(APIURL + "tasks/updateTask ", requestOptions)
    .then(handleResponse)
    .then((UserListForReporting) => {
      return UserListForReporting;
    }).catch(error => error);
};
export const getTaskData = (data) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  return fetch(APIURL + "tasks/editTask", requestOptions)
    .then(handleResponse)
    .then((UserListForReporting) => {
      return UserListForReporting;
    });
};
export const getCommit = (data) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  return fetch(APIURL + "tasks/getTaskComments", requestOptions)
    .then(handleResponse)
    .then((UserListForReporting) => {
      return UserListForReporting;
    });
};
export const getBacklogs = (data) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  return fetch(APIURL + "tasks/getTaskLogs", requestOptions)
    .then(handleResponse)
    .then((UserListForReporting) => {
      return UserListForReporting;
    });
};

export const TaskFileUpload=(filedata)=>{
  return axios
  .post(APIURL + "tasks/saveTaskAttachment",filedata)
  .then((result)=>result);

};
export const TaskFileGet=(data)=>{
  return axios
  .post(APIURL + "tasks/getTaskAttachments",data)
  .then((result)=>result);

};

export const postCommit = (data) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  return fetch(APIURL + "tasks/saveTaskComment ", requestOptions)
    .then(handleResponse)
    .then((UserListForReporting) => {
      return UserListForReporting;
    });
};

export const getModuleList = (data) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  return fetch(APIURL + "taskModules/getTaskModules", requestOptions)
    .then(handleResponse)
    .then((UserListForReporting) => {
      return UserListForReporting;
    });
};
export function getUserListForReporting(search = { search: "" }) {
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(search),
  };
  return fetch(APIURL + "users/getUserListForReporting", requestOptions)
    .then(handleResponse)
    .then((UserListForReporting) => {
      return UserListForReporting;
    });
}

export const sprintBoardTask = (ProjectId) => {
  return axios
    .post(APIURL + "sprint/getSprints", ProjectId)
    .then((response) => response)
    .catch((error) => error);
};

export const getTaskApiCall = (data) => {
  return axios
    .post(APIURL + "tasks/getAllTasks", data)
    .then((response) => response)
    .catch((error) => error);
};

export const saveModule = (data) => {
  return axios
    .post(APIURL + "taskModules/saveTaskModule", data)
    .then((response) => response)
    .catch((error) => error);
};
export const saveBoardTask = (task) => {
  return axios
    .post(APIURL + "tasks/saveTask", task)
    .then((response) => response)
    .catch((error) => error);
};

export const saveBoardTaskDrag = (draggedTask, id, status,updatedBy) => {
  
  const data = {
    // title: draggedTask.title,
    // task_description: draggedTask.task,
    // userId: draggedTask.userId,
    taskId: draggedTask.taskID,
    updatedBy,
    // projectId: id,
    // estimatedHours: draggedTask.estimatedHours,
    // hoursLeft: draggedTask.hoursLeft,
    // sprintId: draggedTask.sprintId,
    // createdBy: draggedTask.createdBy._id,
    // taskModuleId: draggedTask.moduleId,
    // priority: draggedTask.priority,
    status,
  };
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  return fetch(APIURL + "tasks/updateTaskStatus", requestOptions)
    .then(handleResponse)
    .then((UserListForReporting) => {
      return UserListForReporting;
    });
};
export const deleteTaskApiCall = (id) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      _id: id,
    }),
  };
  return fetch(APIURL + "tasks/deleteTask", requestOptions)
    .then(handleResponse)
    .then((result) => {
      return result;
    });
};

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 400) {
        const error = (data && data.data.errors) || response.statusText;
        return Promise.reject(error);
      }
    }

    return data;
  });
}
