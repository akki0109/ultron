import { authHeader, check419 } from "../helpers";
import { APIURL } from "../constants/config";

export function deleteNotice(data) {
    const requestOptions = {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(data)
    };

    return fetch(APIURL + "notices/deleteNotice", requestOptions).then(handleResponse)
        .then(reportList => {
            return reportList;
        });
}

export function acknowledgementPost(data) {
    const requestOptions = {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(data)
    };

    return fetch(APIURL + "notices/saveNoticeAcknowledgement", requestOptions).then(handleResponse)
        .then(reportList => {
            return reportList;
        });
}

export function getUserListForReporting(search) {
    const requestOptions = {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(search)
    };

    return fetch(APIURL + "users/getUserListForReporting", requestOptions).then(handleResponse)
        .then(reportList => {
            return reportList;
        });
}

export function getAllNotices(payload){
    const requestOptions = {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    };

    return fetch(APIURL + "notices/getNotices", requestOptions).then(handleResponse)
        .then(ticketList => {
            return ticketList;
        });
}

export function noticeSaveRequest(payload){
    const requestOptions = {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    };

    return fetch(APIURL + "notices/saveNotice", requestOptions).then(handleResponse)
        .then(response => {
            return response;
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
                //alert("419 noticeBorad.services");
                check419();
            }
        }
        return data;
    });
}