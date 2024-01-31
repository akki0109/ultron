import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Footer from "../../../GlobalComponents/Footer";
import Navbar from "../Layout/Navbar";
import cake from "../../../../assets/images/cake.png";
import workAnniverysary from "../../../../assets/images/work_anniverysary1.png";
import leave from "../../../../assets/images/working.png";
import Termination from "../../../../assets/images/termination.png";
import Probation from "../../../../assets/images/probation.png";
import empPicture from "../../../../assets/images/emp_img1.jpg";
import { adminDashboardActions, HoliDayActions } from "../../../../actions";
import dateFormat from "dateformat";
import { APIURL } from "../../../../constants/config";

import NoticeBoard from "./NoticeBoard";
const LeaveName = {
  first_half: "first half",
  second_half: "second half",
  full_day: "full day",
};
const nextSeventhDate = () => {
  let myDate = new Date();
  let plusSeven = new Date(myDate.setDate(myDate.getDate() + 7));
  return plusSeven;
};
const oneDayAterDate = () => {
  let myDate = new Date();
  let plusSeven = new Date(myDate.setDate(myDate.getDate() + 1));
  return plusSeven;
};
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem("user")),
      from_date: new Date(new Date().getFullYear(), 0, 1),
      to_date: new Date(),
      birthList: [],
      anniversaryList: [],
      onLeaveList: [],
      leave_from_date: new Date(),
      leave_to_date: new Date(),
      current_date: new Date(),
      work_form_date: new Date(),
      work_to_date: new Date(),
      holidayList: [],
      leaveNorecorde: false,
      holidayNorecorde: false,
      workAnniverysaryNoRecorde: false,
      birthDayNorecorde: false,
      terminateList: [],
      probationList: [],
      formatCurrentDate: {
        from_date: dateFormat(this.current_date, "yyyy-mm-dd"),
        to_date: dateFormat(this.current_date, "yyyy-mm-dd"),
      },
      formatSeventhDate: {
        from_date: dateFormat(oneDayAterDate(), "yyyy-mm-dd"),
        to_date: dateFormat(nextSeventhDate(), "yyyy-mm-dd"),
      },
      toggleAll: {
        termination: true,
        Probation: true,
        Anniversaries: true,
        Birthdays: true,
        Holidays: true,
        Leave: true,
      },
    };
    this.getOnLeaveList = this.getOnLeaveList.bind(this);
    this.probationExpiryList = this.probationExpiryList.bind(this);
    this.terminationList = this.terminationList.bind(this);
    this.getProbationList = this.getProbationList.bind(this);
    this.getCurrentYearFormat = this.getCurrentYearFormat.bind(this);
  }

  getOnLeaveList(date) {
    this.props.dispatch(adminDashboardActions.getOnLeaveList(date));
  }
  getWorkAnniversaryList(date) {
    this.props.dispatch(adminDashboardActions.getWorkAnniversaryList(date));
  }
  getBirthdayList(date) {
    this.props.dispatch(adminDashboardActions.getBirthdayList(date));
  }
  getHolidayList() {
    this.props.dispatch(
      HoliDayActions.filterHolidayList({
        from_date: this.state.current_date,
        to_date: dateFormat(this.state.current_date, "yyyy") + "-12-31",
      })
    );
  }
  showBirthDayList(data1) {
    this.setState({
      birthList: data1,
      birthDayNorecorde: true,
    });
  }
  ShowAnniversaryList(data2) {
    this.setState({
      anniversaryList: data2,
      workAnniverysaryNoRecorde: true,
    });
  }
  ShowOnLeaveList(data3) {
    this.setState({
      onLeaveList: data3,
      leaveNorecorde: true,
    });
  }
  showHolidayList(data4) {
    let sortedCars1 = data4.sort((a, b) =>
      a.from_date
        .split("/")
        .reverse()
        .join()
        .localeCompare(b.from_date.split("/").reverse().join())
    );
    this.setState({
      holidayList: sortedCars1,
      holidayNorecorde: true,
    });
  }

  probationExpiryList(date) {
    adminDashboardActions.probationList(date).then((result) => {
      this.setState({ probationList: result.data });
    });
  }

  terminationList(date) {
    adminDashboardActions.currentTerminateList(date).then((result) => {
      this.setState({ terminateList: result.data });
    });
  }

  componentDidMount() {
    this.getOnLeaveList(this.state.formatCurrentDate);
    this.getWorkAnniversaryList(this.state.formatCurrentDate);
    this.getBirthdayList(this.state.formatCurrentDate);
    this.getHolidayList();
    this.probationExpiryList(this.state.formatCurrentDate);
    this.terminationList(this.state.formatCurrentDate);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.birthDayList != undefined) {
      this.showBirthDayList(nextProps.birthDayList);
    }
    if (nextProps.anniversaryList != undefined) {
      this.ShowAnniversaryList(nextProps.anniversaryList);
    }
    if (nextProps.onLeaveList != undefined) {
      this.ShowOnLeaveList(nextProps.onLeaveList);
    }
    if (nextProps.holidaysList != undefined) {
      this.showHolidayList(nextProps.holidaysList);
    }
  }

  getProbationList(date, toggleValue) {
    this.setState({
      toggleAll: { ...this.state.toggleAll, Probation: toggleValue },
    });
    this.probationExpiryList(date);
  }

  getTerminationList(date, toggleValue) {
    this.setState({
      toggleAll: {
        ...this.state.toggleAll,
        termination: toggleValue,
      },
    });
    this.terminationList(date);
  }

  getWorkAnniversary(date, toggleValue) {
    this.setState({
      toggleAll: {
        ...this.state.toggleAll,
        Anniversaries: toggleValue,
      },
    });
    this.getWorkAnniversaryList(date);
  }
  getBirthday(date, toggleValue) {
    this.setState({
      toggleAll: {
        ...this.state.toggleAll,
        Birthdays: toggleValue,
      },
    });
    this.getBirthdayList(date);
  }

  getLeave(date, toggleValue) {
    this.setState({
      toggleAll: {
        ...this.state.toggleAll,
        Leave: toggleValue,
      },
    });

    this.getOnLeaveList(date);
  }

  getCurrentYearFormat(date) {
    let oldDate = new Date(date);
    let Month = oldDate.getMonth() + 1;
    let day = oldDate.getDate();
    let year = this.state.current_date.getFullYear();

    return `${year}-${Month}-${day}`;
  }
  render() {
    if (!this.state.user) {
      return <Redirect to="/" />;
    }
    if (this.state.user.data.user_role !== "Admin") {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <Navbar activePage="dashboard" />
        <Footer />
        <main className="offset overflow-initial dashboard_small">
          <div className="container-fluid hard-pad p-0">
            <div className="hard-pad">
              <div className="row align-items-center pt-4 border-mobile">
                <div className="col-lg-4 col-6">
                  <h2 className="page-heading"> Notice Board</h2>
                </div>
              </div>
            </div>

            <div className="row mt-2 dashboard_info_box">
              <div className="col-lg-12">
                <NoticeBoard />
              </div>

              {/* <div className="col-lg-4">
                                <div className="card ">
                                    <div className="card-header d-flex justify-content-between">
                                        <span className="text_primary">On Leave Today</span>
                                        <span className="numbers_of"> {this.state.onLeaveList ? this.state.onLeaveList.length : ""}</span>
                                    </div>

                                    <div className="card-body record_box">
                                        {this.state.onLeaveList && this.state.leaveNorecorde === true && this.state.onLeaveList.length == 0 ?
                                            <div className="media record_info common_box align-items-center">
                                                <img src={leave} className="common_img img-fluid" alt="Employee image" />
                                                <div className="media-body">
                                                    <p className="lh1 mb-0">Everyone working today!</p>
                                                </div>
                                            </div> : ""}

                                        {this.state.onLeaveList && this.state.onLeaveList.map((item, i) => (
                                            <div key={i} className="media record_info align-items-center">
                                                {item.leaveRequestBy[0].profileImagePath != undefined ?
                                                    <div className="mr-2 emp_img"><img src={APIURL + "/" + item.leaveRequestBy[0].profileImagePath} alt="Employee image" /></div>
                                                    :
                                                    <div className="mr-2 emp_img"><img src={empPicture} alt="Employee image" /></div>
                                                }
                                                <div className="media-body">
                                                    <h6 className="noticelist__cnt--nm">{item.leaveRequestBy[0].first_name} {item.leaveRequestBy[0].last_name}</h6>
                                                    <small className="small"><strong>{dateFormat(item.leaves.from_date, "ddd, dd mmm")}  - {dateFormat(item.leaves.to_date, "ddd, dd mmm")}</strong></small>
                                                    <div>
                                                        <small>
                                                            {dateFormat(item.leaves.from_date, "yyyy-mm-dd") != dateFormat(item.leaves.to_date, "yyyy-mm-dd") &&
                                                                <span>{LeaveName[item.leaves.from_date_half]} - {LeaveName[item.leaves.to_date_half]}</span>
                                                            }
                                                            <span className="ml-1">({item.leaves.leave_count} {item.leaves.leave_count > 1 ? "days" : "day"})</span>
                                                        </small>
                                                    </div>

                                                </div>

                                            </div>


                                        ))}
                                    </div>
                                </div>
                            </div> */}
            </div>
          </div>
        </main>
        <div className="right-aside right_large">
          <div className="row mt-2 p-4 dashboard_info_box">
            <div className="col-lg-12">
              <div className="card ">
                <div className="card-header d-flex justify-content-between">
                  <span className="text_primary">On Leave Today</span>
                  <span className="numbers_of">
                    {" "}
                    {this.state.onLeaveList
                      ? this.state.onLeaveList.length
                      : ""}
                  </span>
                </div>
                <div>
                  <span
                    className={
                      this.state.toggleAll.Leave
                        ? "Today_Person TodayUpcommingActive"
                        : "Today_Person"
                    }
                    onClick={() =>
                      this.getLeave(this.state.formatCurrentDate, true)
                    }
                  >
                    Today
                  </span>
                  <span
                    className={
                      this.state.toggleAll.Leave
                        ? "Upcomming_Person"
                        : "Upcomming_Person TodayUpcommingActive"
                    }
                    onClick={() =>
                      this.getLeave(this.state.formatSeventhDate, false)
                    }
                  >
                    Upcoming
                  </span>
                </div>

                <div className="card-body record_box">
                  {this.state.leaveNorecorde === true &&
                  this.state.onLeaveList.length == 0 ? (
                    <div className="media record_info common_box align-items-center">
                      <img
                        src={leave}
                        className="common_img img-fluid"
                        alt="Employee image"
                      />
                      <div className="media-body">
                        <p className="lh1 mb-0" style={{ fontSize: "14px" }}>
                          {this.state.toggleAll.Leave
                            ? "Everyone is working today!"
                            : "No one is on leave for the upcoming seven days."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  {this.state.onLeaveList.length > 0 &&
                    this.state.onLeaveList.map((item, i) => (
                      <div
                        key={i}
                        className="media record_info align-items-center"
                      >
                        {item.leaveRequestBy[0].profileImagePath !=
                        undefined ? (
                          <div className="mr-2 emp_img">
                            <img
                              src={
                                APIURL +
                                "/" +
                                item.leaveRequestBy[0].profileImagePath
                              }
                              alt="Employee image"
                            />
                          </div>
                        ) : (
                          <div className="mr-2 emp_img">
                            <img src={empPicture} alt="Employee image" />
                          </div>
                        )}
                        <div className="media-body">
                          <h6 className="noticelist__cnt--nm">
                            {item.leaveRequestBy[0].first_name}{" "}
                            {item.leaveRequestBy[0].last_name}
                          </h6>
                          <small className="small">
                            <strong>
                              {dateFormat(item.leaves.from_date, "ddd, dd mmm")}{" "}
                              - {dateFormat(item.leaves.to_date, "ddd, dd mmm")}
                            </strong>
                          </small>
                          <div>
                            <small>
                              {dateFormat(
                                item.leaves.from_date,
                                "yyyy-mm-dd"
                              ) !=
                                dateFormat(
                                  item.leaves.to_date,
                                  "yyyy-mm-dd"
                                ) && (
                                <span>
                                  {LeaveName[item.leaves.from_date_half]} -{" "}
                                  {LeaveName[item.leaves.to_date_half]}
                                </span>
                              )}
                              <span className="ml-1">
                                ({item.leaves.leave_count}{" "}
                                {item.leaves.leave_count > 1 ? "days" : "day"})
                              </span>
                            </small>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-2 p-4 dashboard_info_box">
            <div className="col-lg-12">
              <div className="card ">
                <div className="card-header">
                  <span className="text_primary">Holidays</span>
                </div>
                <div className="card-body holiday_box">
                  <div
                    id="holider_slider"
                    className="carousel slide"
                    data-interval="false"
                  >
                    <div className="carousel-inner">
                      {this.state.holidayList &&
                        this.state.holidayNorecorde == true &&
                        this.state.holidayList.map((item, i) => (
                          <div
                            key={i}
                            className={
                              i == 0 ? "carousel-item active" : "carousel-item"
                            }
                          >
                            <div className="carousel-caption">
                              <div className="media record_info common_box align-items-center">
                                {/* <img src={Dussehra} className="mr-3 common_img img-fluid" alt="Employee image" /> */}
                                <div className="media-body">
                                  <h4 className="lh1">{item.title}</h4>
                                  <small>
                                    {dateFormat(item.from_date, "ddd, dd mmm")}{" "}
                                    - {dateFormat(item.to_date, "ddd, dd mmm")}
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    <a
                      className="carousel-control-prev"
                      href="#holider_slider"
                      role="button"
                      data-slide="prev"
                    >
                      <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="sr-only">Previous</span>
                    </a>
                    <a
                      className="carousel-control-next"
                      href="#holider_slider"
                      role="button"
                      data-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="sr-only">Next</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-2 p-4 dashboard_info_box">
            <div className="col-lg-12">
              <div className="card ">
                <div className="card-header d-flex justify-content-between">
                  <span className="text_primary">Birthdays</span>
                  <span className="numbers_of ">
                    {this.state.birthList ? this.state.birthList.length : ""}
                  </span>
                </div>
                <div>
                  <span
                    className={
                      this.state.toggleAll.Birthdays
                        ? "Today_Person TodayUpcommingActive"
                        : "Today_Person"
                    }
                    onClick={() =>
                      this.getBirthday(this.state.formatCurrentDate, true)
                    }
                  >
                    Today
                  </span>
                  <span
                    className={
                      this.state.toggleAll.Birthdays
                        ? "Upcomming_Person"
                        : "Upcomming_Person TodayUpcommingActive"
                    }
                    onClick={() =>
                      this.getBirthday(this.state.formatSeventhDate, false)
                    }
                  >
                    Upcoming
                  </span>
                </div>
                <div
                  className="card-body record_box"
                >
                  {this.state.birthList.length == 0 ? (
                    <div className="media record_info common_box align-items-center">
                      <img
                        src={cake}
                        className="common_img img-fluid"
                        alt="Employee image"
                      />

                      <div>
                        <p style={{ fontSize: "14px" }}>
                          {this.state.toggleAll.Birthdays
                            ? "No one is having a Birthday today!"
                            : "No one is having a Birthday in upcoming seven days!"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  {this.state.birthList.length > 0 &&
                    this.state.birthList.map((item, i) => (
                      <div
                        key={i}
                        className="media record_info align-items-center"
                      >
                        {item.profileImagePath != undefined ? (
                          <div className="mr-2 emp_img">
                            <img
                              src={APIURL + "/" + item.profileImagePath}
                              alt="Employee image"
                            />
                          </div>
                        ) : (
                          <div className="mr-2 emp_img">
                            <img src={empPicture} alt="Employee image" />
                          </div>
                        )}
                        <div className="media-body">
                          <p className="mb-0 lh1" style={{ fontSize: "14px" }}>
                            {this.state.toggleAll.Birthdays ? "Today's" : ""}{" "}
                            <span>
                              <b>
                                {item.first_name} {item.last_name}
                              </b>
                            </span>{" "}
                            Birthday
                          </p>
                          {!this.state.toggleAll.Birthdays && (
                            <small className="small">
                              <strong>
                                {dateFormat(
                                  this.getCurrentYearFormat(item.date_of_birth),
                                  "ddd, dd mmm"
                                )}
                              </strong>
                            </small>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-2 p-4 dashboard_info_box">
            <div className="col-lg-12">
              <div className="card ">
                <div className="card-header d-flex justify-content-between">
                  <span className="text_primary">Work Anniversaries</span>
                  <span className="numbers_of">
                    {this.state.anniversaryList
                      ? this.state.anniversaryList.length
                      : ""}
                  </span>
                </div>
                <div>
                  <span
                    className={
                      this.state.toggleAll.Anniversaries
                        ? "Today_Person TodayUpcommingActive"
                        : "Today_Person"
                    }
                    onClick={() =>
                      this.getWorkAnniversary(
                        this.state.formatCurrentDate,
                        true
                      )
                    }
                  >
                    Today
                  </span>
                  <span
                    className={
                      this.state.toggleAll.Anniversaries
                        ? "Upcomming_Person"
                        : "Upcomming_Person TodayUpcommingActive"
                    }
                    onClick={() =>
                      this.getWorkAnniversary(
                        this.state.formatSeventhDate,
                        false
                      )
                    }
                  >
                    Upcoming
                  </span>
                </div>
                <div className="card-body record_box">
                  {this.state.anniversaryList.length == 0 ? (
                    <div className="media record_info common_box align-items-center">
                      <img
                        src={workAnniverysary}
                        className="common_img img-fluid"
                        alt="Employee image"
                      />
                      <div className="media-body">
                        <p className="lh1 mb-0" style={{ fontSize: "14px" }}>
                          {this.state.toggleAll.Anniversaries
                            ? "No one is having a Work Anniversary today!"
                            : "No one is having a Work Anniversary in upcoming seven days!"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  {this.state.anniversaryList.length > 0 &&
                    this.state.anniversaryList.map((item, i) => (
                      <div
                        key={i}
                        className="media record_info align-items-center"
                      >
                        {item.profileImagePath != undefined ? (
                          <div className="mr-2 emp_img">
                            <img
                              src={APIURL + "/" + item.profileImagePath}
                              alt="Employee image"
                            />
                          </div>
                        ) : (
                          <div className="mr-2 emp_img">
                            <img src={empPicture} alt="Employee image" />
                          </div>
                        )}

                        <div className="media-body">
                          <p className="mb-0 lh1" style={{ fontSize: "14px" }}>
                            {this.state.toggleAll.Anniversaries
                              ? "Today's"
                              : ""}{" "}
                            <span>
                              <b>
                                {item.first_name} {item.last_name}
                              </b>{" "}
                            </span>
                            Work Anniversary
                          </p>
                          {!this.state.toggleAll.Anniversaries && (
                            <small className="small">
                              <strong>
                                {dateFormat(
                                  this.getCurrentYearFormat(
                                    item.date_of_joining
                                  ),
                                  "ddd, dd mmm"
                                )}
                              </strong>
                            </small>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-2 p-4 dashboard_info_box">
            <div className="col-lg-12">
              <div className="card ">
                <div className="card-header d-flex justify-content-between">
                  <span className="text_primary">Exit</span>
                  <span className="numbers_of">
                    {this.state.terminateList
                      ? this.state.terminateList.length
                      : ""}
                  </span>
                </div>
                <div>
                  <span
                    className={
                      this.state.toggleAll.termination
                        ? "Today_Person TodayUpcommingActive"
                        : "Today_Person"
                    }
                    onClick={() =>
                      this.getTerminationList(
                        this.state.formatCurrentDate,
                        true
                      )
                    }
                  >
                    Today
                  </span>
                  <span
                    className={
                      this.state.toggleAll.termination
                        ? "Upcomming_Person"
                        : "Upcomming_Person TodayUpcommingActive"
                    }
                    onClick={() =>
                      this.getTerminationList(
                        this.state.formatSeventhDate,
                        false
                      )
                    }
                  >
                    Upcoming
                  </span>
                </div>
                <div className="card-body record_box">
                  {this.state.terminateList.length == 0 ? (
                    <div className="media record_info common_box align-items-center">
                      <img
                        src={Termination}
                        className="common_img img-fluid"
                        alt="Employee image"
                      />
                      <div className="media-body">
                        <p className="lh1 mb-0" style={{ fontSize: "14px" }}>
                          {this.state.toggleAll.termination
                            ? "No one is in today's Termination List."
                            : "No one is in the Termination List for the upcoming seven days."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {this.state.terminateList.length > 0 &&
                    this.state.terminateList.map((item, i) => (
                      <div
                        key={i}
                        className="media record_info align-items-center"
                      >
                        {item?.profileImagePath != undefined ? (
                          <div className="mr-2 emp_img">
                            <img
                              src={APIURL + "/" + item.profileImagePath}
                              alt="Employee image"
                            />
                          </div>
                        ) : (
                          <div className="mr-2 emp_img">
                            <img src={empPicture} alt="Employee image" />
                          </div>
                        )}
                        <div className="media-body">
                          <h6 className="noticelist__cnt--nm">
                            {item.first_name} {item.last_name}
                          </h6>
                          <small className="small">
                            <strong>
                              {dateFormat(item.termination_date, "ddd, dd mmm")}
                            </strong>
                          </small>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-2 p-4 dashboard_info_box">
            <div className="col-lg-12">
              <div className="card ">
                <div className="card-header d-flex justify-content-between">
                  <span className="text_primary">Probation</span>
                  <span className="numbers_of">
                    {this.state.probationList
                      ? this.state.probationList.length
                      : ""}
                  </span>
                </div>
                <div>
                  <span
                    className={
                      this.state.toggleAll.Probation
                        ? "Today_Person TodayUpcommingActive"
                        : "Today_Person"
                    }
                    onClick={() =>
                      this.getProbationList(this.state.formatCurrentDate, true)
                    }
                  >
                    Today
                  </span>
                  <span
                    className={
                      this.state.toggleAll.Probation
                        ? "Upcomming_Person"
                        : "Upcomming_Person TodayUpcommingActive"
                    }
                    onClick={() =>
                      this.getProbationList(this.state.formatSeventhDate, false)
                    }
                  >
                    Upcoming
                  </span>
                </div>
                <div className="card-body record_box">
                  {this.state.probationList.length == 0 ? (
                    <div className="media record_info common_box align-items-center">
                      <img
                        src={Probation}
                        className="common_img img-fluid"
                        alt="Employee image"
                      />
                      <div className="media-body">
                        <p className="lh1 mb-0" style={{ fontSize: "14px" }}>
                          {this.state.toggleAll.Probation
                            ? "No one is in today's Probation list."
                            : "No one's Probation is ending in the upcoming seven days."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {this.state.probationList.length > 0 &&
                    this.state.probationList.map((item, i) => (
                      <div
                        key={i}
                        className="media record_info align-items-center"
                      >
                        {item?.profileImagePath != undefined ? (
                          <div className="mr-2 emp_img">
                            <img
                              src={APIURL + "/" + item.profileImagePath}
                              alt="Employee image"
                            />
                          </div>
                        ) : (
                          <div className="mr-2 emp_img">
                            <img src={empPicture} alt="Employee image" />
                          </div>
                        )}
                        <div className="media-body">
                          <h6 className="noticelist__cnt--nm">
                            {item.first_name} {item.last_name}
                          </h6>
                          <small className="small">
                            <strong>
                              {dateFormat(
                                item.probation_end_date,
                                "ddd, dd mmm"
                              )}
                            </strong>
                          </small>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { error } = state.rootReducer.users;
  const { onLeaveList, birthDayList, anniversaryList } =
    state.rootReducer.dashboard;
  const { holidaysList } = state.rootReducer.holidays;
  return {
    error,
    onLeaveList,
    birthDayList,
    anniversaryList,
    holidaysList,
  };
}

export default connect(mapStateToProps)(Index);

