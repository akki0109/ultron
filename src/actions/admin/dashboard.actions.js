import { adminDashboardConstants } from "../../constants";
import { adminDashboardService } from "../../services";
import { authHeader, check419 } from "../../helpers";
import { APIURL } from "../../constants/config";
export const adminDashboardActions = {
  getOnLeaveList,
  getWorkAnniversaryList,
  getBirthdayList,
  currentTerminateList,
  probationList,
};
function getOnLeaveList(search) {
  return (dispatch) => {
    dispatch(request());
    adminDashboardService.getOnLeaveList(search).then(
      (onLeaveList) => dispatch(success(onLeaveList)),
      (error) => dispatch(failure(error))
    );
  };

  function request() {
    return { type: adminDashboardConstants.GETONLEAVELIST_REQUEST };
  }
  function success(onLeaveList) {
    return {
      type: adminDashboardConstants.GETONLEAVELIST_SUCCESS,
      onLeaveList,
    };
  }
  function failure(error) {
    return { type: adminDashboardConstants.GETONLEAVELIST_FAILURE, error };
  }
}
function getWorkAnniversaryList(date) {
  return (dispatch) => {
    dispatch(request());
    adminDashboardService.getWorkAnniversaryList(date).then(
      (anniversaryList) => dispatch(success(anniversaryList)),
      (error) => dispatch(failure(error))
    );
  };

  function request() {
    return { type: adminDashboardConstants.GETANNIVERSARYLIST_REQUEST };
  }
  function success(anniversaryList) {
    return {
      type: adminDashboardConstants.GETANNIVERSARYLIST_SUCCESS,
      anniversaryList,
    };
  }
  function failure(error) {
    return { type: adminDashboardConstants.GETANNIVERSARYLIST_FAILURE, error };
  }
}
function getBirthdayList(date) {
  return (dispatch) => {
    dispatch(request());
    adminDashboardService.getBirthdayList(date).then(
      (birthDayList) => dispatch(success(birthDayList)),
      (error) => dispatch(failure(error))
    );
  };

  function request() {
    return { type: adminDashboardConstants.GETBIRTHDAYLIST_REQUEST };
  }
  function success(birthDayList) {
    return {
      type: adminDashboardConstants.GETBIRTHDAYLIST_SUCCESS,
      birthDayList,
    };
  }
  function failure(error) {
    return { type: adminDashboardConstants.GETBIRTHDAYLIST_FAILURE, error };
  }
}
function currentTerminateList(date) {
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(date),
  };

  return fetch(APIURL + "users/terminationList", requestOptions)
    .then(handleResponse)
    .then((msg) => {
      return msg;
    });
}
function probationList(date) {
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(date),
  };

  return fetch(APIURL + "users/probationExpiryList", requestOptions)
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
      } else if (response.status === 419) {
        //alert("419 admin/dashboard.services");
        check419();
      }

      // const error = (data && data.message) || response.statusText;
      // return Promise.reject(error);
    }

    return data;
  });
}
