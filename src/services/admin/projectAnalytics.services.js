import { authHeader, check419 } from "../../helpers";
import { APIURL } from "../../constants/config";
import axios from "axios";

export const getProject = (user) => {
  let header = {
    "Content-Type": "application/json",
    Authorization: "",
  };
  return axios
    .post(
      APIURL + "projects/getAllProjects",
      { search: "", assigned_to: user.data._id },
      { headers: header }
    )
    .then((response) => response)
    .catch((error) => error);
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

export function graphDataApiCall(search) {
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader(),"Content-Type": "application/json" },
    body: JSON.stringify(search),
  };
  return fetch(APIURL + "projects/projectsheet", requestOptions)
    .then(handleResponse)
    .then((UserListForReporting) => {
      return UserListForReporting;
    });
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 400) {
        const error = (data && data.data.errors) || response.statusText;
        return Promise.reject(error);
      }
      else if(response.status === 419)
      {
          //alert("419 admin/projectAnalytics.services");
          check419();
      }
    }

    return data;
  });
}
