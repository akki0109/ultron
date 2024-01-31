import { authHeader, check419 } from "../../helpers";
import { APIURL } from "../../constants/config";


export function getUserListForReporting(search={search:""}) {
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

  export function graphDataApiCall(search={search:""}) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(search),
    };
    return fetch(APIURL + "tasks/getTimesheet", requestOptions)
      .then(handleResponse)
      .then((UserListForReporting) => {
        return UserListForReporting;
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
          //alert("419 admin/report.services");
          check419();
        }
  
        // const error = (data && data.message) || response.statusText;
        // return Promise.reject(error);
      }
  
      return data;
    });
  }
  