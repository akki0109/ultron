
import { authHeader } from "../../helpers";
import { APIURL } from "../../constants/config";

export const projectService = {
    getProjectList,
    saveProject,
    editProject,
    updateProject

};

function getProjectList(search) {
    const requestOptions = {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(search)
    };

    return fetch(APIURL + "projects/getProjectList", requestOptions).then(handleResponse)
        .then(projectList => {
            return projectList;
        });
}


function saveProject(data) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    };

    return fetch(APIURL + "projects/saveProject", requestOptions).then(handleResponse);
}
function editProject(id) {
    const requestOptions = {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({id:id})

    };
    return fetch(APIURL+"projects/editProject", requestOptions).then(handleResponse)
        .then(projects => {
            return projects;
        });

}
function updateProject(userInfo) {
    const requestOptions = {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(userInfo)

    };
    return fetch(APIURL + "projects/updateProject", requestOptions).then(handleResponse);
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

            // const error = (data && data.message) || response.statusText;
            // return Promise.reject(error);
        }

        return data;
    });
}