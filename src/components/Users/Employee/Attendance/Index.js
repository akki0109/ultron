import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Footer from "../../../GlobalComponents/Footer";
import Navbar from "../Layout/Navbar";
import { attendanceActions, userActions } from "../../../../actions";
import dateFormat from "dateformat";
import socketClient from "socket.io-client";
import { APIURL } from "../../../../constants/config";
import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";
import Select from "react-select";
import { colourStyles } from "../../../../constants/ColorStyle";
import { holidayService } from "../../../../services/admin/holiday.services";
import { adminLeaveService } from "../../../../services/admin/leave.services";
import Request from "./Request";

let cdate = new Date();
let currentYear = cdate.getFullYear();

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem("user")),
      allMonth: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ],
      attendanceDetailPerDate: [],
      attendanceList: [],
      filterUser: JSON.parse(localStorage.getItem("user"))
        ? [
            {
              value: JSON.parse(localStorage.getItem("user")).data._id,
              lable: JSON.parse(localStorage.getItem("user")).data.first_name,
            },
          ]
        : [{ value: 0, label: "" }],
      filterFromDate: "",
      filterToDate: "",
      selectedMonth: cdate.getMonth() + 1,
      selectedYear: currentYear,
      ReportingList: [],
      ReportingName: "",
      timeDate: new Date(),
      result: [],
      filteredKeywords: [],
      regularizeModal: false,
      note: "",
      success: "",
      hrs: "",
      min: "",
      loading: false,
      yearList: Array(4)
        .fill("")
        .map((_, index) => {
          return {
            value: new Date().getFullYear() - 3 + index,
            label: new Date().getFullYear() - 3 + index,
          };
        })
        .reverse(),
      filterYear: [{ value: currentYear, label: currentYear }],
      filterMonth: cdate.getMonth(),
      filterReportUser: [{ value: "", label: "" }],
      totalHours: 0,
      shortDays: 0,
      currentDate: "",
      holidayList: [],
      leaveList: [],
    };
    this.handleReportUser = this.handleReportUser.bind(this);
    this.closeRegularizeModal = this.closeRegularizeModal.bind(this);
    this.yearChangeHandle = this.yearChangeHandle.bind(this);
    this.getHolidaysApi = this.getHolidaysApi.bind(this);
    this.getLeaveApi = this.getLeaveApi.bind(this);
  }
  openModel(userId, loginDate, attendanceDetailPerDate) {
    this.setState(
      {
        userId: userId,
        loginDate: loginDate,
        regularizeModal: true,
        attendanceDetailPerDate,
      },
      () => {
        this.checkRegularize();
      }
    );
  }
  closeRegularizeModal = () => {
    this.setState(
      {
        note: "",
        regularizeModal: false,
      },
      () => {
        this.regularizeAddToScoket();
        this.getAttendanceList();
      }
    );
  };

  onChangeNote = (e) => {
    this.setState({
      note: e,
    });
  };

  checkRegularize() {
    this.props.dispatch(
      attendanceActions.checkRegularize({
        userId: this.state.userId,
        request_date: this.state.loginDate,
      })
    );
  }

  submitNotes = () => {
    this.props.dispatch(
      attendanceActions.regularize({
        userId: this.state.userId,
        note: this.state.note,
        request_date: this.state.loginDate,
      })
    );
    // this.setState({loading:false})
  };

  getHolidaysApi = () => {
    let payload = {
      from_date: this.state.filterFromDate,
      to_date: this.state.filterToDate,
    };
    holidayService?.filterHolidayList(payload).then((item) => {
      const dateRangeResultArray = [];

      for (const dateRange of item.data) {
        const fromDate = new Date(dateRange.from_date);
        const toDate = new Date(dateRange.to_date);

        const currentDate = new Date(fromDate);

        while (currentDate <= toDate) {
          dateRangeResultArray.push(currentDate.toISOString().split("T")[0]);
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
      this.setState({ holidayList: dateRangeResultArray });
    });
  };

  getLeaveApi = () => {
    let payload = {
      userId: this.state.filterUser[0].value,
      search: "",
      reportTo: "",
      leaveStatusFilter: "",
      startDate: this.state.filterFromDate,
      endDate: this.state.filterToDate,
    };

    adminLeaveService?.getApprovedLeavesList(payload).then((item) => {
      const dateRangeResultArray = [];

      for (const dateRange of item.data) {
        const fromDate = new Date(dateRange.leaves.from_date);
        const toDate = new Date(dateRange.leaves.to_date);

        const currentDate = new Date(fromDate);

        while (currentDate <= toDate) {
          let halfFull = "Half Day";
          if (
            currentDate.toISOString().split("T")[0] !=
              fromDate.toISOString().split("T")[0] &&
            currentDate.toISOString().split("T")[0] !=
              toDate.toISOString().split("T")[0]
          ) {
            halfFull = "Full Day";
          } else if (
            currentDate.toISOString().split("T")[0] ==
              fromDate.toISOString().split("T")[0] &&
            dateRange.leaves.from_date_half == "full_day"
          ) {
            halfFull = "Full Day";
          } else if (
            currentDate.toISOString().split("T")[0] !=
              fromDate.toISOString().split("T")[0] &&
            currentDate.toISOString().split("T")[0] ==
              toDate.toISOString().split("T")[0] &&
            dateRange.leaves.to_date_half == "full_day"
          ) {
            halfFull = "Full Day";
          }

          if (halfFull == "Half Day") {
            if (
              dateRange.leaves.from_date_half != "full_day" &&
              currentDate.toISOString().split("T")[0] ==
                fromDate.toISOString().split("T")[0]
            ) {
              halfFull = "Second Half";
              if (dateRange.leaves.from_date_half == "first_half") {
                halfFull = "First Half";
              }
            } else if (
              dateRange.leaves.to_date_half != "full_day" &&
              currentDate.toISOString().split("T")[0] ==
                toDate.toISOString().split("T")[0]
            ) {
              halfFull = "Second Half";
              if (dateRange.leaves.to_date_half == "first_half") {
                halfFull = "First Half";
              }
            }
          }
          dateRangeResultArray.push({
            leave: halfFull,
            date: currentDate.toISOString().split("T")[0],
            status: this.Capitalize(dateRange.leaves.leave_type),
          });

          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
      this.setState({ leaveList: dateRangeResultArray });
    });
  };

  Capitalize(words) {
    var separateWord = words.toLowerCase().split(" ");
    for (var i = 0; i < separateWord.length; i++) {
      separateWord[i] =
        separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
    }
    return separateWord.join(" ");
  }

  getAttendanceList() {
    this.props.dispatch(
      attendanceActions.getAttendanceList({
        userId: this.state.filterUser[0].value,
        fromdate: this.state.filterFromDate,
        todate: this.state.filterToDate,
      })
    );
  }

  getMonthDate() {
    var currentM = new Date().getMonth();
    var currentY = new Date().getFullYear();

    var date = new Date(
      this.state.selectedYear + "-" + this.state.selectedMonth + "-" + "01"
    );
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

    var lastDay = new Date();

    if (date.getMonth() == currentM && currentY == date.getFullYear()) {
      lastDay = new Date();
    } else {
      lastDay = new Date(this.state.selectedYear, this.state.selectedMonth, 0);
    }

    var oneDay = 24 * 3600 * 1000;
    for (
      var fulldate = [], ms = firstDay * 1, last = lastDay * 1;
      ms <= last;
      ms += oneDay
    ) {
      fulldate.push(dateFormat(new Date(ms), "yyyy-mm-dd"));
    }

    var newArray = [];
    for (var i = fulldate.length - 1; i >= 0; i--) {
      newArray.push(fulldate[i]);
    }
    return newArray;
  }
  showAttandanceList(data1) {
    let attendanceList = data1;
    var newArray1 = this.getMonthDate();
    const getDate = newArray1.map((item) => item);
    var filteredKeywords = [];
    getDate.map((item) => {
      var tracker = 1;
      attendanceList.map((data) => {
        if (item === data.loginDate) {
          filteredKeywords.push(data);
          tracker = 0;
        }
      });
      if (tracker) {
        attendanceList;
        filteredKeywords.push({ loginDate: item });
      }
    });

    var currentDate = new Date();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();
    let date = currentDate.getDate();
    let separator = "-";

    currentDate = `${year}${separator}${
      month < 10 ? `0${month}` : `${month}`
    }${separator}${date < 10 ? `0${date}` : `${date}`}`;
    this.setState(
      {
        filteredKeywords,
        attendanceList: data1,
        currentDate: currentDate,
      },
      () => {
        this.calculateOneTime();
        this.calculateAvrageDay();
        this.calculateTotalHourse();
        this.calculateShortDays();
      }
    );
  }
  calculateOneTime() {
    let attendanceList = this.state.attendanceList;
    var loginDateLength = attendanceList.length;

    let sum = 0;
    let logindateTime = "";
    let fromDateTime = "";
    let toDateTime = "";

    attendanceList.map((value) => {
      logindateTime = new Date(value.loginDate + " " + value.log_in_time);
      fromDateTime = new Date(value.loginDate + " 12:01:00 AM");
      toDateTime = new Date(value.loginDate + " 11:01:00 AM");

      //console.log("day",logindateTime.getHours() + ":" + logindateTime.getMinutes(),value.loginDate,value.log_in_time);
      if (
        logindateTime.getTime() >= fromDateTime.getTime() &&
        logindateTime.getTime() <= toDateTime.getTime()
      ) {
        sum = sum + 1;
      }
      return 0;
    });

    var percentage = Math.floor((sum / loginDateLength) * 100);

    this.setState({
      percentage: isNaN(percentage) ? 0 : percentage,
    });
  }

  calculateShortDays() {
    let totalEffectiveTime = [];
    let AlltotalRecords = [];
    let staurday = 0;

    let attendanceList = this.state.attendanceList;

    attendanceList = attendanceList.filter(
      (item) => item.loginDate != this.state.currentDate
    );

    attendanceList.map((item) =>
      item.totalEffectiveTime.map((sItem) => totalEffectiveTime.push(sItem))
    );

    for (var d = 0; d < totalEffectiveTime.length; d++) {
      if (new Date(totalEffectiveTime[d].date1).getDay() == 6) {
        staurday++;
      }
      AlltotalRecords.push({
        seconds: parseFloat(totalEffectiveTime[d].seconds),
        minutes: parseFloat(totalEffectiveTime[d].minutes),
        hours: parseFloat(totalEffectiveTime[d].hours),
      });
    }

    const hours = AlltotalRecords.reduce(
      (total, currentValue) => (total = total + currentValue.hours),
      0
    );
    const minutes = AlltotalRecords.reduce(
      (total, currentValue) => (total = total + currentValue.minutes),
      0
    );

    var hrsconvertToMinute = Math.floor(hours * 60);
    var combine = Math.floor(hrsconvertToMinute + minutes);
    var hrs = Math.floor(combine / 60);

    let totalWorkingDay = AlltotalRecords.length - staurday;
    let totalWorkingHours = totalWorkingDay * 8;
    if (staurday > 0) {
      totalWorkingHours += staurday * 4;
    }
    var shortHours = totalWorkingHours - hrs;
    if (shortHours < 1) {
      shortHours = 0;
    } else {
      shortHours = Math.floor(shortHours / 8);
    }

    this.setState({
      shortDays: shortHours,
    });
  }

  calculateTotalHourse() {
    let totalEffectiveTime = [];
    let AlltotalRecords = [];

    let attendanceList = this.state.attendanceList;

    attendanceList = attendanceList.filter(
      (item) => item.loginDate != this.state.currentDate
    );

    attendanceList.map((item) =>
      item.totalEffectiveTime.map((sItem) => totalEffectiveTime.push(sItem))
    );

    for (var d = 0; d < totalEffectiveTime.length; d++) {
      AlltotalRecords.push({
        seconds: parseFloat(totalEffectiveTime[d].seconds),
        minutes: parseFloat(totalEffectiveTime[d].minutes),
        hours: parseFloat(totalEffectiveTime[d].hours),
      });
    }

    const hours = AlltotalRecords.reduce(
      (total, currentValue) => (total = total + currentValue.hours),
      0
    );
    const minutes = AlltotalRecords.reduce(
      (total, currentValue) => (total = total + currentValue.minutes),
      0
    );

    var hrsconvertToMinute = Math.floor(hours * 60);
    var combine = Math.floor(hrsconvertToMinute + minutes);

    var hrs = Math.floor(combine / 60);
    var convertmin = combine % 60;
    var min = parseInt(convertmin);

    hrs = isNaN(hrs) ? 0 : hrs;
    min = isNaN(min) ? 0 : min;
    this.setState({
      totalHours: hrs + " h :" + min + " m",
    });
  }

  calculateAvrageDay() {
    let totalEffectiveTime = [];
    let AlltotalRecords = [];

    let attendanceList = this.state.attendanceList;
    attendanceList = attendanceList.filter(
      (item) => item.loginDate != this.state.currentDate
    );
    attendanceList.map((item) =>
      item.totalEffectiveTime.map((sItem) => totalEffectiveTime.push(sItem))
    );

    for (var d = 0; d < totalEffectiveTime.length; d++) {
      AlltotalRecords.push({
        seconds: parseFloat(totalEffectiveTime[d].seconds),
        minutes: parseFloat(totalEffectiveTime[d].minutes),
        hours: parseFloat(totalEffectiveTime[d].hours),
      });
    }

    const hours = AlltotalRecords.reduce(
      (total, currentValue) => (total = total + currentValue.hours),
      0
    );
    const minutes = AlltotalRecords.reduce(
      (total, currentValue) => (total = total + currentValue.minutes),
      0
    );

    var hrsconvertToMinute = Math.floor(hours * 60);
    var combine = Math.floor(hrsconvertToMinute + minutes);

    var totalAvg = combine / AlltotalRecords.length;
    var hrs = Math.floor(totalAvg / 60);
    var convertmin = totalAvg % 60;
    var min = parseInt(convertmin);

    this.setState({
      hrs: isNaN(hrs) ? 0 : hrs,
      min: isNaN(min) ? 0 : min,
    });
  }

  setMonth(setm) {
    this.handleSelectedMonth(setm);

    this.setState(
      {
        filterMonth: setm,
      },
      () => {
        this.calculateFromTodate();
      }
    );
  }

  yearChangeHandle(e) {
    this.setState(
      {
        filterYear: [{ value: e.value, label: e.label }],
        selectedYear: e.value,
      },
      () => {
        this.calculateFromTodate();
      }
    );
  }

  calculateFromTodate() {
    var firstDay = new Date(this.state.selectedYear, this.state.filterMonth, 1);
    var lastDay = new Date(
      this.state.selectedYear,
      this.state.filterMonth + 1,
      0
    );

    let month = firstDay.getMonth() + 1;
    let year = firstDay.getFullYear();
    let date = firstDay.getDate();

    let lmonth = lastDay.getMonth() + 1;
    let lyear = lastDay.getFullYear();
    let ldate = lastDay.getDate();
    let separator = "-";
    const todayDate = `${year}${separator}${
      month < 10 ? `0${month}` : `${month}`
    }${separator}${date < 10 ? `0${date}` : `${date}`}`;
    const lastDate = `${lyear}${separator}${
      lmonth < 10 ? `0${lmonth}` : `${month}`
    }${separator}${ldate < 10 ? `0${ldate}` : `${ldate}`}`;

    // console.log(todayDate, lastDate);

    this.setState(
      {
        filterFromDate: todayDate,
        filterToDate: lastDate,
        selectedMonth: firstDay.getMonth() + 1,
        selectedYear: firstDay.getFullYear(),
      },
      () => {
        this.getAttendanceList();
        this.getHolidaysApi();
        this.getLeaveApi();
      }
    );
  }

  handleSelectedMonth(Indexing) {
    this.setState({
      SelectedMonth: this.state.allMonth[Indexing],
    });
  }

  // getToday() {
  //     let cdate = new Date();
  //     var firstDay = new Date(cdate.getFullYear(), cdate.getMonth(), 1);
  //     var lastDay = new Date(cdate.getFullYear(), cdate.getMonth() + 1, 0);

  //     let month = firstDay.getMonth() + 1;
  //     let year = firstDay.getFullYear();
  //     let date = firstDay.getDate();

  //     let lmonth = lastDay.getMonth() + 1;
  //     let lyear = lastDay.getFullYear();
  //     let ldate = lastDay.getDate();
  //     let separator = "-";
  //     const todayDate = `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`}`;
  //     const lastDate = `${lyear}${separator}${lmonth < 10 ? `0${lmonth}` : `${month}`}${separator}${ldate < 10 ? `0${ldate}` : `${ldate}`}`;

  //     // console.log(todayDate, lastDate);

  //     this.setState({
  //         filterUser: [{ value: this.state.user.data._id, lable: this.state.user.data.first_name }],
  //         filterFromDate: todayDate,
  //         filterToDate: lastDate,
  //         selectedMonth: firstDay.getMonth() + 1,
  //         selectedYear: firstDay.getFullYear()
  //     }, () => { this.getAttendanceList(); });
  // }

  getReportingList(searchString) {
    this.props.dispatch(
      userActions.getReportingList({ reportTo: searchString })
    );
  }

  handleReportUser(event) {
    const d = new Date();
    let month = d.getMonth();
    this.handleSelectedMonth(month);

    const { user } = this.state;
    let item = this.state.ReportingList;
    let selectedReportingItem = [];
    selectedReportingItem = item.filter(
      (Result) => Result.value == event.value
    );
    if (event.value === user.data._id) {
      this.setState(
        {
          filterUser: [event],
          ReportingName: user.data.first_name + " " + user.data.last_name,
        },
        () => {
          console.log(this.state.filterUser);
          this.getAttendanceList();
          this.getLeaveApi(event.value);
        }
      );
    } else {
      this.setState(
        {
          filterUser: [event],
          ReportingName: selectedReportingItem[0].label,
        },
        () => {
          this.getAttendanceList();
          this.getLeaveApi(event.value);
        }
      );
    }
  }

  configureSocket = () => {
    var socket = socketClient(APIURL, { transports: ["websocket"] });
    socket.on("attendance", (data) => {
      if (this.state.filterUser[0].value == data.userId) {
        this.getAttendanceList();
      }
    });
  };
  reportingGet(item) {
    let reportList = [];
    if (this.state.ReportingList && this.state.ReportingList.length == 0) {
      reportList.push({
        value: this.state.user.data._id,
        label:
          this.state.user.data.first_name +
          " " +
          this.state.user.data.last_name,
      });
      for (var c = 0; c < item.length; c++) {
        reportList.push({
          value: item[c]._id,
          label: item[c].first_name + " " + item[c].last_name,
        });
      }
      this.setState({
        ReportingList: reportList,
        filterUser: [
          {
            value: this.state.user.data._id,
            label:
              this.state.user.data.first_name +
              " " +
              this.state.user.data.last_name,
          },
        ],
      });
    }
  }

  regularizeAddToScoket() {
    var socket = socketClient(APIURL, { transports: ["websocket"] });
    socket.emit("regularization", { userId: this.state.user.data._id });

    socket.emit("attendance", {
      userId: this.state.user.data._id,
      name: this.state.user.data.first_name,
    });
  }

  componentDidMount() {
    if (this.state.user) {
      const d = new Date();
      let month = d.getMonth();
      this.handleSelectedMonth(month);
      this.calculateFromTodate();
      this.getReportingList(this.state.user.data._id);
      this.configureSocket();
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.regularize_modal == false) {
      this.regularizeAddToScoket();
      this.closeRegularizeModal();
    }

    if (nextProps.attendanceList != undefined) {
      this.showAttandanceList(nextProps.attendanceList);
    }
    /*if (nextProps.ReportingList) {
            this.reportingGet(nextProps.ReportingList);
        }*/

    if (nextProps.ReportingList != undefined) {
      this.reportingGet(nextProps.ReportingList);
    }
  }

  render() {
    const {
      // error,
      loading,
    } = this.props;
    const { user, filterUser } = this.state;
    if (!this.state.user) {
      return <Redirect to="/" />;
    }
    if (this.state.user.data.user_role !== "Employee") {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <Navbar activePage="dashboard" />
        <main className="offset">
          <div className="container-fluid hard-pad">
            <div className="row align-items-center pt-4 border-mobile">
              <div className="col-lg-4 col-6">
                <h2 className="page-heading"> Attendance </h2>
              </div>
              <div
                className="col-md-3 offset-md-5 col-6"
                style={{ position: "relative", zIndex: 2 }}
              >
                <Select
                  styles={colourStyles}
                  onChange={this.yearChangeHandle}
                  value={this.state.filterYear}
                  options={this.state.yearList}
                />
              </div>
            </div>

            <div className="row m-0 align-items-center pt-4 border-mobile">
              <div className="col-lg-3">
                <div
                  className="menu_width"
                  style={{ position: "relative", zIndex: 2 }}
                >
                  <Select
                    styles={colourStyles}
                    onChange={this.handleReportUser}
                    value={this.state.filterUser}
                    options={this.state.ReportingList}
                  />
                </div>
              </div>
              <div className="col-lg-9 p-0">
                <nav aria-label="Page navigation">
                  <ul className="pagination mb-0">
                    {this.state.allMonth.map((month, idx) => (
                      <li
                        key={idx}
                        className={
                          "page-item " +
                          (this.state.selectedMonth == idx + 1 ? "active" : "")
                        }
                      >
                        <a
                          onClick={() => this.setMonth(idx)}
                          className="page-link"
                          href="javascript:;"
                        >
                          {month}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>

            <div id="table-scroll" className="table-scroll mt-4">
              <table id="main-table" className="main-table full-first-td">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col" className="text-left">
                      {" "}
                      Net Hrs{" "}
                    </th>
                    <th scope="col" className="text-left">
                      {" "}
                      Gross Hrs{" "}
                    </th>
                    <th scope="col" className="text-left">
                      {" "}
                      Arrival{" "}
                    </th>
                    <th scope="col" className="text-left">
                      {" "}
                      Log Out{" "}
                    </th>
                    <th scope="col" className="text-center">
                      {" "}
                      Status{" "}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.filteredKeywords &&
                    this.state.filteredKeywords.map((item, index) => (
                      <tr key={index}>
                        <td className="">
                          {dateFormat(item.loginDate, "ddd, dd mmm")}
                          {item.regularizationStatus == "approved" ? (
                            <span className="capsule alt_capsule green-dim text-center ml-3 ">
                              REG
                            </span>
                          ) : (
                            ""
                          )}
                          {new Date(item.loginDate).getDay() === 6 ||
                          new Date(item.loginDate).getDay() === 0 ? (
                            <div className="text-muted small">Week Off</div>
                          ) : this.state.holidayList.includes(
                              dateFormat(item.loginDate, "yyyy-mm-dd")
                            ) ? (
                            <div className="text-muted small">Holiday</div>
                          ) : this.state.leaveList.filter(
                              (ln) =>
                                ln.date ==
                                dateFormat(item.loginDate, "yyyy-mm-dd")
                            ).length > 0 ? (
                            this.state.leaveList
                              .filter(
                                (ln) =>
                                  ln.date ==
                                  dateFormat(item.loginDate, "yyyy-mm-dd")
                              )
                              .map((itm, ind) => (
                                <div className="text-danger small" key={ind}>
                                  {itm.leave} - {itm.status}
                                </div>
                              ))
                          ) : (
                            ""
                          )}
                        </td>
                        {item.totalEffectiveTime ? (
                          <td className="text-left">
                            {(!isNaN(item.totalEffectiveTime[0].hours)
                              ? item.totalEffectiveTime[0].hours
                              : "00") +
                              "h" +
                              ":" +
                              (!isNaN(item.totalEffectiveTime[0].minutes)
                                ? item.totalEffectiveTime[0].minutes
                                : "00") +
                              "m"}
                          </td>
                        ) : new Date(item.loginDate).getDay() === 6 ||
                          new Date(item.loginDate).getDay() === 0 ? (
                          <td colSpan="5" className="text-left"></td>
                        ) : (
                          <>
                            <td
                              colSpan={
                                this.state.holidayList.includes(
                                  dateFormat(item.loginDate, "yyyy-mm-dd")
                                )
                                  ? "5"
                                  : this.state.leaveList.filter(
                                      (ln) =>
                                        ln.date ==
                                        dateFormat(item.loginDate, "yyyy-mm-dd")
                                    ).length > 0
                                  ? "5"
                                  : "4"
                              }
                              className="text-left"
                            ></td>
                            {!this.state.holidayList.includes(
                              dateFormat(item.loginDate, "yyyy-mm-dd")
                            ) &&
                              this.state.leaveList.filter(
                                (ln) =>
                                  ln.date ==
                                  dateFormat(item.loginDate, "yyyy-mm-dd")
                              ).length == 0 && (
                                <td
                                  data-th="Order Value"
                                  className="text-center"
                                >
                                  <div>
                                    <Button
                                      id={`btn-${index}`}
                                      // id={parseInt(index)}
                                      type="button"
                                      color="light"
                                      size="sm"
                                      onClick={""}
                                    >
                                      <i
                                        className="fa-lg fa fa-exclamation-circle text-warning"
                                        aria-hidden="true"
                                        id="Popover1"
                                      ></i>
                                    </Button>
                                  </div>
                                  {this.state.regularizeModal === false && (
                                    <UncontrolledPopover
                                      placement="top"
                                      target={`btn-${index}`}
                                      // target={parseInt(index)}
                                      trigger="legacy"
                                    >
                                      <PopoverHeader>
                                        {dateFormat(
                                          item.loginDate,
                                          "ddd, dd mmmm  yyyy"
                                        )}
                                      </PopoverHeader>
                                      {dateFormat(
                                        item.loginDate,
                                        "yyyy-mm-dd"
                                      ) !=
                                        dateFormat(new Date(), "yyyy-mm-dd") &&
                                        filterUser[0].value === user.data._id &&
                                        item.regularizationStatus !=
                                          "pending" && (
                                          <PopoverHeader>
                                            <Button
                                              id={`btn-${index}`}
                                              className="ic-edit icon icon-sm text-link mr-8 regularize_btn"
                                              onClick={this.openModel.bind(
                                                this,
                                                this.state.filterYear,
                                                item.loginDate,
                                                item.attendanceDetail
                                              )}
                                            >
                                              Regularize
                                            </Button>
                                          </PopoverHeader>
                                        )}

                                      <PopoverBody>
                                        <div className="row m-0">
                                          <div className="col-12 p-0">
                                            <p className="mb-3">
                                              <strong>Web Clock In</strong>
                                            </p>
                                            <p>No Time Entries Logged</p>
                                          </div>
                                        </div>
                                      </PopoverBody>
                                    </UncontrolledPopover>
                                  )}
                                </td>
                              )}
                          </>
                        )}
                        {item.grossTime ? (
                          <td className="text-left">
                            {(!isNaN(item.grossTime.hours)
                              ? item.grossTime.hours
                              : "00") +
                              "h" +
                              ":" +
                              (!isNaN(item.grossTime.minutes)
                                ? item.grossTime.minutes
                                : "00") +
                              "m"}
                          </td>
                        ) : (
                          ""
                        )}

                        {item.log_in_time ? (
                          <td className="text-left">
                            {item.log_in_time == "Invalid date"
                              ? "00:00:00 AM"
                              : item.log_in_time}
                          </td>
                        ) : (
                          ""
                        )}
                        {item.attendanceDetail ? (
                          <td className="text-left">
                            {item.attendanceDetail[
                              item.attendanceDetail.length - 1
                            ].log_out_time == "Invalid date"
                              ? "00:00:00 AM"
                              : item.attendanceDetail[
                                  item.attendanceDetail.length - 1
                                ].log_out_time}
                          </td>
                        ) : (
                          ""
                        )}

                        {item.attendanceDetail ? (
                          <td data-th="Order Value" className="text-center">
                            {item.attendanceDetail[
                              item.attendanceDetail.length - 1
                            ].log_out_time === null ? (
                              <React.Fragment>
                                <div>
                                  <Button
                                    id={`btn-${index}`}
                                    // id={parseInt(index)}
                                    type="button"
                                    color="light"
                                    size="sm"
                                  >
                                    {item.regularizationStatus != "pending" && (
                                      <i
                                        className="fa-lg fa fa-exclamation-circle text-warning"
                                        aria-hidden="true"
                                      ></i>
                                    )}
                                    {item.regularizationStatus == "pending" && (
                                      <i
                                        className="fa-lg fa fa-hourglass-half text-warning"
                                        aria-hidden="true"
                                      ></i>
                                    )}
                                  </Button>
                                  {this.state.regularizeModal === false && (
                                    <UncontrolledPopover
                                      placement="top"
                                      target={`btn-${index}`}
                                      // target={parseInt(index)}
                                      trigger="legacy"
                                    >
                                      <PopoverHeader>
                                        {dateFormat(
                                          item.loginDate,
                                          "ddd, dd mmmm  yyyy"
                                        )}
                                      </PopoverHeader>
                                      {dateFormat(
                                        item.loginDate,
                                        "yyyy-mm-dd"
                                      ) !=
                                        dateFormat(new Date(), "yyyy-mm-dd") &&
                                        filterUser[0].value === user.data._id &&
                                        item.regularizationStatus !=
                                          "pending" && (
                                          <PopoverHeader>
                                            <Button
                                              id={`btn-${index}`}
                                              className="ic-edit icon icon-sm text-link mr-8 regularize_btn"
                                              onClick={this.openModel.bind(
                                                this,
                                                item.userId,
                                                item.loginDate,
                                                item.attendanceDetail
                                              )}
                                            >
                                              Regularize
                                            </Button>
                                          </PopoverHeader>
                                        )}

                                      <PopoverBody>
                                        <div className="row m-0">
                                          <div className="col-12 p-0">
                                            <p className="mb-3">
                                              <strong>Web Clock In</strong>
                                            </p>
                                            {item.attendanceDetail.map(
                                              (atten, idx) => (
                                                <div
                                                  key={idx}
                                                  className="log_stats"
                                                >
                                                  <div className="row m-0">
                                                    <div className="col-6 p-0">
                                                      <span>
                                                        <i className="fa fa-long-arrow-left mr-1 rotate_arrow green_text"></i>
                                                        {atten.log_in_time}
                                                      </span>
                                                    </div>
                                                    <div className="col-6 p-0 ">
                                                      <span className="text-uppercase">
                                                        <i className="fa fa-long-arrow-right mr-1 rotate_arrow red_text"></i>
                                                        {atten.log_out_time
                                                          ? atten.log_out_time
                                                          : "Missing"}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      </PopoverBody>
                                    </UncontrolledPopover>
                                  )}
                                </div>
                              </React.Fragment>
                            ) : (
                              <React.Fragment>
                                <div>
                                  <Button
                                    id={`btn-${index}`}
                                    // id={parseInt(index)}
                                    type="button"
                                    color="light"
                                    size="sm"
                                  >
                                    {item.regularizationStatus != "pending" && (
                                      <i
                                        className="fa fa-check-circle text-success fa-lg"
                                        aria-hidden="true"
                                      ></i>
                                    )}
                                    {item.regularizationStatus == "pending" && (
                                      <i
                                        className="fa-lg fa fa-hourglass-half text-warning"
                                        aria-hidden="true"
                                      ></i>
                                    )}

                                    {/* <i className="fa fa-check text-success fa-lg" aria-hidden="true"></i> */}
                                  </Button>
                                  {this.state.regularizeModal === false && (
                                    <UncontrolledPopover
                                      placement="top"
                                      target={`btn-${index}`}
                                      // target={parseInt(index)}
                                      trigger="legacy"
                                    >
                                      <PopoverHeader>
                                        {dateFormat(
                                          item.loginDate,
                                          "ddd, dd mmmm  yyyy"
                                        )}
                                      </PopoverHeader>
                                      {dateFormat(
                                        item.loginDate,
                                        "yyyy-mm-dd"
                                      ) !=
                                        dateFormat(new Date(), "yyyy-mm-dd") &&
                                        filterUser[0].value === user.data._id &&
                                        item.regularizationStatus !=
                                          "pending" && (
                                          <PopoverHeader>
                                            <Button
                                              className="ic-edit icon icon-sm text-link mr-8 regularize_btn"
                                              onClick={this.openModel.bind(
                                                this,
                                                item.userId,
                                                item.loginDate,
                                                item.attendanceDetail
                                              )}
                                            >
                                              Regularize
                                            </Button>
                                          </PopoverHeader>
                                        )}

                                      <PopoverBody>
                                        <div className="row m-0">
                                          <div className="col-12 p-0">
                                            <p className="mb-3">
                                              <strong>Web Clock In</strong>
                                            </p>
                                            {item.attendanceDetail.map(
                                              (atten, idx) => (
                                                <div
                                                  key={idx}
                                                  className="log_stats"
                                                >
                                                  <div className="row m-0">
                                                    <div className="col-6 p-0">
                                                      <span>
                                                        <i className="fa fa-long-arrow-left mr-1 rotate_arrow green_text"></i>
                                                        {atten.log_in_time}
                                                      </span>
                                                    </div>
                                                    <div className="col-6 p-0 ">
                                                      <span className="text-uppercase">
                                                        <i className="fa fa-long-arrow-right mr-1 rotate_arrow red_text"></i>
                                                        {atten.log_out_time
                                                          ? atten.log_out_time
                                                          : "Missing"}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      </PopoverBody>
                                    </UncontrolledPopover>
                                  )}
                                </div>
                              </React.Fragment>
                            )}
                          </td>
                        ) : (
                          ""
                        )}
                      </tr>
                    ))}
                  {this.state.filteredKeywords &&
                    this.state.filteredKeywords.length == 0 &&
                    loading == false && (
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
          <p className="mt-4 text-center">
            <small>
              <b>{this.state.SelectedMonth} Month</b> <br /> Attendance Summary
            </small>
            <br />{" "}
            {this.state.ReportingName
              ? this.state.ReportingName
              : this.state.user.data.first_name +
                " " +
                this.state.user.data.last_name}
          </p>

          <div className="stats">
            <div className="stats-big">
              {"" + this.state.hrs + "h" + ":" + this.state.min + "m"}
            </div>

            <div className="stats-small">Avg/Day</div>
          </div>
          <div className="stats">
            <div className="stats-big">{this.state.totalHours}</div>

            <div className="stats-small">Total Net Work Hours</div>
          </div>

          <div className="stats">
            <div className="stats-big">
              {this.state.shortDays ? this.state.shortDays : "0"}
            </div>

            <div className="stats-small">Short Days</div>
          </div>
          <div className="stats">
            <div className="stats-big">{this.state.percentage}%</div>
            <div className="stats-small">On-time Arrival</div>
          </div>
        </div>
        <Request
          isOpen={this.state.regularizeModal}
          closeModal={() => this.closeRegularizeModal()}
          attendanceList={this.state.attendanceDetailPerDate}
          userId={this.state.user.data._id}
          attendanceListDate={this.state.loginDate}
        />
        <Footer />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    attendanceList,
    error,
    success,
    regularize_modal,
    loading,
    CheckRegerror,
  } = state.rootReducer.attendances;
  const { ReportingList } = state.rootReducer.users;
  // console.log("success", attendanceList);
  return {
    error,
    success,
    attendanceList,
    ReportingList,
    regularize_modal,
    loading,
    CheckRegerror,
  };
}

export default connect(mapStateToProps)(Index);
