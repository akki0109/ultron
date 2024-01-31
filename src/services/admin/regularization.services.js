import { authHeader, check419 } from "../../helpers";
import { APIURL } from "../../constants/config";
import axios from "axios";

export const adminRegularizationService = {
  getPendingRequests,
  updateRequestStatus,
  getAttendanceDetail,
};

function getPendingRequests(search) {
  console.log("searvices", search);
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(search),
  };

  return fetch(APIURL + "attendance/getPendingRequests", requestOptions)
    .then(handleResponse)
    .then((msg) => {
      return msg;
    });
}

function updateRequestStatus(id) {
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(id),
  };

  return fetch(APIURL + "attendance/updateRequestStatus", requestOptions)
    .then(handleResponse)
    .then((msg) => {
      return msg;
    });
}
function getAttendanceDetail(id) {
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(id),
  };

  return fetch(APIURL + "attendance/getAttendanceDetail", requestOptions)
    .then(handleResponse)
    .then((msg) => {
      return msg;
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
      else if(response.status === 419)
      {
          //alert("419 admin/regularization.services");
          check419();
      }

      // const error = (data && data.message) || response.statusText;
      // return Promise.reject(error);
    }

    return data;
  });
}

export const getTimeTabel = async (data) => {
  try {
    const response = await axios.post(
      APIURL + "attendance/getAttendanceRegularizationByUserId",
      data
    );
    const result = await response.data;
    if (result) {
      return result;
    }
  } catch (error) {
    if (error?.response?.data) return error?.response?.data;
  }
};

export const updateTimeTabel = async (data) => {
console.log(888,data);
  try {
    const response = await axios.post(
      APIURL + "attendance/updateAttendanceRagularize",
      data
    );
    const result = await response.data;
    if (result) {
      return result;
    }
  } catch (error) {
    console.log("error",error);
    if (error?.response?.data) return error?.response?.data;
  }
};
