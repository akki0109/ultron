import { projectConstants } from "../../constants";

const initialState =
  { loading: null, projectList: null, projects: null, ScsMsg: null } || {};

export function project(state = initialState, action) {
  switch (action.type) {
    case projectConstants.GETPROJECTLIST_REQUEST:
      return {
        loading: true,
      };
    case projectConstants.GETPROJECTLIST_SUCCESS:
      return {
        loading: false,
        projectList: action.projectList.data,
        activePage: action.projectList.page,
        totalItemsCount: action.projectList.total_count,
        limit: action.projectList.page_count,
      };
    case projectConstants.GETPROJECTLIST_FAILURE:
      return {
        error: action.error,
      };
    case projectConstants.SAVEPROJECT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case projectConstants.SAVEPROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        projectList: state.projectList,
        ScsMsg: action.data,
        refreshList: true,
      };
    case projectConstants.SAVEPROJECT_FAILURE:
      return {
        ...state,
        error: action.error,
        projectList: state.projectList,
      };
    case projectConstants.PROJECTEDIT_REQUEST:
      return {
        ...state,
        loading: true,
        projectList: state.projectList,
        activePage: state.activePage,
        totalItemsCount: state.totalItemsCount,
      };
    case projectConstants.PROJECTEDIT_SUCCESS:
      return {
        ...state,
        loading: false,
        projectList: state.projectList,
        projects: action.projects.data,
        totalItemsCount: state.totalItemsCount,
        activePage: state.activePage,
        editModal: true,
      };
    case projectConstants.PROJECTEDIT_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    case projectConstants.PROJECTUPDATE_REQUEST:
      return {
        ...state,
        loading: true,
        projectList: state.projectList,
      };
    case projectConstants.PROJECTUPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        projectList: state.projectList,
        message: action.userInfo.message,
        refreshList: true,
      };
    case projectConstants.PROJECTUPDATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
        projectList: state.projectList,
        refreshList: false,
      };
    case "EMPTY_ERROR":
      return {
        ...state,

        error: "",
      };
    case "MODEL-CLOSE":
      return {
        ...state,

        editModal: false,
      };

    default:
      return state;
  }
}
