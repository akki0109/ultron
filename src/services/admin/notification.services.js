import { authHeader } from "../../helpers";
import { APIURL } from "../../constants/config";
export const notificationService = {
  getNotification,
  getNotificationCount,
  updateCountNotification,
};
function updateCountNotification(userId) {
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  };

  return fetch(APIURL + "tasks/updateTaskNotification", requestOptions)
    .then(handleResponse)
    .then((projectList) => {
      return projectList;
    })
    .catch((error) => error);
}
function getNotificationCount(userId) {
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  };

  return fetch(APIURL + "tasks/taskNotificationCount", requestOptions)
    .then(handleResponse)
    .then((projectList) => {
      return projectList;
    })
    .catch((error) => error);
}
function getNotification(userId, page) {
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({ userId, page }),
  };

  return fetch(APIURL + "tasks/taskNotificationList", requestOptions)
    .then(handleResponse)
    .then((projectList) => {
      return projectList;
    });
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    //const data = text;
    if (!response.ok) {
      if (response.status === 400) {
        // auto logout if 401 response returned from api
        // logout();
        // location.reload(true);
        const error = (data && data.data.errors) || response.statusText;
        return Promise.reject(error);
      }

      // const error = (data && data.message) || response.statusText;
      // return Promise.reject(error);
    }

    return data;
  });
}
