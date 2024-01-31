import React, { Component, Suspense, lazy } from "react";
import "../src/assets/css/bootstrap.min.css";
import "../src/assets/css/style.css";
import { Router, Route } from "react-router-dom";
import { connect } from "react-redux";
import Home from "./components/Home/Index";
import Varify from "./components/Home/Varify";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import AdminDashboard from "./components/Users/Admin/Dashboard/Index";
import AdminUsers from "./components/Users/Admin/Users/Index";
import AdminAttendance from "./components/Users/Admin/Attendance/Index";
import AdminLeave from "./components/Users/Admin/Leave/Index";
import AdminSetting from "./components/Users/Admin/Setting/User/Index";
import Departments from "./components/Users/Admin/Setting/Department/Index";
import AdminEmployeeRequests from "./components/Users/Admin/Regularization/Index";
import AdminLeaveRequest from "./components/Users/Admin/LeaveRequest/Index";
import AdminHolidays from "./components/Users/Admin/Holiday/Index";
import AdminSalary from "./components/Users/Admin/Salary/Index";
import AdminProject from "./components/Users/Admin/Project/Index";

import EmployeeProject from "./components/Users/Employee/Project/Index";
import EmployeeDashboard from "./components/Users/Employee/Dashboard/Index";
import EmployeeAttendance from "./components/Users/Employee/Attendance/Index";
import EmployeeRequests from "./components/Users/Employee/Regularization/Index";
// import EmployeeSetting from "./components/Users/Employee/Setting/User/Index";
import EmployeeLeave from "./components/Users/Employee/Leave/Index";
// import ChangePassword from "./components/Users/Employee/User/ChangePassword";
// import EditProfile from "./components/Users/Employee/User/EditProfile";
import AdminEditProfile from "./components/Users/Admin/Setting/Profile/Index";
import AdminChangePassword from "./components/Users/Admin/Setting/ChangePassword/Index";
import ChangePassword from "./components/Users/Employee/Setting/ChangePassword/Index";
import EditProfile from "./components/Users/Employee/Setting/Profile/Index";
import Date from "./components/Users/Employee/Date/Index";
import LeaveRequest from "./components/Users/Employee/LeaveRequest/Index";
import LeaveReject from "./components/Users/Employee/LeaveReject/Index";
import TerminateList from "./components/Users/Admin/Setting/TerminateList";
import Timesheet from "./components/Users/Employee/Timesheet/Index";
import AdminTimesheet from "./components/Users/Admin/Timesheet/Index";
import Taskboard from "./components/Users/Admin/Taskboard";

import TeamAnalyticsAdmin from "./components/Users/Admin/TeamAnalytics/Index";
import TeamAnalyticsEmployee from "./components/Users/Employee/TeamAnalytics/Index";
import ProjectAnalyticsAdmin from "./components/Users/Admin/ProjectAnalytics";
import ProjectAnalyticsEmployee from "./components/Users/Employee/ProjectAnalytics";
import LeaderBoardInEmployee from "./components/Users/Employee/LeaderBoard";
import Ticket from "./components/Users/Admin/Ticket/Index";
import Logo  from "./assets/images/logo-png.png";
import plusregular  from "./assets/font/PlusJakartaSans-Regular.ttf";
import plusmedium  from "./assets/font/PlusJakartaSans-Medium.ttf";
import Plusbold  from "./assets/font/PlusJakartaSans-Bold.ttf";
import Plussemibold  from "./assets/font/PlusJakartaSans-SemiBold.ttf";
import { history } from "./helpers";
import { alertActions } from "./actions";
import OrganizationChart from "./components/Users/Admin/OrganizationChart/Index";
const SalarySlip = lazy(() => import("counter/Counter"));
const Appraisal = lazy(()=>import("app/App"));
import PageNotFound from "./components/page_Not_Found/Index"
import { Switch } from "react-router-dom/cjs/react-router-dom.min";
import LeaderBoard from "./components/Users/Admin/LeaderBoard";
import Attendance from "./components/Users/Admin/newAttendance";

const Assets = {
  Logo,
  plusregular,
  plusmedium,
  Plusbold,
  Plussemibold,
}
class App extends Component {
  constructor(props) {
    super(props);

    const { dispatch } = this.props;
    history.listen((location, action) => {
      // clear alert on location change
      console.log(location, action);
      dispatch(alertActions.clear());
    });
  }

