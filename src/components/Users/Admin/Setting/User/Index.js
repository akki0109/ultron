import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Pagination from "react-js-pagination";
import Footer from "../../../../GlobalComponents/Footer";
import { Modal, ModalBody, ModalHeader, ModalFooter, Input } from "reactstrap";
import Navbar from "../../Layout/Navbar";
import {
  userActions,
  adminUserActions,
  departmentActions,
  reportActions,
} from "../../../../../actions";
import { Button } from "reactstrap";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { adminDashboardConstants } from "../../../../../constants";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import dateFormat from "dateformat";
import { colourStyles } from "../../../../../constants/ColorStyle";
import Select from "react-select";
import Terminate from "../../Setting/User/Terminate/index";

const statusOptions = [
  { value: "", label: "Select Role" },
  { value: "Admin", label: "Admin" },
  { value: "Employee", label: "Employee" },
];
const validNumber = new RegExp(/^[0-9]*(\.[0-9]{0,2})?$/);
class Index extends Component {
  constructor(props) {
    super(props);
    // reset login status
    this.state = {
      user: JSON.parse(localStorage.getItem("user")),
      maxDate: "",
      addNewModal: false,
      search: "",
      activePage: 1,
      limit: 10,
      active: false,
      totalItemsCount: 1,
      serachName: "",
      status: false,
      userInfo: {
        user_role: "",
        employee_id: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        status: "Active",
        department_type: "",
        designation: "",
        reportTo: "",
        date_of_birth: "",
        date_of_joining: "",
        password: "",
        confirm_password: "",
        casual_leave: "0",
        sick_leave: "0",
        bank_name: "",
        account_number: "",
        pan_number: "",
        pf_check: false,
        esic_check: false,
        basic_salary: "",
        hra: "",
        pf: "",
        esic: "",
        special_allowance: "",
        tds:"",
        payment_code:"",
        employer_pf:"",
        employer_esic:"",
        bank_status:"NFT"
      },
      selectedDepartment: "",
      selectedReportTo: "",
      error: false,
      deleteConfirmation: false,
      id: "",
      editModal: false,
      deleteModal: false,
      terminateModal: false,
      resetPasswordModal: false,
      editUserData: {
        id: "",
        user_role: "",
        employee_id: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        designation: "",
        department_type: "",
        casual_leave: "0",
        sick_leave: "0",
        bank_name: "",
        account_number: "",
        pan_number: "",
        pf_check: false,
        esic_check: false,
        basic_salary: "",
        hra: "",
        pf: "",
        esic: "",
        special_allowance: "",
        tds:"",
        payment_code:"",
        employer_pf:"",
        employer_esic:"",
        bank_status:"NFT",
        termination_date:""
      },
      terminateUserId: "",
      resetPasswordData: {
        id: "",
        password: "",
        confirm_password: "",
      },
      editOpenCount: 0,
      userRoleSelected: [{ value: "", label: "Select Role" }],
    };

    this.getUsersList = this.getUsersList.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.editUserInfoHandler = this.editUserInfoHandler.bind(this);
    this.addUserSubmit = this.addUserSubmit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.doResetPassword = this.doResetPassword.bind(this);
    this.addNewModalOpen = this.addNewModalOpen.bind(this);
    this.addNewModalClose = this.addNewModalClose.bind(this);
    this.terminateModalOpen = this.terminateModalOpen.bind(this);
    this.terminateModalClose = this.terminateModalClose.bind(this);
    this.editModalOpen = this.editModalOpen.bind(this);
    this.editModalClose = this.editModalClose.bind(this);
    this.deleteModalOpen = this.deleteModalOpen.bind(this);
    this.deleteModalClose = this.deleteModalClose.bind(this);
    this.resetPasswordModalOpen = this.resetPasswordModalOpen.bind(this);
    this.resetPasswordModalClose = this.resetPasswordModalClose.bind(this);
    this.getUserInitials = this.getUserInitials.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleOnUserReportSelect = this.handleOnUserReportSelect.bind(this);
    this.handleDepartmentListSearch =
      this.handleDepartmentListSearch.bind(this);
    this.handleOnDepartmentListSelect =
      this.handleOnDepartmentListSelect.bind(this);
    this.handleOnClear = this.handleOnClear.bind(this);
    this.handleReportListSearch = this.handleReportListSearch.bind(this);
    this.onClearDepartment = this.onClearDepartment.bind(this);
    this.closeModelToRedux = this.closeModelToRedux.bind(this);
  }

  futureDates = () => {
    var dtToday = new Date();
    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();

    if (month < 10) month = "0" + month.toString();
    if (day < 10) day = "0" + day.toString();

    var maxDate = year + "-" + month + "-" + day;
    this.setState({
      maxDate: maxDate,
    });
  };

