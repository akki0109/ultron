
import { authHeader, check419 } from "../../helpers";
import { APIURL } from "../../constants/config";

export const adminDashboardService = {
    getOnLeaveList,
    getWorkAnniversaryList,
    getBirthdayList
   
};

function getOnLeaveList(search) {
    const requestOptions = {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(search)
    };

    return fetch(APIURL+"leaves/getOnLeaveList", requestOptions)
        .then(handleResponse)
        .then(msg => {
            return msg;
        });
}
function getWorkAnniversaryList(date) {
    const requestOptions = {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(date)
    };

    return fetch(APIURL+"users/getWorkAnniversaryList", requestOptions)
        .then(handleResponse)
        .then(msg => {
            return msg;
        });
}
function getBirthdayList(date) {
    const requestOptions = {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(date)
    };

    return fetch(APIURL+"users/getBirthdayList", requestOptions)
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
                const error = (data && data.data.errors) || response.statusText ;
                return Promise.reject(error);
            }
            else if(response.status === 419)
            {
                //alert("419 admin/dashboard.services");
                check419();
            }

            // const error = (data && data.message) || response.statusText;
            // return Promise.reject(error);
        }

        return data;
    });
}