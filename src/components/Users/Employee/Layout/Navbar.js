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
import regularization from "../../../../assets/images/reg.png";
import dashboard from "../../../../assets/images/ndashboard.png";
import ActionItem from "../../../../assets/images/actionItem.png";
import LeaderBoard from "../../../../assets/images/first-prize.png";
import {
  authActions,
  attendanceActions,
  leaveActions,
  regularizationActions,
} from "../../../../actions";
import dateFormat from "dateformat";
import socketClient from "socket.io-client";
import { APIURL } from "../../../../constants/config";

import ProjectAnalytics from "../../../../assets/images/projectanalytics.png";

import {
  ticketCountRequest,
  openTicketCountRequest,
} from "../../../../services/admin/ticket.services";
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
      leavePendingCount: 0,
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
    dispatch(authActions.logout());
  }

  handleClockInOut() {
    this.setState({
      clockStatus: "loading",
    });
    this.props.dispatch(
      attendanceActions.clockInOut({ userId: this.state.user.data._id })
    );
  }

  checkClock() {
    this.props.dispatch(
      attendanceActions.checkClock({ userId: this.state.user.data._id })
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
      this.pendingLeaveCount();
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

  pendingLeaveCount() {
    this.props.dispatch(
      leaveActions.pendingLeaveRequestWithSelfCount({
        userId: this.state.user.data._id,
        reportTo: this.state.user.data._id,
      })
    );
  }

  getLeaveRequestPending() {
    this.props.dispatch(
      leaveActions.pendingLeaveRequestCount({
        reportTo: this.state.user.data._id,
      })
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

  setLeavePending(count) {
    this.setState({ leavePendingCount: count });
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
    this.pendingLeaveCount();
    this.getTotalTicketCount();
    this.getTotalOpenTicketCount();
    document.addEventListener("mousedown", this.handleClickOutside);
  }
  handleClickOutside(event) {
    if (
      this.NotificationRef.current &&
      !this.NotificationRef.current.contains(event.target)
    )
      this.setState({ toggleNotification: false });
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
        } else {
          // setLoading(false);
        }
      })
      .catch((error) => {
        console.log("erroes", error);
        // setError(error);
        // setLoading(false);
      });
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
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

    if (nextProps.pendingCount != undefined) {
      this.setLeaveRequestPending(nextProps.pendingCount);
    }

    if (nextProps.pendingSelfWithTeamCount != undefined) {
      this.setLeavePending(nextProps.pendingSelfWithTeamCount);
    }

    if (nextProps.regularizationCount != undefined) {
      this.setRegularizationPending(nextProps.regularizationCount);
    }
  }

  setNotificationCount() {
    this.setState({ notificationCount: 0 });
  }

  notificationClose() {
    this.setState({ toggleNotification: false });
  }
  render() {
    const { user, clockStatus } = this.state;
    return (
      <div>
        <aside className="nav-options">
          <Link className="" to="/employee/attendance">
            <Logo className="logo-sml" width="120" />
          </Link>
          <div className="navbar-collapse" id="navbarSupportedContent">
            <ul>
              <li>
                <Link
                  className={`${
                    this.state.pathname.match("/employee/dashboard")
                      ? "active"
                      : ""
                  }`}
                  to="/employee/dashboard"
                >
                  <img src={dashboard} /> Notice Board{" "}
                </Link>
              </li>
              <li>
                <Link
                  className={`${
                    this.state.pathname.match("/employee/attendance")
                      ? "active"
                      : ""
                  }`}
                  to="/employee/attendance"
                >
                  <img src={Nprospect} /> Attendance{" "}
                </Link>
              </li>
              <li>
                <Link
                  className={`${
                    this.state.pathname.match("/employee/regularization")
                      ? "active"
                      : ""
                  }`}
                  to="/employee/regularization"
                >
                  <img src={regularization} /> Regularization{" "}
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
                    this.state.pathname.match("/employee/leaves")
                      ? "active"
                      : ""
                  }`}
                  to="/employee/leaves"
                >
                  <img src={ToDoList} /> Leaves{" "}
                  {this.state.leavePendingCount > 0 && (
                    <span className="translate-middle badge rounded-pill nofication_badge">
                      {this.state.leavePendingCount}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  className={`${
                    this.state.pathname.match("/employee/leave-request")
                      ? "active"
                      : ""
                  }`}
                  to="/employee/leave-request"
                >
                  <img src={Rrequest} />
                  Leave Request{" "}
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
                    this.state.pathname.match("/employee/projects")
                      ? "active"
                      : ""
                  }`}
                  to="/employee/projects"
                >
                  <img src={Project} /> Projects{" "}
                </Link>
              </li>
              <li>
                <Link
                  className={`${
                    this.state.pathname.match("/employee/timesheet")
                      ? "active"
                      : ""
                  }`}
                  to="/employee/timesheet"
                >
                  <img src={TimeSheet} /> Timesheet{" "}
                </Link>
              </li>
              <li>
                <Link
                  className={`${
                    this.state.pathname.match("/employee/report/timesheet")
                      ? "active"
                      : ""
                  }`}
                  to="/employee/report/timesheet"
                >
                  <img src={TeamAnalytics} /> Team Analytics{" "}
                </Link>
              </li>

              <li>
                <Link
                  className={`${
                    this.state.pathname.match("/employee/projectanalytics")
                      ? "active"
                      : ""
                  }`}
                  to="/employee/projectanalytics"
                >
                  <img src={ProjectAnalytics} /> Project Analytics{" "}
                </Link>
              </li>

              {/* <li><Link className={`${this.state.pathname.match("/"+(this.state.user.data.user_role).toLowerCase()+"/ticke") ? "active" : ""}`} to={"/"+(this.state.user.data.user_role).toLowerCase()+"/ticket"}><img src={TeamAnalytics} />Ticket </Link></li> */}
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
                  <img src={ActionItem} />
                  Action Items{" "}
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
                  <img src={LeaderBoard} style={{opacity:"0.5"}}/>
                  Leader Board
                </Link>
              </li>
              {/* <li>
                <Link
                
                to={this.state.user.data.user_role=="Admin"?("/employee/skill"):("/employee/Appraisallist")}
                >
                  <img src={ProjectAnalytics} />
                  Appraisal
                </Link>
              </li> */}
            </ul>
          </div>
        </aside>

        <nav className="navbar navbar-expand-lg fixed-top">
          <div className="navbar-logo">
            <span className="subhead">
              <span className="date-box">
                <span style={{ width: "150px", textAlign: "right" }}>
                  {" "}
                  {this.state.timeDate.toLocaleTimeString()}{" "}
                </span>
                <small>
                  {dateFormat(this.state.timeDate, "ddd, dd mmmm  yyyy")}
                </small>
              </span>
              {clockStatus == "loading" && (
                <a href="javascript:;" className="btn  ml-4">
                  Loading ...
                </a>
              )}
              {clockStatus == "in" && (
                <a
                  href="javascript:;"
                  onClick={() => this.handleClockInOut()}
                  className="btn btn-danger ml-4"
                >
                  Punch-out{" "}
                </a>
              )}
              {clockStatus == "out" && (
                <a
                  href="javascript:;"
                  onClick={() => this.handleClockInOut()}
                  className="btn in_btn ml-4"
                >
                  Punch-in{" "}
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
                    to="/employee/edit-profile"
                    style={{ padding: "0.3rem 1.5rem" }}
                  >
                    Edit Profile
                  </Link>
                  {/* <Link
                    className="dropdown-item"
                    to="/employee/change-password"
                  >
                    Change Password
                  </Link> */}
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
  const { loggingIn } = state.rootReducer.authentication;
  const { user } = state.rootReducer.authentication;
  const { checkClock, clockInOut } = state.rootReducer.attendances;
  const { pendingCount, pendingSelfWithTeamCount } = state.rootReducer.leaves;
  const { regularizationCount } = state.rootReducer.regularization;

  return {
    loggingIn,
    user,
    checkClock,
    clockInOut,
    pendingCount,
    pendingSelfWithTeamCount,
    regularizationCount,
  };
}

export default connect(mapStateToProps)(Navbar);
//export default connect()(Navbar);