  handlePageChange(pageNumber) {
    this.setState(
      {
        activePage: pageNumber,
      },
      () => {
        this.getUsersList();
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

  userInfoHandler = (name, value) => {
    const { userInfo } = this.state;
    console.log(userInfo);
    if (name == "casual_leave" && name == "sick_leave") {
      userInfo[name] = "0";
    } 
    else if(name == "basic_salary" || name == "special_allowance" || name == "hra" || name == "tds" || name == "pf" || name == "employer_pf" || name == "esic" || name == "employer_esic") {      if(validNumber.test(value))
        userInfo[name] = value;
    }
    else
    userInfo[name] = value;

    if(!this.state.userInfo.pf_check)
    {
      userInfo["employer_pf"] = "";
      userInfo["pf"] = "";
    }
    if(!this.state.userInfo.esic_check)
    {
      userInfo["employer_esic"] = "";
      userInfo["esic"] = "";
    }
    this.setState({
      active: true,
      userInfo,
    });
  };

  editUserInfoHandler = (name, value) => {
    const { editUserData } = this.state;
    console.log(editUserData);
    if (name == "casual_leave" && name == "sick_leave") {
      editUserData[name] = "0";
    } 
    else if(name == "basic_salary" || name == "special_allowance" || name == "hra" || name == "tds" || name == "pf" || name == "employer_pf" || name == "esic" || name == "employer_esic") {
      if(validNumber.test(value))
      editUserData[name] = value;
    }
    else
    editUserData[name] = value;

    if(!this.state.editUserData.pf_check)
    {
      editUserData["employer_pf"] = "";
      editUserData["pf"] = "";
    }
    if(!this.state.editUserData.esic_check)
    {
      editUserData["employer_esic"] = "";
      editUserData["esic"] = "";
    }
    this.setState({
      editUserData,
    });
  };

  employeeChangeHandle(e) {
    console.log(e.value);
    const { userInfo } = this.state;
    userInfo["user_role"] = e.value;
    this.setState({
      userInfo,
      userRoleSelected: [{ value: e.value, label: e.label }],
    });
  }

  editEmployeeChangeHandle(e) {
    console.log(e.value);
    const { editUserData } = this.state;
    editUserData["user_role"] = e.value;
    this.setState({
      editUserData,
      userRoleSelected: [{ value: e.value, label: e.label }],
    });
  }

  resetPasswordInfoHandler = (name, value) => {
    const { resetPasswordData } = this.state;
    resetPasswordData[name] = value;
    this.setState({
      resetPasswordData,
    });
  };
  addUserSubmit() {
    this.props.dispatch(adminUserActions.addUser(this.state.userInfo));
  }
  addNewModalOpen() {
    this.setState({
      addNewModal: !this.state.addNewModal,
    });
  }
  addNewModalClose() {
    this.setState({
      addNewModal: false,
      userInfo: {
        user_role: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        status: "Active",
        department_type: "",
        designation: "",
        date_of_birth: "",
        date_of_joining: "",
        password: "",
        confirm_password: "",
        sick_leave: "",
        casual_leave: "",
        bank_name: "",
        account_number: "",
        pan_number: "",
        pf_check: false,
        esic_check: false,
        basic_salary: "",
        hra: "",
        pf: "",
        esic: "",
        special_allowance: "",
        tds:"",
        payment_code:"",
        employer_pf:"",
        employer_esic:"",
        bank_status:"NFT"
      },
      error: false,
      userRoleSelected: [{ value: "", label: "Select Role" }],
    });
  }
  editModalOpen() {
    this.setState({
      editModal: true,
      editOpenCount: 0,
    });
  }
  editModalClose() {
    this.setState(
      {
        editModal: false,
        editOpenFlag: 0,
        editUserData: {
          id: "",
          user_role: "",
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          status: "Active",
          designation: "",
          department_type: "",
          reportTo: "",
          casual_leave: "",
          sick_leave: "",
          date_of_birth: "",
          date_of_joining: "",
          bank_name: "",
          account_number: "",
          pan_number: "",
          pf_check: false,
          esic_check: false,
          basic_salary: "",
          hra: "",
          pf: "",
          esic: "",
          special_allowance: "",
          tds:"",
          payment_code:"",
          employer_pf:"",
          employer_esic:"",
          bank_status:"NFT",
          termination_date:""
        },
      },
      () => {
        this.closeModelToRedux();
        this.addNewModalClose();
      }
    );
  }
  closeModelToRedux()
  {
    this.props.dispatch({type:adminDashboardConstants.CLOSE_EDIT_MODEL});
  }
  resetPasswordModalOpen() {
    this.setState({
      resetPasswordModal: true,
    });
  }
  resetPasswordModalClose() {
    this.setState({
      resetPasswordModal: false,
      resetPasswordData: {
        id: "",
        password: "",
        confirm_password: "",
      },
    });
  }
  handleResetPassword(id) {
    this.setState({
      resetPasswordData: {
        id: id,
      },
    });
    this.resetPasswordModalOpen();
  }
  doResetPassword() {
    this.props.dispatch(
      adminUserActions.resetPassword(this.state.resetPasswordData)
    );
  }
  terminateModalOpen() {
    this.setState({
      terminateModal: true,
    });
  }
  terminateModalClose() {
    this.setState({
      terminateModal: false,
    });
  }
  handleTerminate(id) {
    this.setState({
      terminateUserId: id,
    });
    this.terminateModalOpen();
  }

  getSingleUser(id) {
    this.setState(
      {
        editModal: true,
        editOpenCount: 0,
      },
      () => {
        this.props.dispatch(userActions.getadminById(id));
      }
    );
  }
  setEditUser(data) {
    let SelectedDep = [];
    this.state.departmentList
      .filter((item) => item.id === data.department_type)
      .map((result) => (SelectedDep = result));
    let SelectedReport = [];
    this.state.reportList
      .filter((item) => item.id === data.reportTo)
      .map((result) => (SelectedReport = result));
    this.setState({
      editUserData: {
        id: data._id,
        user_role: data.user_role,
        employee_id: data.employee_id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        status: "Active",
        designation: data.designation,
        department_type: data.department_type,
        reportTo: data.reportTo,
        sick_leave: data.sick_leave,
        bank_name: data.bank_name,
        account_number: data.account_number,
        pan_number: data.pan_number,
        pf_check: data.pf_check,
        esic_check: data.esic_check,
        casual_leave: data.casual_leave,
        floating_leave: data.floating_leave,
        basic_salary: data.basic_salary,
        hra: data.hra,
        pf: data.pf,
        esic: data.esic,
        special_allowance: data.special_allowance,
        tds:data.tds,
        payment_code:data.payment_code,
        employer_pf:data.employer_pf,
        employer_esic:data.employer_esic,
        bank_status:data.bank_status?data.bank_status:"NFT",
        date_of_birth:
          data.date_of_birth == null
            ? ""
            : dateFormat(data.date_of_birth, "yyyy-mm-dd"),
        date_of_joining:
          data.date_of_joining == null
            ? ""
            : dateFormat(data.date_of_joining, "yyyy-mm-dd"),
        probation_end_date:
          data.probation_end_date == null
            ? ""
            : dateFormat(data.probation_end_date, "yyyy-mm-dd"),
        termination_date:data.termination_date?dateFormat(data.termination_date,"yyyy-mm-dd"):""
      },
      selectedDepartment: SelectedDep.name,
      selectedReportTo: SelectedReport.name,
      editOpenCount: 1,
      userRoleSelected: [{ value: data.user_role, label: data.user_role }],
      
    });
  }
  deleteModalOpen() {
    this.setState({
      deleteModal: true,
    });
  }
  deleteModalClose() {
    this.setState({
      deleteModal: false,
    });
  }
  handleDelete(id) {
    this.setState({
      id: id,
    });
    this.deleteModalOpen();
  }
  doDelete() {
    this.props.dispatch(adminUserActions.delete({ id: this.state.id }));
  }
  getUserInitials(Name) {
    if (Name != "" && Name != null) {
      const initials = Name.charAt(0);
      return initials.toUpperCase();
    } else {
      return "";
    }
  }
  handleOnUserReportSelect(item) {
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        reportTo: item.id,
      },
      editUserData: {
        ...this.state.editUserData,
        reportTo: item.id,
      },
      selectedReportTo: item.name,
    });
  }

