import React, { useState,useEffect } from "react";
// import { Redirect } from "react-router-dom";
import Footer from "../../../GlobalComponents/Footer";
import Navbar from "../Layout/Navbar";
import { attendanceActions, adminUserActions } from "../../../../actions";
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
import { useDispatch, useSelector } from "react-redux";

let cdate = new Date();
let currentYear = cdate.getFullYear();

const Index = (nextProps) => {
  console.log("nextProps",nextProps);
   const {
    attendanceList,
    error,
    // success,
    regularize_modal,
    loading,
    // CheckRegerror,
    UserListForReporting
  } = useSelector(state => state.rootReducer.attendances);
  const dispatch = useDispatch();
  const user = useState(JSON.parse(localStorage.getItem("user")));
  const allMonth = [
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
  ];
  const [attendanceDetailPerDate, setAttendanceDetailPerDate] = useState([]);
  const [attendance, setAttendanceList] = useState([]);
  const [filterUser, setFilterUser] = useState(
    JSON.parse(localStorage.getItem("user"))
      ? [
          {
            value: JSON.parse(localStorage.getItem("user")).data._id,
            lable: JSON.parse(localStorage.getItem("user")).data.first_name,
          },
        ]
      : [{ value: 0, label: "" }]
  );
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(cdate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [ReportingList, setReportingList] = useState([]);
  const [ReportingName, setReportingName] = useState("");
  const [filteredKeywords, setFilteredKeywords] = useState([]);
  const [regularizeModal, setRegularizeModal] = useState(false);
  const [hrs, setHrs] = useState("");
  const [min, setMin] = useState("");
  // const [loading, setLoading] = useState(false);
  const yearList=[
    { value: 2020, label: 2020 },
    { value: 2021, label: 2021 },
    { value: 2022, label: 2022 },
  ];
  const [filterYear, setFilterYear] = useState([
    { value: currentYear, label: currentYear },
  ]);
  const [filterMonth, setFilterMonth] = useState(cdate.getMonth());
  // const [filterReportUser, setFilterReportUser] = useState([
  //   { value: "", label: "" },
  // ]);
  const [totalHours, setTotalHours] = useState(0);
  const [shortDays, setShortDays] = useState(0);
  const [currentDate, setCurrentDate] = useState("");
  const [holidayList, setHolidayList] = useState([]);
  const [leaveList, setLeaveList] = useState([]);
  const [loginDate, setLoginDate] = useState("");
  const [userId, setUserId] = useState("");
  const [percentage, setPercentage] = useState("");
console.log("attendanceList",attendanceList);
  const openModel = (userId, loginDate, attendanceDetailPerDate) => {
    console.log(34523, userId, loginDate,error);
    setUserId(userId);
    setLoginDate(loginDate);
    setRegularizeModal(true);
    setAttendanceDetailPerDate(attendanceDetailPerDate);

    // Call checkRegularize function
    checkRegularize();
  };
  const closeRegularizeModal = () => {
    setRegularizeModal(false);

    // Call getAttendanceList function
    getAttendanceList();
  };

  // onChangeNote = (e) => {
  //   setState({
  //     note: e,
  //   });
  // };

  const checkRegularize = () => {
    dispatch(
      attendanceActions.checkRegularize({
        userId,
        request_date: loginDate,
      })
    );
  };

  // const submitNotes = () => {
  //   dispatch(
  //     attendanceActions.regularize({
  //       userId,
  //       note,
  //       request_date: loginDate,
  //     })
  //   );
  //   // setState({loading:false})
  // };

  const getHolidaysApi = () => {
    let payload = {
      from_date: filterFromDate,
      to_date: filterToDate,
    };
    holidayService?.getHolidayAccordingToDate(payload).then((item) => {
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
      setHolidayList(dateRangeResultArray);
    });
  };

  const getLeaveApi = (id) => {
    let payload = {
      userId: id,
      search: "",
      reportTo: "",
      leaveStatusFilter: "",
      startDate: filterFromDate,
      endDate: filterToDate,
    };
    adminLeaveService?.getLeavesList(payload).then((item) => {
      const dateRangeResultArray = [];

      for (const dateRange of item.data) {
        const fromDate = new Date(dateRange.leaves.from_date);
        const toDate = new Date(dateRange.leaves.to_date);

        const currentDate = new Date(fromDate);

        while (currentDate <= toDate) {
          dateRangeResultArray.push(currentDate.toISOString().split("T")[0]);
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
      setLeaveList(dateRangeResultArray);
    });
  };

  const getAttendanceList = () => {
    dispatch(
      attendanceActions.getAttendanceList({
        userId: filterUser[0].value,
        fromdate: filterFromDate,
        todate: filterToDate,
      })
    );
  };

  const getMonthDate = () => {
    var currentM = new Date().getMonth();
    var currentY = new Date().getFullYear();

    var date = new Date(selectedYear + "-" + selectedMonth + "-" + "01");
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

    var lastDay = new Date();

    if (date.getMonth() == currentM && currentY == date.getFullYear()) {
      lastDay = new Date();
    } else {
      lastDay = new Date(selectedYear, selectedMonth, 0);
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
  };
  const showAttandanceList = (data1) => {
    let attendance = data1;
    var newArray1 = getMonthDate();
    const getDate = newArray1.map((item) => item);
    var filteredKeywords = [];
    getDate.map((item) => {
      var tracker = 1;
      attendance?.map((data) => {
        if (item === data.loginDate) {
          filteredKeywords.push(data);
          tracker = 0;
        }
      });
      if (tracker) {
        attendance;
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

    setFilteredKeywords(filteredKeywords);
    setAttendanceList(data1);
    setCurrentDate(currentDate);

    calculateOneTime();
    calculateAvrageDay();
    calculateTotalHourse();
    calculateShortDays();
  };
  const calculateOneTime = () => {
    // let attendance = attendance;
    var loginDateLength = attendance.length;

    let sum = 0;
    let logindateTime = "";
    let fromDateTime = "";
    let toDateTime = "";

    attendance.map((value) => {
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

    setPercentage(isNaN(percentage) ? 0 : percentage);
  };

  const calculateShortDays = () => {
    let totalEffectiveTime = [];
    let AlltotalRecords = [];
    let staurday = 0;

    let Attendance = attendance;

    Attendance = Attendance.filter(
      (item) => item.loginDate != currentDate
    );

    Attendance.map((item) =>
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

    setShortDays(shortHours);
  };

  const calculateTotalHourse = () => {
    let totalEffectiveTime = [];
    let AlltotalRecords = [];


   let Attendance = attendance.filter(
      (item) => item.loginDate != currentDate
    );

    Attendance.map((item) =>
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

    setTotalHours(hrs + " h :" + min + " m");
  };

  const calculateAvrageDay = () => {
    let totalEffectiveTime = [];
    let AlltotalRecords = [];

    
    let Attendance = attendance?.filter(
      (item) => item.loginDate != currentDate
    );
    Attendance.map((item) =>
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

    setHrs(isNaN(hrs) ? 0 : hrs);
    setMin(isNaN(min) ? 0 : min);
  };

  const setMonth = (setm) => {
    handleSelectedMonth(setm);

    setFilterMonth(setm);
    calculateFromTodate();
  };

  const yearChangeHandle = (e) => {
    setFilterYear([{ value: e.value, label: e.label }]);
    selectedYear(e.value);
    calculateFromTodate();
  };

  const calculateFromTodate = () => {
    var firstDay = new Date(selectedYear, filterMonth, 1);
    var lastDay = new Date(selectedYear, filterMonth + 1, 0);

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

    setFilterFromDate(todayDate);
    setFilterToDate(lastDate);
    setSelectedMonth(firstDay.getMonth() + 1);
    setSelectedYear(firstDay.getFullYear());
    getAttendanceList();
    getHolidaysApi();
    getLeaveApi();
  };

  const handleSelectedMonth = (Indexing) => {
    setSelectedMonth(Indexing + 1);
  };

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

  //     setState({
  //         filterUser: [{ value: user.data._id, lable: user.data.first_name }],
  //         filterFromDate: todayDate,
  //         filterToDate: lastDate,
  //         selectedMonth: firstDay.getMonth() + 1,
  //         selectedYear: firstDay.getFullYear()
  //     }, () => { getAttendanceList(); });
  // }

  const getReportingList = () => {
    dispatch(adminUserActions.getUserListForReporting({ search: "" }));
  };

  const handleReportUser = (event) => {
    const d = new Date();
    let month = d.getMonth();
    handleSelectedMonth(month);

    let item = ReportingList;
    let selectedReportingItem = [];
    selectedReportingItem = item.filter(
      (Result) => Result.value == event.value
    );
    if (event.value === user.data._id) {
      setFilterUser([event]);
      setReportingName(user.data.first_name + " " + user.data.last_name);
      getAttendanceList();
      getLeaveApi(event.value);
    } else {
      setFilterUser([event]);
      setReportingName(selectedReportingItem[0].label);
      getAttendanceList();
      getLeaveApi(event.value);
    }
  };

  const configureSocket = () => {
    var socket = socketClient(APIURL, { transports: ["websocket"] });
    socket.on("attendance", (data) => {
      if (filterUser[0].value == data.userId) {
        getAttendanceList();
      }
    });
  };
  const reportingGet = (item) => {
    let reportList = [];
    if (ReportingList && ReportingList.length == 0) {
      reportList.push({
        value: user.data._id,
        label: user.data.first_name + " " + user.data.last_name,
      });
      for (var c = 0; c < item.length; c++) {
        reportList.push({
          value: item[c]._id,
          label: item[c].first_name + " " + item[c].last_name,
        });
      }
      setReportingList(reportList);
      setFilterUser([
        {
          value: user.data._id,
          label: user.data.first_name + " " + user.data.last_name,
        },
      ]);
    }
  };

  useEffect(() => {
    if (user) {
      const d = new Date();
      let month = d.getMonth();
      handleSelectedMonth(month);
      calculateFromTodate();
      getReportingList(user?.data?._id);
      configureSocket();
    }
  }, []);

  useEffect(() => {
    if (regularize_modal === false) {
      closeRegularizeModal();
    }

    if (attendance !== undefined) {
      showAttandanceList(attendance);
    }

    if (UserListForReporting !== undefined) {
      reportingGet(UserListForReporting);
    }
  }, [regularize_modal,attendance,UserListForReporting]);

  // if (!user) {
  //   return <Redirect to="/" />;
  // }
  // if (user.data.user_role !== "Admin") {
  //   return <Redirect to="/" />;
  // }
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
              className="col-lg-2"
              style={{ position: "relative", zIndex: 2 }}
            >
              <Select
                styles={colourStyles}
                onChange={yearChangeHandle}
                value={filterYear}
                options={yearList}
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
                  onChange={handleReportUser}
                  value={filterUser}
                  options={ReportingList}
                />
              </div>
            </div>
            <div className="col-lg-9 p-0">
              <nav aria-label="Page navigation">
                <ul className="pagination mb-0">
                  {allMonth.map((month, idx) => (
                    <li
                      key={idx}
                      className={
                        "page-item " +
                        (selectedMonth == idx + 1 ? "active" : "")
                      }
                    >
                      <a
                        onClick={() => setMonth(idx)}
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
                  <th scope="col" className="text-left"> Net Hrs </th> 
                  <th scope="col" className="text-left"> Gross Hrs </th> 
                  <th scope="col" className="text-left"> Arrival </th> 
                  <th scope="col" className="text-left"> Log Out </th> 
                  <th scope="col" className="text-left"> Status </th>
                </tr>
              </thead>
              <tbody>
                {filteredKeywords &&
                  filteredKeywords.map((item, index) => (
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
                      </td>
                      {item.totalEffectiveTime ? (
                        <td className="text-left">
                          {item.totalEffectiveTime[0].hours +
                            "h" +
                            ":" +
                            item.totalEffectiveTime[0].minutes +
                            "m"}
                        </td>
                      ) : new Date(item.loginDate).getDay() === 6 ||
                        new Date(item.loginDate).getDay() === 0 ? (
                        <td colSpan="5" className="text-left">
                          {" "}
                          <span className="capsule text-center week_off_bg">
                            Week off
                          </span>
                        </td>
                      ) : (
                        <>
                          <td
                            colSpan={
                              leaveList.includes(
                                dateFormat(item.loginDate, "yyyy-mm-dd")
                              )
                                ? "5"
                                : "4"
                            }
                            className="text-left"
                          >
                            <span className="capsule lable_weekoff text-center">
                              {holidayList.includes(
                                dateFormat(item.loginDate, "yyyy-mm-dd")
                              )
                                ? "Holiday"
                                : leaveList.includes(
                                    dateFormat(item.loginDate, "yyyy-mm-dd")
                                  )
                                ? "On Leave"
                                : "No Time Entries Logged"}
                            </span>
                          </td>
                          {!holidayList.includes(
                            dateFormat(item.loginDate, "yyyy-mm-dd")
                          ) &&
                            !leaveList.includes(
                              dateFormat(item.loginDate, "yyyy-mm-dd")
                            ) && (
                              <td>
                                <i
                                  className="fa fa-check-circle text-success fa-lg ml-4"
                                  aria-hidden="true"
                                  id="Popover1"
                                ></i>
                              </td>
                            )}
                        </>
                      )}
                      {item.grossTime ? (
                        <td className="text-left">
                          {item.grossTime.hours +
                            "h" +
                            ":" +
                            item.grossTime.minutes +
                            "m"}
                        </td>
                      ) : (
                        ""
                      )}

                      {item.log_in_time ? (
                        <td className="text-left">{item.log_in_time}</td>
                      ) : (
                        ""
                      )}
                      {item.attendanceDetail ? (
                        <td className="text-left">
                          {
                            item.attendanceDetail[
                              item.attendanceDetail.length - 1
                            ].log_out_time
                          }
                        </td>
                      ) : (
                        ""
                      )}

                      {item.attendanceDetail ? (
                        <td data-th="Order Value" className="text-left">
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
                                {regularizeModal === false && (
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
                                    {filterUser[0].value === user.data._id &&
                                      item.regularizationStatus !=
                                        "pending" && (
                                        <PopoverHeader>
                                          <Button
                                            id={`btn-${index}`}
                                            className="ic-edit icon icon-sm text-link mr-8 regularize_btn"
                                            onClick={openModel.bind(
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
                                {regularizeModal === false && (
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
                                    {filterUser[0].value === user.data._id &&
                                      item.regularizationStatus !=
                                        "pending" && (
                                        <PopoverHeader>
                                          <Button
                                            className="ic-edit icon icon-sm text-link mr-8 regularize_btn"
                                            onClick={openModel.bind(
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
                {filteredKeywords &&
                  filteredKeywords.length == 0 &&
                  loading == false && (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No record
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
            <b>{selectedMonth} Month</b> <br /> Attendance Summary
          </small>
          <br />{" "}
          {ReportingName
            ? ReportingName
            : user?.data?.first_name + " " + user?.data?.last_name}
        </p>

        <div className="stats">
          <div className="stats-big">{"" + hrs + "h" + ":" + min + "m"}</div>

          <div className="stats-small">Avg/Day</div>
        </div>
        <div className="stats">
          <div className="stats-big">{totalHours}</div>

          <div className="stats-small">Total Net Work Hours</div>
        </div>

        <div className="stats">
          <div className="stats-big">{shortDays}</div>

          <div className="stats-small">Short Days</div>
        </div>
        <div className="stats">
          <div className="stats-big">{percentage}%</div>
          <div className="stats-small">On-time Arrival</div>
        </div>
      </div>
      <Request
        isOpen={regularizeModal}
        closeModal={() =>setRegularizeModal(false)}
        attendance={attendanceDetailPerDate}
        userId={user?.data?._id}
        pageRefresh={() => {
          getAttendanceList();
        }}
        attendanceListDate={loginDate}
      />
      <Footer />
    </div>
  );
};

// function mapStateToProps(state) {
//   const {
//     attendance,
//     error,
//     success,
//     regularize_modal,
//     loading,
//     CheckRegerror,
//   } = state.rootReducer.attendances;
//   const { ReportingList } = state.rootReducer.users;
//   const { UserListForReporting } = state.rootReducer.adminUsers;
//   // console.log("success", attendance);
//   return {
//     error,
//     success,
//     attendance,
//     ReportingList,
//     regularize_modal,
//     loading,
//     CheckRegerror,
//     UserListForReporting,
//   };
// }

export default Index;
