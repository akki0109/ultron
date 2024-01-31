import { authHeader, check419 } from "../../helpers";
import { APIURL } from "../../constants/config";

export function deleteItemPost(data){
    const requestOptions = {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(data)
    };

    return fetch(APIURL + "tickets/updateTicketStatus", requestOptions).then(handleResponse)
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

export function getAllTickets(payload){
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    };

    return fetch(APIURL + "tickets/getTickets", requestOptions).then(handleResponse)
        .then(ticketList => {
            return ticketList;
        });
}

export function ticketSaveRequest(payload){
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    };

    return fetch(APIURL + "tickets/saveTicket", requestOptions).then(handleResponse)
        .then(response => {
            return response;
        });
}

export function ticketUpdateRequest(payload){
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    };

    return fetch(APIURL + "tickets/updateTicket", requestOptions).then(handleResponse)
        .then(response => {
            return response;
        });
}

export function ticketEditRequest(payload){
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    };

    return fetch(APIURL + "tickets/editTicket", requestOptions).then(handleResponse)
        .then(response => {
            return response;
        });
}

export function ticketDeleteRequest(payload){
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    };

    return fetch(APIURL + "tickets/deleteTicket", requestOptions).then(handleResponse)
        .then(response => {
            return response;
        });
}

export function commentSaveRequest(payload){
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    };

    return fetch(APIURL + "tickets/saveTicketComment", requestOptions).then(handleResponse)
        .then(response => {
            return response;
        });
}

export function getAllComments(payload){
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    };

    return fetch(APIURL + "tickets/getTicketComments", requestOptions).then(handleResponse)
        .then(response => {
            return response;
        });
}

export function commmentDeleteRequest(payload){
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    };

    return fetch(APIURL + "tickets/deleteTicketComment", requestOptions).then(handleResponse)
        .then(response => {
            return response;
        });
}

export function commentUpdateRequest(payload){
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    };

    return fetch(APIURL + "tickets/editTicketComment", requestOptions).then(handleResponse)
        .then(response => {
            return response;
        });
}

export function ticketCountRequest(payload){
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    };

    return fetch(APIURL + "tickets/notificationCount ", requestOptions).then(handleResponse)
        .then(response => {
            return response;
        });
}

export function openTicketCountRequest(payload){
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    };

    return fetch(APIURL + "tickets/openTicketCount ", requestOptions).then(handleResponse)
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
                //alert("419 admin/projectAnalytics.services");
                check419();
            }
        }
        return data;
    });
}