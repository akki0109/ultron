import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Logo from "../../../../assets/images/logo.svg";
import Nprospect from "../../../../assets/images/nprospect.png";
import ToDoList from "../../../../assets/images/to-do-list.png";
import Rrequest from "../../../../assets/images/request.png";
import Project from "../../../../assets/images/project.png";
import TimeSheet from "../../../../assets/images/timeSheet.png";
import TeamAnalytics from "../../../../assets/images/teamAnalytics.png";
import ActionItem from "../../../../assets/images/actionItem.png";
import regularization from "../../../../assets/images/reg.png";
import Nsetting from "../../../../assets/images/nsetting.png";
import dashboard from "../../../../assets/images/ndashboard.png";
import ProjectAnalytics from "../../../../assets/images/projectanalytics.png";
import AppraisalLogo from "../../../../assets/images/growthLogo.png"
import LeaderBoard from "../../../../assets/images/first-prize.png";
import {
  adminAuthActions,
  adminAttendanceActions,
  adminLeaveActions,
  regularizationActions,
} from "../../../../actions";
import dateFormat from "dateformat";
import socketClient from "socket.io-client";
import { APIURL } from "../../../../constants/config";
import {
  ticketCountRequest,
  openTicketCountRequest,
} from "../../../../services/admin/ticket.services";
import SalaryIcon from "../../../../assets/images/salary-icon.png";
import SalaryPayroll from "../../../../assets/images/payroll.png";
import EmployeeGroup from "../../../../assets/images/employes.png";
import Bell from "../../../../assets/images/Bell.png";
import Notification from "./Notification";
import { notificationService } from "../../../../services/admin/notification.services";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem("user")),
      timeDate: new Date(),
      clockStatus: "loading",
      leaveRequestPendingCount: 0,
      regularizationPendingCount: 0,
      pathname: window.location.pathname,
      ticketCount: 0,
      ticketOpenCount: 0,
      toggleNotification: false,
      notificationCount: 0,
    };
  
    this.handleLogout = this.handleLogout.bind(this);
    this.timer = this.timer.bind(this);
    this.getNotificationNumber = this.getNotificationNumber.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.NotificationRef = createRef(null);
  }

  getUserInitials(Name) {
    if (Name != "") {
      const initials = Name.charAt(0);
      return initials.toUpperCase();
    } else {
      return "";
    }
  }

  handleLogout(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(adminAuthActions.logout());
  }

  handleClockInOut() {
    this.setState({
      clockStatus: "loading",
    });
    this.props.dispatch(
      adminAttendanceActions.clockInOut({ userId: this.state.user.data._id })
    );
  }

  checkClock() {
    this.props.dispatch(
      adminAttendanceActions.checkClock({ userId: this.state.user.data._id })
    );
  }

  getClockStatus(data) {
    if (data.length < 1) {
      this.setState({
        clockStatus: "out",
      });
    } else {
      this.setState({
        clockStatus: "in",
      });
    }
  }

  timer() {
    this.setState({ timeDate: new Date() });
  }

  showClock(data) {
    var socket = socketClient(APIURL, { transports: ["websocket"] });
    socket.emit("attendance", data);
  }

  configureSocket = () => {
    var socket = socketClient(APIURL, { transports: ["websocket"] });
    socket.on("attendance", (data) => {
      if (this.state.user.data._id == data.userId) {
        this.checkClock();
      }
    });

    socket.on("leave", (data) => {
      console.log(data);
      this.getLeaveRequestPending();
    });

    socket.on("regularization", (data) => {
      console.log(data);
      this.getPendingRegularization();
    });

    socket.on("ticketComment", (data) => {
      let ticketUser = data.data.ticketAssignee.filter(
        (assign) => assign.assignTo[0]._id == this.state.user?.data?._id
      );
      if (ticketUser.length > 0) {
        this.getTotalTicketCount();
        this.getTotalOpenTicketCount();
      }
    });

    socket.on("ticket", (data) => {
      let ticketUser = data?.assignTo.filter(
        (assign) => assign._id == this.state.user?.data?._id
      );

      if (ticketUser.length) {
        this.getTotalTicketCount();
        this.getTotalOpenTicketCount();
      }
    });

    socket.on("notification_board", (data) => {
      if (
        this.state.toggleNotification == false &&
        data.userId.includes(this.state.user?.data?._id)
      ) {
        let notificationCount = this.state.notificationCount;
        notificationCount += 1;
        this.setState({ notificationCount: notificationCount });
      }
    });
  };

  getLeaveRequestPending() {
    this.props.dispatch(
      adminLeaveActions.pendingLeaveRequestCount({ search: "" })
    );
  }

  getPendingRegularization() {
    this.props.dispatch(
      regularizationActions.getPendingRegularizationCount({
        reportTo: this.state.user.data._id,
      })
    );
  }

  setLeaveRequestPending(count) {
    this.setState({ leaveRequestPendingCount: count });
  }

  setRegularizationPending(count) {
    this.setState({ regularizationPendingCount: count });
  }

  componentDidMount() {
    this.getNotificationNumber();
    this.checkClock();
    setInterval(this.timer, 1000);
    this.configureSocket();
    this.getLeaveRequestPending();
    this.getPendingRegularization();
    this.getTotalTicketCount();
    this.getTotalOpenTicketCount();
    document.addEventListener("mousedown", this.handleClickOutside);
  }
  getNotificationNumber() {
    notificationService
      .getNotificationCount(this.state.user.data._id)
      .then((result) => {
        if (result.status == 200) {
          this.setState({ notificationCount: result.count });
        } else {
          console.log("error", result);
        }
      });
  }
  getTotalTicketCount() {
    let payload = {
      userId: this.state.user?.data?._id,
      type: "comment",
    };
    // setLoading(true);
    ticketCountRequest(payload)
      .then((data) => {
        if (data.status === 200) {
          console.log("totalTicketCount", data.count);
          this.setState({ ticketCount: data?.count ? data?.count : 0 });
          //     setCommentDescription("");
          //     setLoading(false);
          //     commentListFun(ticketInfo?.tickets?._id);
        } else {
          // setError(data.errors);
          // setLoading(false);
        }
      })
      .catch((error) => {
        console.log("erroes", error);
        // setError(error);
        // setLoading(false);
      });
  }

  getTotalOpenTicketCount() {
    let payload = {
      userId: this.state.user?.data?._id,
    };
    openTicketCountRequest(payload)
      .then((data) => {
        if (data.status === 200) {
          console.log("totalTicketOpenCount", data.count);
          this.setState({ ticketOpenCount: data?.count ? data?.count : 0 });
        }
      })
      .catch((error) => {
        console.log("erroes", error);
      });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.checkClock != undefined) {
      this.getClockStatus(nextProps.checkClock);
      // console.log("clockInOut",nextProps.checkClock);
    }

    if (nextProps.clockInOut != undefined) {
      var data = {
        userId: this.state.user.data._id,
        name: this.state.user.data.first_name,
      };
      this.showClock(data);
      //this.checkClock();
    }
    if (nextProps.adminPendingCount != undefined) {
      this.setLeaveRequestPending(nextProps.adminPendingCount);
    }

    if (nextProps.regularizationCount != undefined) {
      this.setRegularizationPending(nextProps.regularizationCount);
    }
  }

  handleClickOutside(event) {
    if (
      this.NotificationRef.current &&
      !this.NotificationRef.current.contains(event.target)
    )
      this.setState({ toggleNotification: false });
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  NotificationToggle() {
    this.setState({ toggleNotification: !this.state.toggleNotification });
  }
  setNotificationCount() {
    this.setState({ notificationCount: 0 });
  }

  notificationClose() {
    this.setState({ toggleNotification: false });
  }

  render() {
    const { user, clockStatus } = this.state;
    // console.log(user.data.profileImage);
    return (
      <div>
        <aside className="nav-options">
          <Link className="" to="/admin/attendance">
            <Logo className="logo-sml" width="120" />
          </Link>
          <div className="navbar-collapse" id="navbarSupportedContent">
            <ul>
              <li>
                <Link
                  className={`${
                    this.state.pathname.match("/admin/dashboard")
                      ? "active"
                      : ""
                  }`}
                  to="/admin/dashboard"
                >
                  <img src={dashboard} /> Notice Board
                </Link>
              </li>
              <li>
                <Link
                  className={`${
                    this.state.pathname.match("/admin/attendance")
                      ? "active"
                      : ""
                  }`}
                  to="/admin/attendance"
                >
                  <img src={Nprospect} /> Attendance
                </Link>
              </li>
              <li>
                <Link
                  className={`${
                    this.state.pathname.match("/admin/leaves") ? "active" : ""
                  }`}
                  to="/admin/leaves"
                >
                  <img src={ToDoList} /> Leaves
                  {this.state.leaveRequestPendingCount > 0 && (
                    <span className="translate-middle badge rounded-pill nofication_badge">
                      {this.state.leaveRequestPendingCount}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  className={`${
                    this.state.pathname.match("/admin/settings/users") ||
                    this.state.pathname.match("/admin/settings/department") ||
                    this.state.pathname.match("/admin/holidays") ||
                    this.state.pathname.match("/admin/settings/terminate-list")
                      ? "active"
                      : ""
                  }`}
                  to="/admin/settings/users"
                >
                  <img src={Nsetting} /> Organization
                </Link>
              </li>
              <li>
                <Link
                  className={`${
                    this.state.pathname.match("/admin/regularization")
                      ? "active"
                      : ""
                  }`}
                  to="/admin/regularization"
                >
                  <img src={regularization} /> Regularization
                  {this.state.regularizationPendingCount > 0 && (
                    <span className="translate-middle badge rounded-pill nofication_badge">
                      {this.state.regularizationPendingCount}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  className={`${
                    this.state.pathname.match("/admin/leave-request")
                      ? "active"
                      : ""
                  }`}
                  to="/admin/leave-request"
                >
                  <img src={Rrequest} />
                  Leave Request
                  {this.state.leaveRequestPendingCount > 0 && (
                    <span className="translate-middle badge rounded-pill nofication_badge">
                      {this.state.leaveRequestPendingCount}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  className={`${
                    this.state.pathname.match("/admin/projects") ? "active" : ""
                  }`}
                  to="/admin/projects"
                >
                  <img src={Project} />
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  className={`${
                    this.state.pathname.match("/admin/timesheet")
                      ? "active"
                      : ""
                  }`}
                  to="/admin/timesheet"
                >
                  <img src={TimeSheet} />
                  Timesheet
                </Link>
              </li>
              <li>
                <Link
                  className={`${
                    this.state.pathname.match("/admin/report/timesheet")
                      ? "active"
                      : ""
                  }`}
                  to="/admin/report/timesheet"
                >
                  <img src={TeamAnalytics} />
                  Team Analytics
                </Link>
              </li>
              <li>
                <Link
                  className={`${
                    this.state.pathname.match("/admin/projectanalytics")
                      ? "active"
                      : ""
                  }`}
                  to="/admin/projectanalytics"
                >
                  <img src={ProjectAnalytics} />
                  Project Analytics
                </Link>
              </li>
              <li>
                <Link
                  className={`${
                    this.state.pathname.match("/admin/payslip") ? "active" : ""
                  }`}
                  to="/admin/payslip"
                >
                  <img src={SalaryIcon} />
                  Salary
                </Link>
              </li>
              <li>
                <Link
                  className={`${
                    this.state.pathname.match("/admin/salarySlip") ? "active" : ""
                  }`}
                  to="/admin/salarySlip"
                >
                  <img src={SalaryPayroll} style={{opacity:"0.5"}}/>
                  Payroll
                </Link>
              </li>
              {/* <li>
                <Link
                  
                  to="/admin/skill"
                >
                  <img src={AppraisalLogo} style={{opacity:"0.5"}}/>
                  Appraisal
                </Link>
              </li> */}
              <li>
                <Link
                  className={`${
                    this.state.pathname.match(
                      "/" +
                        this.state.user.data.user_role.toLowerCase() +
                        "/ticke"
                    )
                      ? "active"
                      : ""
                  }`}
                  to={
                    "/" +
                    this.state.user.data.user_role.toLowerCase() +
                    "/ticket"
                  }
                >
                  <img src={ActionItem} /> Action Items
                  {this.state.ticketOpenCount > 0 && (
                    <span
                      className={`translate-middle badge rounded-pill nofication_badge ${
                        this.state.ticketCount > 0 ? " more_ntf " : ""
                      }`}
                    >
                      {this.state.ticketOpenCount}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  className={`${
                    this.state.pathname.match(
                      "/" +
                        this.state.user.data.user_role.toLowerCase() +
                        "/organization-chart"
                    )
                      ? "active"
                      : ""
                  }`}
                  to={
                    "/" +
                    this.state.user.data.user_role.toLowerCase() +
                    "/organization-chart"
                  }
                >
                  <img src={EmployeeGroup} /> Organization Chart
                </Link>
              </li>
              <li>
                <Link
                  className={`${
                    this.state.pathname.match(
                      "/" +
                        this.state.user.data.user_role.toLowerCase() +
                        "/leaderboard"
                    )
                      ? "active"
                      : ""
                  }`}
                  to={
                    "/" +
                    this.state.user.data.user_role.toLowerCase() +
                    "/leaderboard"
                  }
                >
                  <img src={LeaderBoard} style={{opacity:"0.5"}}/> Leader Board
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        <nav className="navbar navbar-expand-lg fixed-top">
          <div className="navbar-logo">
            <span className="subhead">
              <span className="date-box">
                <span style={{ width: "150px", textAlign: "right" }}>
                  {this.state.timeDate.toLocaleTimeString()}
                </span>
                <small>
                  {dateFormat(this.state.timeDate, "ddd, dd mmmm  yyyy")}
                </small>
              </span>
              {clockStatus == "loading" && (
                <a href="javascript:;" className="btn  ml-4 mobilehide">
                  Loading ...
                </a>
              )}
              {clockStatus == "in" && (
                <a
                  href="javascript:;"
                  onClick={() => this.handleClockInOut()}
                  className="btn btn-danger ml-4 mobilehide"
                >
                  Punch-out
                </a>
              )}
              {clockStatus == "out" && (
                <a
                  href="javascript:;"
                  onClick={() => this.handleClockInOut()}
                  className="btn in_btn ml-4 mobilehide"
                >
                  Punch-in
                </a>
              )}
            </span>
          </div>
          <div className="my-2 my-lg-0">
            <div className="ml-auto userinfo">
              <div
                className="notification-list mr-5"
                ref={this.NotificationRef}
              >
                <div
                  style={{ display: "absolute", cursor: "pointer" }}
                  onClick={() =>
                    this.setState({
                      toggleNotification: !this.state.toggleNotification,
                    })
                  }
                >
                  <img src={Bell} alt="Notification" width={28} />

                  <span
                    className="translate-middle badge rounded-pill nofication_badge d-inline notification-positionaning"
                    style={{
                      visibility:
                        this.state.notificationCount > 0 ? "visible" : "hidden",
                    }}
                  >
                    {this.state.notificationCount}
                  </span>
                </div>
                {this.state.toggleNotification && (
                  <Notification
                    userId={this.state.user.data._id}
                    setNotificationCount={this.setNotificationCount.bind(this)}
                    setToggle={this.notificationClose.bind(this)}
                  />
                )}
              </div>
              <div className="user-area dropdown">
                <a
                  className="icon__mg dropdown-toggle"
                  href=""
                  type="button"
                  id="navbarDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user &&
                  user.data.profileImage != "" &&
                  user.data.profileImage != undefined ? (
                    // <img src={APIURL + "./assets/profileImages/" + user.data.profileImage} className="avtar" alt="Employee image" />
                    <img
                      src={
                        APIURL +
                        "assets/uploads/profileImages/" +
                        user.data.profileImage
                      }
                      className="avtar"
                      alt="Employee image"
                    />
                  ) : (
                    <div className="avtar">
                      {this.getUserInitials(user.data.first_name) +
                        this.getUserInitials(user.data.last_name)}
                    </div>
                  )}

                  <span className="hide-mobile">
                    {user && user.data.first_name + " " + user.data.last_name}
                  </span>
                </a>

                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <Link
                    className="dropdown-item"
                    to="/admin/edit-profile"
                    style={{ padding: "0.3rem 1.5rem" }}
                  >
                    Edit Profile
                  </Link>
                  {/* <Link className="dropdown-item" to="/admin/change-password">Change Password</Link> */}
                  <div className="dropdown-divider"></div>
                  <a
                    className="dropdown-item"
                    href=""
                    onClick={this.handleLogout}
                    style={{ padding: "0.3rem 1.5rem" }}
                  >
                    Logout
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { loggingIn } = state.rootReducer.adminAuthentication;
  const { user } = state.rootReducer.adminAuthentication;
  const { checkClock, clockInOut } = state.rootReducer.adminAttendances;

  const { adminPendingCount } = state.rootReducer.adminLeaves;
  const { regularizationCount } = state.rootReducer.regularization;

  return {
    loggingIn,
    user,
    checkClock,
    clockInOut,
    adminPendingCount,
    regularizationCount,
  };
}

export default connect(mapStateToProps)(Navbar);