  handleOnClear = () => {
    this.setState({
      userInfo: {
        reportTo: "",
      },
      editUserData: {
        reportTo: "",
      },
      selectedReportTo: "",
    });
  };

  handleReportListSearch(searchString) {
    const { editUserData } = this.state;
    editUserData["reportTo"] = "";
    this.setState({
      editUserData,
    });
    this.props.dispatch(reportActions.getreportList({ search: searchString }));
  }

  handleDepartmentListSearch(searchString) {
    const { editUserData } = this.state;
    editUserData["department_type"] = "";
    this.setState({
      editUserData,
    });
    this.props.dispatch(
      departmentActions.getDepartmentList({ search: searchString })
    );
  }

  handleOnDepartmentListSelect(item) {
    console.log(item);
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        department_type: item.id,
      },
      editUserData: {
        ...this.state.editUserData,
        department_type: item.id,
      },
      selectedDepartment: item.name,
    });
  }
  onClearDepartment = () => {
    this.setState({
      userInfo: {
        department_type: "",
      },
      editUserData: {
        department_type: "",
      },
      selectedDepartment: "",
    });
  };

  getUsersList() {
    this.props.dispatch(
      adminUserActions.getUsersList({
        search: this.state.search,
        page: this.state.activePage,
        limit: this.state.limit,
      })
    );
  }
  handleUpdate() {
    this.props.dispatch(adminUserActions.updateUser(this.state.editUserData));
  }
  getDepartmentList() {
    this.props.dispatch(
      departmentActions.getDepartmentList({
        search: this.state.search,
        page: this.state.activePage,
        limit: this.state.limit,
      })
    );
  }
  getreportList() {
    this.props.dispatch(
      reportActions.getreportList({
        search: this.state.search,
        page: this.state.activePage,
        limit: this.state.limit,
      })
    );
  }
  setRefreshList() {
    this.setState(
      {
        activePage: 1,
        editModal: false,
        error: "",
        ScsMsg: "",
      },
      () => {
        this.getUsersList();
      }
    );
  }

  handleSearch(e) {
    this.setState(
      {
        activePage: 1,
        search: e.target.value,
      },
      () => {
        this.getUsersList();
      }
    );
  }
  componentDidMount() {
    this.getUsersList();
    this.getDepartmentList();
    this.futureDates();
    this.getreportList();
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.refreshList != undefined) {
      this.setRefreshList();
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

    if (nextProps.addModal == false) {
      this.addNewModalClose();
    }
    if (nextProps.addModal == true) {
      this.addNewModalOpen();
    }

    if (nextProps.editModal == false) {
      this.editModalClose();
    }

    if (nextProps.editModal == true && this.state.editOpenCount == 0) {
      // console.log("nextProps");
      this.setEditUser(nextProps.user.data);
    }

    if (nextProps.resetModal == false) {
      this.resetPasswordModalClose();
    }
    if (nextProps.deleteModal == false) {
      this.deleteModalClose();
    }
    if (nextProps.deleteModal == true) {
      this.deleteModalOpen();
    }

    if (nextProps.editModalClose != undefined) {
      this.editModalClose();
    }

    if (nextProps.error != undefined) {
      this.setState({
        error: true,
      });
    }

    if (nextProps.departmentList != undefined) {
      let item = nextProps.departmentList;

      let departmentList = [];
      for (var d = 0; d < item?.length; d++) {
        departmentList.push({ id: item[d]._id, name: item[d].name });
      }
      this.setState({
        departmentList: departmentList,
      });
    }

    if (nextProps.reportList != undefined) {
      let item = nextProps.reportList.filter(
        (report) => report._id != this.state.editUserData.id
      );
      let reportList = [];
      for (var b = 0; b < item?.length; b++) {
        reportList.push({
          id: item[b]._id,
          name: item[b].first_name + " " + item[b].last_name,
          email: item[b].email,
        });
      }

      this.setState({
        reportList: reportList,
      });
    }
  }
  render() {
    if (!this.state.user) {
      return <Redirect to="/" />;
    }
    console.log(123,this.state.editUserData);
    if (this.state.user.data.user_role !== "Admin") {
      return <Redirect to="/" />;
    }
    const { usersList, totalItemsCount } = this.props;
    const { error, loading, ScsMsg } = this.props;
    return (
      <div>
        <Navbar activePage="dashboard" />
        <main className="offset">
          <div className="container-fluid hard-pad">
            <div className="row align-items-center pt-4 border-mobile">
              <div className="col-lg-4 col-6">
                <h2 className="page-heading">Settings </h2>
              </div>
            </div>

            <div className="row align-items-center pt-4 border-mobile">
              <div className="col-lg-8">
                <ul className="submenu">
                  <li className="active">
                    <a href="javascript:;">Employees</a>
                  </li>
                  <li className="">
                    <Link to="/admin/settings/department">Departments</Link>
                  </li>
                  <li className="">
                    <Link to="/admin/holidays">Holidays</Link>
                  </li>
                  <li className="">
                    <Link to="/admin/settings/terminate-list">Exit</Link>
                  </li>
                </ul>
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
            <div className="table-scroll mt-4 pagination_mrg">
              <table className="main-table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">User Name</th>
                    <th scope="col">Employee Id</th>
                    <th scope="col">Phone Number</th>
                    <th scope="col">Designation</th>
                    <th scope="col">Report To</th>
                    <th scope="col" className="text-center hight_index">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usersList &&
                    usersList.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="name">
                              <strong>
                                <div className="avtar">
                                  {this.getUserInitials(item.first_name)}
                                  {this.getUserInitials(item.last_name)}
                                </div>
                              </strong>
                            </div>
                          </div>
                        </td>
                        <td>
                          <strong>
                            {item.first_name}{" "}
                            {item.last_name ? item.last_name : ""}
                          </strong>
                        </td>
                        <td>{item.employee_id}</td>
                        <td>{item.phone}</td>
                        <td>{item.designation}</td>
                        <td>
                          {" "}
                          {item.reportTo
                            ? item.reportTo.first_name +
                              " " +
                              item.reportTo.last_name
                            : ""}{" "}
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
                                onClick={() => this.getSingleUser(item._id)}
                              >
                                Edit
                              </a>
                              {this.state.user.data._id !== item._id && (
                                <a
                                  className="dropdown-item"
                                  onClick={() => this.handleDelete(item._id)}
                                >
                                  Delete
                                </a>
                              )}
                              {/* <a
                                className="dropdown-item"
                                onClick={() =>
                                  this.handleResetPassword(item._id)
                                }
                              >
                                Reset Password
                              </a> */}
                              <a
                                className="dropdown-item"
                                onClick={() => this.handleTerminate(item._id)}
                              >
                                Exit
                              </a>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {usersList && usersList?.length == 0 && loading == false && (
                    <tr className="text-center">
                      <td colSpan="5">
                        <div className="norecords">No Record Found</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {usersList && usersList?.length > 0 && (
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
        </main>
        <div className="right-aside">
          <p className="mt-5 text-center">Employee Summary</p>

          <div className="stats">
            <div className="stats-big">{totalItemsCount}</div>
            <div className="stats-small">Employees</div>
          </div>

          <div className="mt-5 text-center">
            <Button
              onClick={this.addNewModalOpen}
              color="primary"
              className="btn btn-primary btn-sml"
            >
              Add New Employee
            </Button>
          </div>
        </div>

        <Modal
          size="xxl_add_new_user"
          isOpen={this.state.addNewModal}
          toggle={() => this.addNewModalClose()}
        >
          <ModalHeader toggle={() => this.addNewModalClose()}>
            Add New User
          </ModalHeader>
          <ModalBody>
            <form className="">
              <div className="form-group row">
                <div className="col custom_dropdown">
                  <label>
                    User Role <strong className="text-danger">*</strong>
                  </label>
                  <Select
                    styles={colourStyles}
                    onChange={(e) => this.employeeChangeHandle(e)}
                    value={this.state.userRoleSelected}
                    options={statusOptions}
                  />

                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.user_role ? error.user_role : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>

                <div className="col report_to_section">
                  <label>
                    Report To 
                  </label>
                  <ReactSearchAutocomplete
                    items={this.state.reportList}
                    onSearch={this.handleReportListSearch}
                    onSelect={this.handleOnUserReportSelect}
                    onClear={this.handleOnClear}
                    fuseOptions={{ minMatchCharLength: 1 }}
                    inputDebounce="100"
                    autoFocus
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.reportTo ? error.reportTo : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col">
                  <label>
                    {" "}
                    Employee Id <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="text"
                    className="form-control"
                    value={this.state.userInfo.employee_id}
                    onChange={(e) =>
                      this.userInfoHandler("employee_id", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.employee_id ? error.employee_id : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="form-group row">
                <div className="col">
                  <label>
                    Floating leave <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    className="form-control"
                    value={this.state.userInfo.floating_leave}
                    onChange={(e) =>
                      this.userInfoHandler("floating_leave", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.floating_leave ? error.floating_leave : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col">
                  <label>
                    First Name <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="text"
                    className="form-control"
                    value={this.state.userInfo.first_name}
                    onChange={(e) =>
                      this.userInfoHandler("first_name", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.first_name ? error.first_name : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col">
                  <label>
                    Last Name <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="text"
                    className="form-control"
                    value={this.state.userInfo.last_name}
                    onChange={(e) =>
                      this.userInfoHandler("last_name", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.last_name ? error.last_name : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              {/* <div className="form-group row">
               
                
              </div> */}
              <div className="form-group row">
                <div className="col">
                  <label>
                    Phone Number <strong className="text-danger">*</strong>{" "}
                  </label>
                  <Input
                    type="number"
                    min="0"
                    className="form-control"
                    pattern="^[0-9]{10}$"
                    value={this.state.userInfo.phone}
                    onChange={(e) => {
                      this.userInfoHandler("phone", e.target.value);
                    }}
                  />
                  {this.state.userInfo.phone?.length > 10 && (
                    <span className="text-danger">
                      Please write only 10 digit phone number
                    </span>
                  )}
                  {!this.state.userInfo.phone?.length &&
                  this.state.error &&
                  error ? (
                    <span className="text-danger">
                      {error.phone ? error.phone : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col" style={{ zIndex: 1 }}>
                  <label>
                    Department Type <strong className="text-danger">*</strong>
                  </label>
                  <ReactSearchAutocomplete
                    styles={colourStyles}
                    // className="form-control chosen-select"
                    items={this.state.departmentList}
                    onSearch={this.handleDepartmentListSearch}
                    onSelect={this.handleOnDepartmentListSelect}
                    onClear={this.onClearDepartment}
                    fuseOptions={{ minMatchCharLength: 1 }}
                    inputDebounce="100"
                    autoFocus
                  />

                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.department_type ? error.department_type : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>

                <div className="col">
                  <label>
                    Designation <strong className="text-danger"></strong>
                  </label>
                  <Input
                    type="text"
                    className="form-control"
                    value={this.state.userInfo.designation}
                    onChange={(e) =>
                      this.userInfoHandler("designation", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.designation ? error.designation : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="form-group row">
                <div className="col">
                  <label>
                    Date Of Birth <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="date"
                    max={this.state.maxDate}
                    className="form-control"
                    value={this.state.userInfo.date_of_birth}
                    onChange={(e) =>
                      this.userInfoHandler("date_of_birth", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.date_of_birth ? error.date_of_birth : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col">
                  <label>
                    Date Of Joining <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="date"
                    max={this.state.maxDate}
                    className="form-control"
                    value={this.state.userInfo.date_of_joining}
                    onChange={(e) =>
                      this.userInfoHandler("date_of_joining", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.date_of_joining ? error.date_of_joining : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col">
                  <label>
                    Probation End Date <strong className="text-danger"></strong>
                  </label>
                  <Input
                    type="date"
                    // max={this.state.maxDate}
                    className="form-control"
                    value={this.state.userInfo.probation_end_date}
                    onChange={(e) =>
                      this.userInfoHandler("probation_end_date", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.probation_end_date ? error.probation_end_date : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              {/* <div className="form-group row">
                <div className="col">
                  <label>
                    Password <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="password"
                    className="form-control"
                    autoComplete="new-password"
                    value={this.state.userInfo.password}
                    onChange={(e) =>
                      this.userInfoHandler("password", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.password ? error.password : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col">
                  <label>
                    Confirm Password <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="password"
                    className="form-control"
                    autoComplete="password"
                    value={this.state.userInfo.confirm_password}
                    onChange={(e) =>
                      this.userInfoHandler("confirm_password", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.confirm_password ? error.confirm_password : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div> */}

              <div className="form-group row d-none">
                <div className="col">
                  <label>
                    Causal leave <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    className="form-control"
                    disabled
                    value={this.state.userInfo.casual_leave}
                    onChange={(e) =>
                      this.userInfoHandler("casual_leave", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.casual_leave ? error.casual_leave : ""}
                    </span>
                  ) : (
                    ""
                  )}
                  {/* {(this.state.userInfo.casual_leave <= 0 && this.state.active ) ? <span className="text-danger">Casual leave field is not validate.</span>:""} */}
                </div>

                {/* floating_Leave input */}
                <div className="col d-none">
                  <label>
                    Sick Leave <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    disabled
                    className="form-control"
                    value={this.state.userInfo.sick_leave}
                    onChange={(e) =>
                      this.userInfoHandler("sick_leave", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.sick_leave ? error.sick_leave : ""}
                    </span>
                  ) : (
                    ""
                  )}
                  {/* {(this.state.userInfo.sick_leave <= 0) ? <span className="text-danger">Sick leave field is not validate.</span>:""} */}
                </div>
              </div>
              <div className="form-group row">
                <div className="col">
                  <label>
                    Bank <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="text"
                    min="0"
                    className="form-control"
                    value={this.state.userInfo.bank_name}
                    onChange={(e) =>
                      this.userInfoHandler("bank_name", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.bank_name ? error.bank_name : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col">
                  <label>Account Number <strong className="text-danger">*</strong> </label>
                  <Input
                    type="text"
                    min="0"
                    className="form-control"
                    value={this.state.userInfo.account_number}
                    onChange={(e) =>
                      this.userInfoHandler("account_number", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.account_number ? error.account_number : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col">
                  <label>
                    Pan Number <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="text"
                    min="0"
                    className="form-control"
                    value={this.state.userInfo.pan_number}
                    onChange={(e) =>
                      this.userInfoHandler("pan_number", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.pan_number ? error.pan_number : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="form-group row">
                <div className="col-4">
                  <label>
                    Email Address (Username){" "}
                    <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="email"
                    className="form-control"
                    autocomplete="email"
                    value={this.state.userInfo.email}
                    onChange={(e) =>
                      this.userInfoHandler("email", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.email ? error.email : ""}
                    </span>
                  ) : (
                    ""
                  )}
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.common ? error.common : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <b>Salary Details</b>
              <hr className="mt-1" />
              <div className="form-group row">
                <div className="col">
                  <label>Basic Salary</label>
                  <Input
                    type="text"
                    min="0"
                    className="form-control"
                    value={this.state.userInfo.basic_salary}
                    onChange={(e) =>
                      this.userInfoHandler("basic_salary", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.basic_salary ? error.basic_salary : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col">
                  <label>Special Allowance</label>
                  <Input
                    type="text"
                    min="0"
                    className="form-control"
                    value={this.state.userInfo.special_allowance}
                    onChange={(e) =>
                      this.userInfoHandler("special_allowance", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.special_allowance ? error.special_allowance : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col">
                  <label>HRA </label>
                  <Input
                    type="text"
                    min="0"
                    className="form-control"
                    value={this.state.userInfo.hra}
                    onChange={(e) =>
                      this.userInfoHandler("hra", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.hra ? error.hra : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="form-group row">
                {/* <div className="col">
                  <label>HRA </label>
                  <Input
                    type="text"
                    min="0"
                    className="form-control"
                    value={this.state.userInfo.hra}
                    onChange={(e) =>
                      this.userInfoHandler("hra", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.hra ? error.hra : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div> */}
                <div className="col-4">
                  <label>TDS </label>
                  <Input
                    type="text"
                    min="0"
                    className="form-control"
                    value={this.state.userInfo.tds}
                    onChange={(e) =>
                      this.userInfoHandler("tds", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.tds ? error.tds : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-4">
                  <label>Payment Code </label>
                  <Input
                    type="text"
                    min="0"
                    className="form-control"
                    value={this.state.userInfo.payment_code}
                    onChange={(e) => this.userInfoHandler("payment_code", e.target.value)}
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.payment_code ? error.payment_code : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-4">
                  <label> NFT / WIB </label>
                  <Input
                    type="select"
                    min="0"
                    className="form-control"
                    value={this.state.userInfo.bank_status}
                    onChange={(e) => this.userInfoHandler("bank_status", e.target.value)}
                  >
                    <option>
                      NFT
                    </option>
                    <option>
                      WIB
                    </option>
                  </Input>
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.bank_status ? error.bank_status : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                
              </div>
              <div className="form-group row">
             <div className="col-4"> <b>PF & ESIC</b></div>
             <div className="col-4"><b>Employee</b></div>
             <div className="col-4"><b>Employer</b></div>
              </div>
              <hr className="mt-1" />
              <div className="form-group row">
                <div className="col-4">
                <div className="mr-5">
                  <div className="d-flex justify-content-start align-items-center">
                    <label className="mr-2 mb-0">PF </label>
                    <div>
                      <input
                        type="checkbox"
                        min="0"
                        className="form-control"
                        checked={this.state.userInfo.pf_check}
                        onChange={(e) =>
                          this.userInfoHandler("pf_check", e.target.checked)
                        }
                      />
                    </div>
                  </div>
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.pf_check ? error.pf_check : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                </div>
                <div className="col-4">
                  <label>Employee PF </label>
                  <Input
                    type="text"
                    min="0"
                    disabled={this.state.userInfo.pf_check?false:true}
                    className="form-control"
                    value={this.state.userInfo.pf}
                    onChange={(e) => this.userInfoHandler("pf", e.target.value)}
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.pf ? error.pf : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
               
                <div className="col">
                  <label>Employer PF</label>
                  <Input
                    type="text"
                    min="0"
                    className="form-control"
                    disabled={!this.state.userInfo.pf_check}
                    value={this.state.userInfo.employer_pf}
                    onChange={(e) =>
                      this.userInfoHandler("employer_pf", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.employer_pf ? error.employer_pf : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="form-group row">
             <div className="col-4">
             <div className="mr-5">
                  <div className="d-flex justify-content-start align-items-center">
             <label className="mr-2 mb-0">ESIC </label>
                    <div>
                      <input
                        type="checkbox"
                        min="0"
                        className="form-control"
                        checked={this.state.userInfo.esic_check}
                        onChange={(e) =>
                          this.userInfoHandler("esic_check", e.target.checked)
                        }
                      />
                    </div>
                    </div>
                    </div>
             </div>
             
            
                <div className="col-4">
                  <label>Employee ESIC</label>
                  <Input
                    type="text"
                    min="0"
                    disabled={!this.state.userInfo.esic_check}
                    className="form-control"
                    value={this.state.userInfo.esic}
                    onChange={(e) =>
                      this.userInfoHandler("esic", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.esic ? error.esic : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-4">
                  <label>Employer ESIC</label>
                  <Input
                    type="text"
                    min="0"
                    disabled={!this.state.userInfo.esic_check}
                    className="form-control"
                    value={this.state.userInfo.employer_esic}
                    onChange={(e) =>
                      this.userInfoHandler("employer_esic", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.employer_esic ? error.employer_esic : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <div className="">
              <button
                className="btn btn-secondary mr-3"
                onClick={this.addNewModalClose}
              >
                {" "}
                Cancel{" "}
              </button>
              {loading ? (
                <Button color="primary">Loading...</Button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={this.addUserSubmit}
                >
                  {" "}
                  Submit{" "}
                </button>
              )}
            </div>
          </ModalFooter>
        </Modal>
        {/* Add Modal */}
        <Modal
          size="xxl_Edit_User_Details"
          isOpen={this.state.editModal}
          toggle={() => this.editModalClose()}
        >
          <ModalHeader className="" toggle={() => this.editModalClose()}>
            Edit User Details
          </ModalHeader>
          <ModalBody>
            <form className="">
              <div className="form-group row">
                <div className="col custom_dropdown">
                  <label>
                    User Role <strong className="text-danger">*</strong>
                  </label>
                  <Select
                    styles={colourStyles}
                    onChange={(e) => this.editEmployeeChangeHandle(e)}
                    value={this.state.userRoleSelected}
                    options={statusOptions}
                  />

                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.user_role ? error.user_role : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col">
                  <label>Report To </label>
                  <ReactSearchAutocomplete
                    // className="form-control chosen-select"
                    items={this.state.reportList}
                    onSearch={this.handleReportListSearch}
                    onSelect={this.handleOnUserReportSelect}
                    inputSearchString={this.state.selectedReportTo}
                    fuseOptions={{ minMatchCharLength: 1 }}
                    inputDebounce="100"
                    autoFocus
                  />

                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.reportTo ? error.reportTo : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col">
                  <label>
                    {" "}
                    Employee Id <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="text"
                    className="form-control"
                    value={this.state.editUserData.employee_id}
                    onChange={(e) =>
                      this.editUserInfoHandler("employee_id", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.employee_id ? error.employee_id : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="form-group row">
                <div className="col">
                  <label>
                    Floating leave <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    className="form-control"
                    value={this.state.editUserData.floating_leave}
                    onChange={(e) =>
                      this.editUserInfoHandler("floating_leave", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.floating_leave ? error.floating_leave : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col">
                  <label>
                    First Name <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="text"
                    className="form-control"
                    value={this.state.editUserData.first_name}
                    onChange={(e) =>
                      this.editUserInfoHandler("first_name", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.first_name ? error.first_name : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col">
                  <label>
                    Last Name <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="text"
                    className="form-control"
                    value={this.state.editUserData.last_name}
                    onChange={(e) =>
                      this.editUserInfoHandler("last_name", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.last_name ? error.last_name : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="form-group row">
                <div className="col">
                  <label>
                    Email Address (Username){" "}
                    <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="email"
                    className="form-control"
                    value={this.state.editUserData.email}
                    onChange={(e) =>
                      this.editUserInfoHandler("email", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.email ? error.email : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col">
                  <label>
                    Phone Number <strong className="text-danger">*</strong>{" "}
                  </label>
                  <Input
                    type="number"
                    min="0"
                    className="form-control"
                    value={this.state.editUserData.phone}
                    onChange={(e) =>
                      this.editUserInfoHandler("phone", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.phone ? error.phone : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col select-fild">
                  <label>
                    Department Type
                    <strong className="text-danger">*</strong>
                  </label>
                  <ReactSearchAutocomplete
                    // className="form-control chosen-select"
                    style={{ zIndex: 1 }}
                    items={this.state.departmentList}
                    onSearch={this.handleDepartmentListSearch}
                    onSelect={this.handleOnDepartmentListSelect}
                    inputSearchString={this.state.selectedDepartment}
                    fuseOptions={{ minMatchCharLength: 1 }}
                    inputDebounce="100"
                    autoFocus
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.department_type ? error.department_type : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="form-group row">
                <div className="col">
                  <label>Designation </label>
                  <Input
                    type="text"
                    className="form-control"
                    value={this.state.editUserData.designation}
                    onChange={(e) =>
                      this.editUserInfoHandler("designation", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.designation ? error.designation : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col">
                  <label>
                    Date Of Birth<strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="date"
                    max={this.state.maxDate}
                    className="form-control"
                    value={this.state.editUserData.date_of_birth}
                    onChange={(e) =>
                      this.editUserInfoHandler("date_of_birth", e.target.value)
                    }
                  />

                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.date_of_birth ? error.date_of_birth : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col">
                  <label>
                    Date Of Joining <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="date"
                    max={this.state.maxDate}
                    className="form-control"
                    value={this.state.editUserData.date_of_joining}
                    onChange={(e) =>
                      this.editUserInfoHandler(
                        "date_of_joining",
                        e.target.value
                      )
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.date_of_joining ? error.date_of_joining : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="form-group row">
                <div className="col">
                  <label>
                    Probation End Date <strong className="text-danger"></strong>
                  </label>
                  <Input
                    type="date"
                    // max={this.state.maxDate}
                    className="form-control"
                    value={this.state.editUserData.probation_end_date}
                    onChange={(e) =>
                      this.editUserInfoHandler(
                        "probation_end_date",
                        e.target.value
                      )
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.probation_end_date ? error.probation_end_date : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col">
                  <label>
                    Bank <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="text"
                    min="0"
                    className="form-control"
                    value={this.state.editUserData.bank_name}
                    onChange={(e) =>
                      this.editUserInfoHandler("bank_name", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.bank_name ? error.bank_name : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col">
                  <label>Account Number <strong className="text-danger">*</strong> </label>
                  <Input
                    type="text"
                    min="0"
                    className="form-control"
                    value={this.state.editUserData.account_number}
                    onChange={(e) =>
                      this.editUserInfoHandler("account_number", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.account_number ? error.account_number : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="form-group row">
                <div className="col-4">
                  <label>
                    Pan Number <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="text"
                    min="0"
                    className="form-control"
                    value={this.state.editUserData.pan_number}
                    onChange={(e) =>
                      this.editUserInfoHandler("pan_number", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.pan_number ? error.pan_number : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-4">
                  <label>
                    Termination Date
                  </label>
                  <Input
                    type="date"
                    className="form-control"
                    value={this.state.editUserData.termination_date}
                    onChange={(e) =>
                      this.editUserInfoHandler("termination_date", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.termination_date ? error.termination_date : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <b>Salary Details</b>
              <hr className="mt-1" />
              <div className="form-group row d-none">
                <div className="col">
                  <label>
                    Causal leave <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    disabled
                    className="form-control"
                    value={this.state.editUserData.casual_leave}
                    onChange={(e) =>
                      this.editUserInfoHandler("casual_leave", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.casual_leave ? error.casual_leave : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>

                <div className="col d-none">
                  <label>
                    Sick Leave <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    disabled
                    className="form-control"
                    value={this.state.editUserData.sick_leave}
                    onChange={(e) =>
                      this.editUserInfoHandler("sick_leave", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.sick_leave ? error.sick_leave : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="form-group row">
                <div className="col">
                  <label>Basic Salary</label>
                  <Input
                    type="text"
                    min="0"
                    className="form-control"
                    value={this.state.editUserData.basic_salary}
                    onChange={(e) =>
                      this.editUserInfoHandler("basic_salary", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.basic_salary ? error.basic_salary : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col">
                  <label>Special Allowance</label>
                  <Input
                    type="text"
                    min="0"
                    className="form-control"
                    value={this.state.editUserData.special_allowance}
                    onChange={(e) =>
                      this.editUserInfoHandler(
                        "special_allowance",
                        e.target.value
                      )
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.special_allowance ? error.special_allowance : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col">
                  <label>HRA</label>
                  <Input
                    type="text"
                    min="0"
                    className="form-control"
                    value={this.state.editUserData.hra}
                    onChange={(e) =>
                      this.editUserInfoHandler("hra", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.hra ? error.hra : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="form-group row">
                <div className="col-4">
                  <label>TDS</label>
                  <Input
                    type="text"
                    min="0"
                    className="form-control"
                    value={this.state.editUserData.tds}
                    onChange={(e) =>
                      this.editUserInfoHandler("tds", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.tds ? error.tds : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>{" "}
                <div className="col-4">
                  <label>Payment Code</label>
                  <Input
                    type="text"
                    min="0"
                    className="form-control"
                    value={this.state.editUserData.payment_code}
                    onChange={(e) =>
                      this.editUserInfoHandler("payment_code", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.payment_code ? error.payment_code : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-4">
                  <label> NFT / WIB </label>
                  <Input
                    type="select"
                    min="0"
                    className="form-control"
                    value={this.state.editUserData.bank_status}
                    onChange={(e) => this.editUserInfoHandler("bank_status", e.target.value)}
                  >
                     <option>
                      NFT
                    </option>
                    <option>
                      WIB
                    </option>
                  </Input>
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.bank_status ? error.bank_status : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="form-group row">
             <div className="col-4"> <b>PF & ESIC</b></div>
             <div className="col-4"><b>Employee</b></div>
             <div className="col-4"><b>Employer</b></div>
              </div>
              <hr className="mt-1" />
              <div className="form-group row">
                <div className="col-4">
                <div className="d-flex justify-content-start align-items-center">
                    <label className="mr-2 mb-0">PF </label>
                    <div>
                      <input
                        type="checkbox"
                        min="0"
                        className="form-control"
                        checked={this.state.editUserData.pf_check}
                        onChange={(e) =>
                          this.editUserInfoHandler("pf_check", e.target.checked)
                        }
                      />
                    </div>
                  </div>
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.pf_check ? error.pf_check : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-4">
                  <label>Employee PF</label>
                  <Input
                    type="text"
                    min="0"
                    className="form-control"
                    value={this.state.editUserData.pf}
                    disabled={!this.state.editUserData.pf_check}
                    onChange={(e) =>
                      this.editUserInfoHandler("pf", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.pf ? error.pf : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-4">
                  <label>Employer PF</label>
                  <Input
                    type="text"
                    min="0"
                    className="form-control"
                    value={this.state.editUserData.employer_pf}
                    disabled={!this.state.editUserData.pf_check}
                    onChange={(e) =>
                      this.editUserInfoHandler("employer_pf", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.employer_pf ? error.employer_pf : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="form-group row">
                <div className="col-4">
                  <div className="d-flex justify-content-start align-items-center">
                    <label className="mr-2 mb-0">ESIC </label>
                    <div>
                      <input
                        type="checkbox"
                        min="0"
                        className="form-control"
                        checked={this.state.editUserData.esic_check}
                        onChange={(e) =>
                          this.editUserInfoHandler(
                            "esic_check",
                            e.target.checked
                          )
                        }
                      />
                    </div>
                  </div>
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.esic_check ? error.esic_check : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-4">
                  <label>Employee ESIC</label>
                  <Input
                    type="text"
                    min="0"
                    className="form-control"
                    value={this.state.editUserData.esic}
                    disabled={!this.state.editUserData.esic_check}
                    onChange={(e) =>
                      this.editUserInfoHandler("esic", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.esic ? error.esic : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-4">
                  <label>Employer ESIC</label>
                  <Input
                    type="text"
                    min="0"
                    className="form-control"
                    value={this.state.editUserData.employer_esic}
                    disabled={!this.state.editUserData.esic_check}
                    onChange={(e) =>
                      this.editUserInfoHandler("employer_esic", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.employer_esic ? error.employer_esic : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
             
            </form>
            <div className="col-12 p-0">
              {ScsMsg ? <span className="text-success">{ScsMsg}</span> : ""}
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="">
              <button
                className="btn btn-secondary mr-3"
                onClick={this.editModalClose}
              >
                Cancel
              </button>
              {loading ? (
                <Button color="primary">Loading...</Button>
              ) : (
                <button className="btn btn-primary" onClick={this.handleUpdate}>
                  Update
                </button>
              )}
            </div>
          </ModalFooter>
        </Modal>
        {/* delete Modal */}
        <Modal
          size="md"
          isOpen={this.state.deleteModal}
          toggle={() => this.deleteModalClose()}
        >
          <ModalHeader className="" toggle={() => this.deleteModalClose()}>
            Delete User
          </ModalHeader>
          <ModalBody>
            <div className="my-2">
              Please confirm if you want to delete this user?
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="">
              <button
                className="btn btn-secondary mr-3"
                onClick={() => this.deleteModalClose()}
              >
                {" "}
                Cancel{" "}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => this.doDelete()}
              >
                {" "}
                Delete{" "}
              </button>
            </div>
          </ModalFooter>
        </Modal>
        {/* Delete Modal */}
        <Modal
          size="md"
          isOpen={this.state.resetPasswordModal}
          toggle={() => this.resetPasswordModalClose()}
        >
          <ModalHeader
            className=""
            toggle={() => this.resetPasswordModalClose()}
          >
            Reset Password
          </ModalHeader>
          <ModalBody>
            <form className="">
              <div>
                <div className="form-group">
                  <label>
                    Password <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="password"
                    className="form-control"
                    autoComplete="password"
                    value={this.state.resetPasswordData.password}
                    onChange={(e) =>
                      this.resetPasswordInfoHandler("password", e.target.value)
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.password ? error.password : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-group">
                  <label>
                    Confirm Password <strong className="text-danger">*</strong>
                  </label>
                  <Input
                    type="password"
                    className="form-control"
                    autoComplete="password"
                    value={this.state.resetPasswordData.confirm_password}
                    onChange={(e) =>
                      this.resetPasswordInfoHandler(
                        "confirm_password",
                        e.target.value
                      )
                    }
                  />
                  {this.state.error && error ? (
                    <span className="text-danger">
                      {error.confirm_password ? error.confirm_password : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <div className="">
              <button
                className="btn btn-secondary mr-3"
                onClick={this.resetPasswordModalClose}
              >
                {" "}
                Cancel{" "}
              </button>
              {loading ? (
                <Button color="primary">Loading...</Button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={this.doResetPassword}
                >
                  {" "}
                  Update Password{" "}
                </button>
              )}
            </div>
          </ModalFooter>
        </Modal>
        {/* Terminate Modal */}
        <Terminate
          isOpen={this.state.terminateModal}
          isClose={this.terminateModalClose}
          userId={this.state.terminateUserId}
          userList={this.getUsersList}
        />
        <Footer />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { userCounts, usersList, user, activePage, totalItemsCount, limit } =
    state.rootReducer.adminUsers;

  const { departmentList } = state.rootReducer.departments;

  const { error, ScsMsg } = state.rootReducer.adminUsers;
  const { addModal, editModal, resetModal, deleteModal } =
    state.rootReducer.adminUsers;
  const { refreshList, loading } = state.rootReducer.adminUsers;
  const { reportList } = state.rootReducer.report;
  return {
    userCounts,
    usersList,
    departmentList,
    error,
    ScsMsg,
    addModal,
    editModal,
    resetModal,
    deleteModal,
    user,
    refreshList,
    loading,
    activePage,
    totalItemsCount,
    limit,
    reportList,
  };
}

export default connect(mapStateToProps)(Index);
