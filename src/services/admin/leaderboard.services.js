import { authHeader, check419 } from "../../helpers";
import { APIURL } from "../../constants/config";

export const adminLeaderBoardService = {
  getLeaderBoardList,
  getDepartmentList,
  getTopCaption
};

function getLeaderBoardList(data) {
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(data)
  };

  return fetch(
    APIURL + "admin/leader-board/getLeaderBoardForAdmin",
    requestOptions
  )
    .then(handleResponse)
    .then((msg) => {
      return msg;
    })
    .catch((err) => err);
}

function getDepartmentList(search) {
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(search),
  };

  return fetch(APIURL + "departments/getDepartments", requestOptions)
    .then(handleResponse)
    .then((departmentList) => {
      return departmentList;
    })
    .catch((error) => error);
}
 function getTopCaption(search)
 {
   const requestOptions = {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(search),
  };

  return fetch(APIURL + "admin/leader-board/getLeaderBoardListOfProjectCaptainForAdmin", requestOptions)
    .then(handleResponse)
    .then((departmentList) => {
      return departmentList;
    })
    .catch((error) => error);
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
      } else if (response.status === 419) {
        //alert("419 admin/attendance.services");
        check419();
      }

      // const error = (data && data.message) || response.statusText;
      // return Promise.reject(error);
    }

    return data;
  });
}
