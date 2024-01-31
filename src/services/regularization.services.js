import { authHeader, check419 } from "../helpers";
import { APIURL } from "../constants/config";
import axios from "axios";

export const regularizationService = {
    getRegularizationList,
    clockInOut,
    checkClock,
    getByDate,
    getPendingRequests,
    updateRequestStatus,
    getAttendanceDetail,
    getPendingRegularizationCount
};

function getRegularizationList(search) {
    
    const requestOptions = {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(search)
    };

    return fetch(APIURL+"attendance/getAttendanceList", requestOptions)
        .then(handleResponse => handleResponse)
        .then(msg => {
            return msg;
        });
}

function clockInOut(resetPassword) {
    const requestOptions = {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(resetPassword)
    };

    return fetch(APIURL+"attendance/userClockInAndOut", requestOptions)
        .then(handleResponse)
        .then(msg => {
            return msg;
        });
}

function checkClock(resetPassword) {
    const requestOptions = {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(resetPassword)
    };

    return fetch(APIURL+"attendance/checkUserClockIn", requestOptions)
        .then(handleResponse)
        .then(msg => {
            return msg;
        });
}

function getByDate(resetPassword) {
    const requestOptions = {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(resetPassword)
    };

    return fetch(APIURL+"users/changePassword", requestOptions)
        .then(handleResponse)
        .then(msg => {
            return msg;
        });
}
function getPendingRequests(search) {
    const requestOptions = {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(search)
    };

    return fetch(APIURL+"attendance/getPendingRequests", requestOptions)
        .then(handleResponse)
        .then(msg => {
            return msg;
        });
}


function updateRequestStatus(id) {
    const requestOptions = {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(id)
    };

    return fetch(APIURL+"attendance/updateRequestStatus", requestOptions)
        .then(handleResponse)
        .then(msg => {
            return msg;
        });
}
function getAttendanceDetail(id) {
    const requestOptions = {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(id)
    };

    return fetch(APIURL+"attendance/getAttendanceDetail", requestOptions)
        .then(handleResponse)
        .then(msg => {
            return msg;
        });
}

function getPendingRegularizationCount(id) {
    const requestOptions = {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(id)
    };

    return fetch(APIURL+"attendance/getRegularizeRequestCount", requestOptions)
        .then(handleResponse)
        .then(msg => {
            return msg;
        });
}


function handleResponse(response) {
    return response.text().then(text => {
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
                //alert("419 regularization.services");
                check419();
            }

            // const error = (data && data.message) || response.statusText;
            // return Promise.reject(error);
        }

        return data;
    });
}

export const getEmployeTimeTabel = async (data) => {
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
  
  export const updateEmployeTimeTabel = async (data) => {
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
  