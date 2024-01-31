import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import Footer from "../../../GlobalComponents/Footer";
import { Modal, ModalBody, ModalHeader, ModalFooter, Input } from "reactstrap";
import Navbar from "../Layout/Navbar";
import { projectActions, adminUserActions } from "../../../../actions";
import { Button } from "reactstrap";
import dateFormat from "dateformat";
import axios from "axios";
import { APIURL } from "../../../../constants/config";
import Select from "react-select";
// import { colourStyles } from "../../../../constants/ColorStyle";

// const projectOptions = [
//     { value: "", label: "Select" },
//     { value:this.state.user.data._id, label: "My Project"},
//     { value: null, label: "All Projects"},

// ];
class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem("user")),
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      search: "",
      error: "",
      editModal: false,
      addNewModal: false,
      activePage: 1,
      limit: 10,
      showOptions: false,
      totalItemsCount: 1,
      projectList: [],
      moduleName: [],
      timeSpent: [],
      usersList: [],
      task: [],
      time: [],
      isediting: false,
      projectTypeOption: [
        { value: "Kanban", label: "Kanban" },
        { value: "Regular", label: "Regular" },
      ],
      project_type: { value: "Kanban", label: "Kanban" },
      project_team_lead: { value: "", label: "" },
      id: 0,
      projectAssign: "",
      filterStatus: { value: "", label: "My Project" },
    };
    this.projectOptions = [
      { value: "", label: "All Projects" },
      { value: this.state.user.data._id, label: "My Project" },
    ];

    this.getProjectList = this.getProjectList.bind(this);
    this.addNewModalOpen = this.addNewModalOpen.bind(this);
    this.userChangeHandle = this.userChangeHandle.bind(this);
    this.editModalClose = this.editModalClose.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.projectChangeHandle = this.projectChangeHandle.bind(this);
    this.onChangeProjectBoard = this.onChangeProjectBoard.bind(this);
    this.onChangeOwner = this.onChangeOwner.bind(this);
  }
  getProjectList() {
    this.props.dispatch(
      projectActions.getProjectList({
        search: this.state.search,
        page: this.state.activePage,
        limit: this.state.limit,
        assignedTo: this.state.projectAssign,
      })
    );
  }

  handlePageChange(pageNumber) {
    this.setState(
      {
        activePage: pageNumber,
      },
      () => {
        this.getProjectList();
      }
    );
  }
  handlePageStates(activePage, totalItemsCount, limit) {
    this.setState({
      activePage: activePage,
      totalItemsCount: totalItemsCount,
      limit: limit,
    });
  }

  onChangeName = (value) => {
    this.setState({
      name: value,
    });
  };
  onChangeOwner(value) {
    this.setState({ project_team_lead: value });
  }
  onChangeDescripation = (e) => {
    this.setState({
      description: e,
    });
  };
  onChangeStarDate = (e) => {
    this.setState({
      start_date: e,
    });
  };
  onChangeLastDate = (e) => {
    this.setState({
      end_date: e,
    });
  };

  saveProject = () => {
    var assignUser = [];
    if (this.state.reportUser && this.state.reportUser.length > 0) {
      this.state.reportUser.map((item) => {
        assignUser.push(item.value);
      });
    }

    this.props.dispatch(
      projectActions.saveProject({
        name: this.state.name,
        description: this.state.description,
        start_date: this.state.start_date,
        end_date: this.state.end_date,
        assignedToData: assignUser,
        project_type: this.state.project_type.value,
        project_team_lead: this.state.project_team_lead.value,
      })
    );
  };

  onChangeProjectBoard(value) {
    this.setState({ project_type: value });
  }

  handleUpdate = () => {
    var assignUser = [];
    if (this.state.reportUser && this.state.reportUser.length > 0) {
      this.state.reportUser.map((item) => {
        assignUser.push(item.value);
      });
    }

    this.props.dispatch(
      projectActions.updateProject({
        id: this.state.id,
        name: this.state.name,
        description: this.state.description,
        start_date: this.state.start_date,
        end_date: this.state.end_date,
        assignedToData: assignUser,
        project_type: this.state.project_type.value,
        project_team_lead: this.state.project_team_lead?.value,
      })
    );
  };
  addNewModalOpen() {
    this.setState({
      addNewModal: true,
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      reportUser: [],
      project_type: { value: "Kanban", label: "Kanban" },
      project_team_lead: { value: "", label: "" },
    });
  }

  addNewModalClose() {
    this.setState({
      addNewModal: false,
    });
    this.props.dispatch(projectActions.emptyError());
  }

  AssignUserList() {
    this.props.dispatch(
      adminUserActions.getUserListForReporting({ search: this.state.search })
    );
  }
  setReportingList(item) {
    let reportList = [];

    for (var c = 0; c < item.length; c++) {
      reportList.push({
        value: item[c]._id,
        label: item[c].first_name + " " + item[c].last_name,
      });
    }
    this.setState({
      ReportingList: reportList,
    });
  }

  handleSearch(e) {
    this.setState(
      {
        activePage: 1,
        search: e.target.value,
      },
      () => {
        this.getProjectList();
      }
    );
  }
  userChangeHandle(value) {
    let data = [];
    for (var i = 0; i < value.length; i++) {
      data.push({ value: value[i].value, label: value[i].label });
    }
    this.setState({
      reportUser: data,
    });
  }
  setAddNewModelClose() {
    setTimeout(() => {
      this.setState({
        addNewModal: false,
      });
    }, 200);
  }
  getSingleUser(id) {
    this.props.dispatch(projectActions.editProject(id));
  }

  editModalClose() {
    this.setState(
      {
        editModal: false,
      },
      () => this.props.dispatch({ type: "MODEL-CLOSE" })
    );
  }
  setEditProject(data) {
    var reportUser = [];

    data.assigned_to.map((task) => {
      reportUser.push({
        value: task?._id,
        label: task?.first_name + " " + task?.last_name,
      });
    });

    let findUserObj = this.state.ReportingList.find(
      (item) => item.value == data.project_team_lead
    );

    this.setState({
      editModal: true,
      id: data._id,
      name: data.name,
      description: data.description,
      start_date: dateFormat(data.start_date, "yyyy-mm-dd"),
      end_date: dateFormat(data.end_date, "yyyy-mm-dd"),
      reportUser: reportUser,
      project_type: { value: data.project_type, label: data.project_type },
      project_team_lead: findUserObj,
    });
  }

  refreshList() {
    this.setState({
      editModal: false,
      addNewModal: false,
    });
    this.getProjectList();
  }

  handleDelete(id) {
    let text = "Are you sure you want to delete this projects?";
    if (confirm(text) == false) {
      return false;
    }

    let header = {
      "Content-Type": "application/json",
      Authorization: "",
    };

    axios
      .post(APIURL + "projects/deleteProject", { id: id }, { headers: header })
      .then((response) => {
        console.log(response);
        this.getProjectList();
      })
      .catch((error) => console.log(error));
  }

  handleInputChange(typedOption) {
    if (typedOption.trim().length > 2) {
      this.setState({ showOptions: true });
    } else {
      this.setState({ showOptions: false });
    }
  }
  componentDidMount() {
    this.setState(
      {
        projectAssign: this.state.user.data._id,
        filterStatus: { value: this.state.user.data._id, label: "My Project" },
      },
      () => {
        this.getProjectList();
        this.AssignUserList();
      }
    );
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.UserListForReporting != undefined) {
      this.setReportingList(nextProps.UserListForReporting);
    }

    if (
      nextProps.activePage != undefined &&
      nextProps.totalItemsCount != undefined &&
      nextProps.limit != undefined
    ) {
      this.handlePageStates(
        nextProps.activePage,
        nextProps.totalItemsCount,
        10
      );
    }

    if (nextProps.projectList != undefined) {
      this.setState({
        projectList: nextProps.projectList,
      });
    }
    if (nextProps.editModal == true) {
      this.setEditProject(nextProps.projects);
    }

    if (nextProps.refreshList == true) {
      this.refreshList();
    }
  }

  projectChangeHandle = (e) => {
    console.log(e.value);

    this.setState({ filterStatus: e, projectAssign: e.value }, () =>
      this.getProjectList()
    );
  };

  render() {
    // console.log("----99",this.state.filterStatus);
    if (!this.state.user) {
      return <Redirect to="/" />;
    }
    if (this.state.user.data.user_role !== "Employee") {
      return <Redirect to="/" />;
    }

    const { totalItemsCount } = this.props;
    const { error, ScsMsg } = this.props;

    return (
      <div>
        <Navbar activePage="dashboard" />
        <main className="offset">
          <div className="container-fluid hard-pad mb-5">
            <div className="row align-items-center pt-4 border-mobile">
              <div className="col-lg-4 col-6">
                <h2 className="page-heading"> Projects</h2>
              </div>
              <div
                className="col-4 zindex2"
                style={{ position: "relative", zIndex: "2" }}
              >
                <Select
                  options={this.projectOptions}
                  onChange={this.projectChangeHandle}
                  value={this.state.filterStatus}
                />
              </div>
              <div className="col-lg-4 search-box">
                <Input
                  id="exampleSearch"
                  name="search"
                  className="search__input"
                  autoComplete="off"
                  placeholder="Search"
                  type="search"
                  onChange={(e) => this.handleSearch(e)}
                />
              </div>
            </div>
            <div className="table-scroll mt-4">
              <table className="main-table">
                <thead>
                  <tr>
                    <th scope="col">Project Name</th>
                    <th scope="col">start date</th>
                    <th scope="col">end date</th>
                    <th scope="col" className="text-center hight_index">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.projectList &&
                    this.state.projectList.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {item.projects.project_type == "Kanban" ? (
                            <Link
                              to={"/employee/taskboard/" + item.projects._id}
                              style={{ display: "block" }}
                            >
                              {item.projects.name}
                            </Link>
                          ) : (
                            item.projects.name
                          )}
                        </td>
                        <td>
                          {dateFormat(item.projects.start_date, "ddd, dd mmm")}
                        </td>
                        <td>
                          {dateFormat(item.projects.end_date, "ddd, dd mmm")}
                        </td>

                        <td className="text-center">
                          <div className="action-area dropdown">
                            <a
                              className="dropdown-toggle"
                              id="navbarDropdown"
                              role="button"
                              data-bs-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <span className="dots">...</span>
                            </a>
                            <div
                              className="dropdown-menu"
                              aria-labelledby="navbarDropdown"
                            >
                              <a
                                className="dropdown-item"
                                onClick={() =>
                                  this.getSingleUser(item.projects._id)
                                }
                              >
                                Edit
                              </a>
                              {this.state.user.data._id !== item._id && (
                                <a
                                  className="dropdown-item"
                                  onClick={() =>
                                    this.handleDelete(item.projects._id)
                                  }
                                >
                                  Delete
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {this.state.projectList &&
                    this.state.projectList.length == 0 && (
                      <tr className="nobg-hover">
                        <td colSpan="5" className="text-center">
                          <div className="norecords">RECORD NOT FOUND</div>
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        <div className="right-aside">
          <p className="mt-5 text-center">Projects Summary</p>

          <div className="stats">
            <div className="stats-big">{totalItemsCount}</div>
            <div className="stats-small">Projects</div>
          </div>
          <div className="mt-5 text-center">
            <Button
              onClick={this.addNewModalOpen}
              color="primary"
              className="btn btn-primary btn-sml"
            >
              Add New Project{" "}
            </Button>
          </div>
        </div>
        {this.state.projectList && this.state.projectList.length > 0 && (
          <Pagination
            activePage={this.state.activePage}
            itemsCountPerPage={this.state.limit}
            totalItemsCount={this.state.totalItemsCount}
            pageRangeDisplayed={5}
            onChange={this.handlePageChange.bind(this)}
            itemClass="page-item"
            linkClass="page-link"
            innerClass="pagination justify-content-center"
            activeLinkClass="active"
            nextPageText="Next"
            prevPageText="Previous"
          />
        )}
        <Modal size="md" isOpen={this.state.addNewModal}>
          <ModalHeader toggle={() => this.addNewModalClose()}>
            Add New Project
          </ModalHeader>
          <ModalBody>
            <form className="">
              <div className="form-group">
                <label>Project Name</label>

                <Input
                  type="text"
                  className="form-control"
                  value={this.state.name}
                  onChange={(e) => this.onChangeName(e.target.value)}
                />
                {error ? <span className="text-danger">{error.name}</span> : ""}
                {this.state.error ? (
                  <span className="text-danger">
                    {error.common ? error.common : ""}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="form-group">
                <label>Project Description </label>
                <textarea
                  type="text"
                  className="form-control"
                  value={this.state.description}
                  onChange={(e) => this.onChangeDescripation(e.target.value)}
                />
              </div>

              <div className="form-group row">
                <div className="col">
                  <label>Start Date </label>
                  <Input
                    type="date"
                    // max={this.state.maxDate}
                    className="form-control"
                    value={this.state.start_date}
                    onChange={(e) => this.onChangeStarDate(e.target.value)}
                  />
                  {error ? (
                    <span className="text-danger">{error.start_date}</span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col">
                  <label>End Date </label>
                  <Input
                    type="date"
                    // max={this.state.maxDate}
                    className="form-control"
                    value={this.state.end_date}
                    onChange={(e) => this.onChangeLastDate(e.target.value)}
                  />
                  {error ? (
                    <span className="text-danger">{error.end_date}</span>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="form-group multi_select iconRemove">
                <label>Assign</label>
                <Select
                  //   styles={colourStyles}
                  isMulti
                  onChange={this.userChangeHandle}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Type to search"
                  value={this.state.reportUser}
                  options={
                    this.state.showOptions ? this.state.ReportingList : []
                  }
                  noOptionsMessage={() =>
                    this.state.showOptions ? "No options" : null
                  }
                  onInputChange={(e) => this.handleInputChange(e)}
                />
              </div>
              <div className="form-group multi_select iconRemove">
                <label>Board Type</label>
                <Select
                  className="basic-multi-select"
                  onChange={this.onChangeProjectBoard}
                  value={this.state.project_type}
                  options={this.state.projectTypeOption}
                />
              </div>
              <div className="form-group multi_select iconRemove">
                <label>Owner</label>
                <Select
                  className="basic-multi-select iconRemove"
                  classNamePrefix="select"
                  placeholder="Type to search"
                  onChange={this.onChangeOwner}
                  value={this.state.project_team_lead}
                  options={
                    this.state.showOptions ? this.state.ReportingList : []
                  }
                  noOptionsMessage={() =>
                    this.state.showOptions ? "No options" : null
                  }
                  onInputChange={(e) => this.handleInputChange(e)}
                />
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <div className="">
              <button
                className="btn btn-secondary mr-2"
                onClick={() => this.addNewModalClose()}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => this.saveProject()}
              >
                Submit
              </button>
            </div>
          </ModalFooter>
        </Modal>
        {/* Add Modal */}
        <Modal size="md" isOpen={this.state.editModal}>
          <ModalHeader toggle={() => this.editModalClose()}>
            Edit Project
          </ModalHeader>
          <ModalBody>
            <form className="">
              <div className="form-group">
                <label>
                  Project Name<strong className="text-danger">*</strong>
                </label>

                <Input
                  type="text"
                  className="form-control"
                  value={this.state.name}
                  onChange={(e) => this.onChangeName(e.target.value)}
                />
                {error ? <span className="text-danger">{error.name}</span> : ""}
                {this.state.error ? (
                  <span className="text-danger">
                    {error.common ? error.common : ""}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="form-group">
                <label>Project Description </label>
                <textarea
                  type="text"
                  className="form-control"
                  value={this.state.description}
                  onChange={(e) => this.onChangeDescripation(e.target.value)}
                />
              </div>

              <div className="form-group row">
                <div className="col">
                  <label>Start Date </label>
                  <Input
                    type="date"
                    // max={this.state.maxDate}
                    className="form-control"
                    value={this.state.start_date}
                    onChange={(e) => this.onChangeStarDate(e.target.value)}
                  />
                  {error ? (
                    <span className="text-danger">{error.start_date}</span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col">
                  <label>End Date </label>
                  <Input
                    type="date"
                    // max={this.state.maxDate}
                    className="form-control"
                    value={this.state.end_date}
                    onChange={(e) => this.onChangeLastDate(e.target.value)}
                  />
                  {error ? (
                    <span className="text-danger">{error.end_date}</span>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="form-group multi_select iconRemove">
                <label>Assign</label>
                <Select
                  //   styles={colourStyles}
                  isMulti
                  onChange={this.userChangeHandle}
                  placeholder="Type to search"
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={this.state.reportUser}
                  options={
                    this.state.showOptions ? this.state.ReportingList : []
                  }
                  noOptionsMessage={() =>
                    this.state.showOptions ? "No options" : null
                  }
                  onInputChange={(e) => this.handleInputChange(e)}
                />
              </div>
              <div className="form-group multi_select iconRemove">
                <label>Board Type</label>
                <Select
                  className="basic-multi-select"
                  onChange={this.onChangeProjectBoard}
                  value={this.state.project_type}
                  options={this.state.projectTypeOption}
                />
              </div>
              <div className="form-group multi_select iconRemove">
                <label>Owner</label>
                <Select
                  className="basic-multi-select iconRemove"
                  classNamePrefix="select"
                  placeholder="Type to search"
                  onChange={this.onChangeOwner}
                  value={this.state.project_team_lead}
                  options={
                    this.state.showOptions ? this.state.ReportingList : []
                  }
                  noOptionsMessage={() =>
                    this.state.showOptions ? "No options" : null
                  }
                  onInputChange={(e) => this.handleInputChange(e)}
                />
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <div className="">
              <button
                className="btn btn-secondary mr-2"
                onClick={() => this.editModalClose()}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={this.handleUpdate}>
                Submit
              </button>
            </div>
          </ModalFooter>
        </Modal>

        <Footer />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    activePage,
    totalItemsCount,
    limit,
    error,
    ScsMsg,
    message,
    refreshList,
  } = state.rootReducer.project;
  const { projectList, projects, editModal } = state.rootReducer.project;
  const { UserListForReporting } = state.rootReducer.adminUsers;
  // console.log(usersList);
  return {
    error,
    ScsMsg,
    activePage,
    totalItemsCount,
    limit,
    projectList,
    message,
    UserListForReporting,
    refreshList,
    projects,
    editModal,
  };
}

export default connect(mapStateToProps)(Index);