  render() {
    //const login = localStorage.getItem("isLoggedIn");
    return (
      <div>
        <Suspense>
          <Router history={history}>
            <div>
          <Switch>

              <Route exact path="/" component={Home} />
              <Route exact path="/forgot-password" component={ForgotPassword} />
              <Route
                exact
                path="/password/reset/:token"
                component={ResetPassword}
              />
              <Route path="/user/verify/:id/:token" component={Varify} />
              <Route exact path="/admin/dashboard" component={AdminDashboard} />
              <Route
                exact
                path="/admin/attendance"
                component={AdminAttendance}
              />
              <Route exact path="/admin/leaves" component={AdminLeave} />
              <Route
                exact
                path="/admin/settings/users"
                component={AdminSetting}
              />
              <Route
                exact
                path="/admin/settings/terminate-list"
                component={TerminateList}
              />
              <Route exact path="/admin/users" component={AdminUsers} />
              <Route
                exact
                path="/admin/settings/department"
                component={Departments}
              />
              <Route
                exact
                path="/admin/edit-profile"
                component={AdminEditProfile}
              />
              <Route
                exact
                path="/admin/change-password"
                component={AdminChangePassword}
              />
              <Route
                exact
                path="/admin/regularization"
                component={AdminEmployeeRequests}
              />
              <Route
                exact
                path="/admin/leave-request"
                component={AdminLeaveRequest}
              />
              <Route exact path="/admin/holidays" component={AdminHolidays} />
              <Route exact path="/admin/payslip" component={AdminSalary} />
              <Route path="/admin/projects" component={AdminProject} />
              <Route path="/admin/timesheet" component={AdminTimesheet} />
              <Route path="/admin/newAttendance" component={Attendance}/>
              <Route
                path="/admin/report/timesheet"
                component={TeamAnalyticsAdmin}
              />
              <Route
                path="/admin/projectanalytics"
                component={ProjectAnalyticsAdmin}
              />
              <Route path="/:role/taskboard/:id" component={Taskboard} />
              <Route
                path="/admin/organization-chart"
                component={OrganizationChart}
              />
              <Route path="/admin/leaderboard" component={LeaderBoard}/>
              <Route
                exact
                path="/employee/dashboard"
                component={EmployeeDashboard}
              />
              <Route
                exact
                path="/employee/leaderboard"
                component={LeaderBoardInEmployee}
              />
              <Route
                exact
                path="/employee/attendance"
                component={EmployeeAttendance}
              />
              <Route
                exact
                path="/employee/regularization"
                component={EmployeeRequests}
              />
              {/* <Route exact path="/employee/settings/users" component={EmployeeSetting} /> */}
              <Route exact path="/employee/leaves" component={EmployeeLeave} />
              <Route
                path="/employee/change-password"
                component={ChangePassword}
              />
              <Route path="/employee/edit-profile" component={EditProfile} />
              <Route exact path="/employee/date" component={Date} />
              <Route
                exact
                path="/employee/leave-request"
                component={LeaveRequest}
              />
              <Route
                exact
                path="/employee/leaves-rejected"
                component={LeaveReject}
              />
              <Route
                exact
                path="/employee/projects"
                component={EmployeeProject}
              />
              <Route exact path="/employee/timesheet" component={Timesheet} />

              <Route
                exact
                path="/employee/report/timesheet"
                component={TeamAnalyticsEmployee}
              />
              <Route
                exact
                path="/employee/projectanalytics"
                component={ProjectAnalyticsEmployee}
              />
              <Route exact path="/:role/ticket" component={Ticket} />
              <Route path="/admin/salarySlip" component={()=><SalarySlip assets={Assets}/>} />
              <Route exact path="/admin/skill"component={Appraisal} />
              <Route exact path="/admin/appraisalform" component={Appraisal}/>
              <Route exact path="/admin/appraisallist" component={Appraisal} />
              <Route exact path="/admin/editAppraisal/:id" component={Appraisal} />
              <Route exact path="/admin/appraisalrequest" component={Appraisal} />
              <Route exact path="/admin/approverequest/:id"component={Appraisal} />
 
              <Route exact path="/employee/appraisalform" component={Appraisal} />
              <Route exact path="/employee/appraisallist" component={Appraisal} />
              <Route exact path="/employee/editappraisal/:id" component={Appraisal} />
              <Route exact path="/employee/historyappraisal/:id" component={Appraisal} />
              <Route exact path="/employee/appraisalrequest" component={Appraisal}/>
              <Route exact path="/employee/approveAppraisal/:id" component={Appraisal} />
              <Route exact path="*" component={PageNotFound} />
            </Switch>

            </div>
          </Router>
        </Suspense>
      </div>
    );
  }
}

export default connect()(App);
