import { projectConstants } from "../../constants";
import { projectService } from "../../services";

export const projectActions = {
    getProjectList,
    saveProject,
    editProject,
    updateProject,
    emptyError

};
function emptyError(){
  return {type:"EMPTY_ERROR"};

}

function getProjectList(search) {
    return dispatch => {
        dispatch(request(search));
        projectService.getProjectList(search)
            .then(
                projectList => {
                    dispatch(success(projectList));

                },
                error => {
                    dispatch(failure(error));
                }
            );
    };

    function request() { return { type: projectConstants.GETPROJECTLIST_REQUEST }; }
    function success(projectList) { return { type: projectConstants.GETPROJECTLIST_SUCCESS, projectList }; }
    function failure(error) { return { type: projectConstants.GETPROJECTLIST_FAILURE, error }; }
}
function saveProject(data) {
    return dispatch => {
        dispatch(request());
        projectService.saveProject(data)
            .then(
                data => console.log("data", dispatch(success(data))),
                error => dispatch(failure(error))
            );
    };

    function request() { return { type: projectConstants.SAVEPROJECT_REQUEST }; }
    function success(data) { return { type: projectConstants.SAVEPROJECT_SUCCESS, data }; }
    function failure(error) { return { type: projectConstants.SAVEPROJECT_FAILURE, error }; }
}


function editProject(id) {
    return dispatch => {
        dispatch(request(id));

        projectService.editProject(id)
            .then(
                projects => dispatch(success(projects)),
                error => dispatch(failure(error))
            );
    };

    function request(id) { return { type: projectConstants.PROJECTEDIT_REQUEST, id }; }
    function success(projects) { return { type: projectConstants.PROJECTEDIT_SUCCESS, projects }; }
    function failure(error) { return { type: projectConstants.PROJECTEDIT_FAILURE, error }; }
}
function updateProject(userInfo) {
    return dispatch => {
        dispatch(request());
        projectService.updateProject(userInfo)

            .then(
                userInfo => {

                    dispatch(success(userInfo));
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };

    function request() { return { type: projectConstants.PROJECTUPDATE_REQUEST, }; }
    function success(userInfo) { return { type: projectConstants.PROJECTUPDATE_SUCCESS, userInfo }; }
    function failure(error) { return { type: projectConstants.PROJECTUPDATE_FAILURE, error }; }
}
