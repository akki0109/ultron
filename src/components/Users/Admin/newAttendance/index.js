import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../Layout/Navbar";
import Select from "react-select";
import { adminUserService } from "../../../../services/admin/newAttendance.service";
import dateFormat from "dateformat";
import RegularizeModel from "./viewTiming";
import { useLayoutEffect } from "react";

const Attendance = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const date = new Date();
  const [month, setMonth] = useState(date.getMonth());
  const [userList, setUserList] = useState([]);
  const [selectUser, setSelectUser] = useState();
  const [monthList, setMonthList] = useState([]);
  const [id, setId] = useState();
  const [attendanceSummery, setAttendanceSummery] = useState([]);
  const [year, setYear] = useState({
    value: date.getFullYear(),
    label: date.getFullYear(),
  });
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

  useEffect(() => {
    getUserList();
  }, []);

  useEffect(() => {
    if (month + 1 && year && selectUser?.value) {
      getAtendanceList();
    }
  }, [month, year, selectUser]);

  const getLstDayOfMonFnc = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  };
  const getAtendanceList = () => {
    adminUserService
      .getAttendance({
        userId: selectUser.value,
        fromdate:
          year.value +
          "-" +
          (month + 1 < 10 ? "0" + (month + 1) : month + 1) +
          "-" +
          "01",
        todate:
          year.value +
          "-" +
          (month + 1 < 10 ? "0" + (month + 1) : month + 1) +
          "-" +
          getLstDayOfMonFnc(new Date(year.value, month + 1, 15)),
      })
      .then((result) => {
        let newArrayObj = result.data.map((item) => {
          return { ...item, toggleModel: true };
        });
        setMonthList(newArrayObj);
        setAttendanceSummery(result.rigthSideData);
      })
      .catch((error) => {});
  };

  const getUserList = () => {
    adminUserService.getUserListForReporting({ search: "" }).then((item) => {
      const arryObj = item.data.map((i) => {
        return { label: i.first_name + " " + i.last_name, value: i._id };
      });
      const obj = item.data.filter((item) => item._id == user.data._id);
      setUserList(arryObj);
      setSelectUser({
        label: obj[0].first_name + " " + obj[0].last_name,
        value: obj[0]._id,
      });
    });
  };

  const yearList = useMemo(() => {
    return Array(4)
      .fill("")
      .map((_, index) => {
        return {
          value: new Date().getFullYear() - 3 + index,
          label: new Date().getFullYear() - 3 + index,
        };
      });
  }, []);

  const handleReportUser = (e) => {
    setSelectUser(e);
  };
  const toggleModelFun = (idx, toggle) => {
    let newArrObj = [...monthList];
    if (typeof id == "number") {
      newArrObj[id].toggleModel = false;
      setMonthList(newArrObj);
      setTimeout(() => {
        defaultValueSet();
      }, 100);
    }
    setId(idx);
  };
  const defaultValueSet = () => {
    let newArrObj = monthList.map((item) => {
      return { ...item, toggleModel: true };
    });
    setMonthList(newArrObj);
  };

  return (
    <div>
      <Navbar />
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
                onChange={(e) => setYear(e)}
                value={year}
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
                  onChange={handleReportUser}
                  value={selectUser}
                  options={userList}
                />
              </div>
            </div>
            <div className="col-lg-9 p-0">
              <nav aria-label="Page navigation">
                <ul className="pagination mb-0">
                  {allMonth.map((newMonth, idx) => (
                    <li
                      key={idx}
                      className={
                        idx == month ? "page-item active" : "page-item"
                      }
                    >
                      <a
                        onClick={() => setMonth(idx)}
                        className="page-link"
                        href="javascript:;"
                      >
                        {newMonth}
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
                    Net Hrs
                  </th>
                  <th scope="col" className="text-left">
                    Gross Hrs
                  </th>
                  <th scope="col" className="text-left">
                    Arrival
                  </th>
                  <th scope="col" className="text-left">
                    Log Out
                  </th>
                  <th scope="col" className="text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {console.log(123, monthList)}
                {monthList.map((item, i) => (
                  <tr>
                    <td>
                      {dateFormat(item.loginDate, "ddd, dd mmm")}
                      {item.isWeekOff == "WeekOff" && (
                        <div className="text-muted small">{item.isWeekOff}</div>
                      )}
                      {item.isHoliday.length > 0 && (
                        <div className="text-muted small">Holiday</div>
                      )}
                      {item.regularizationStatus == "approved" && (
                        <span className="capsule alt_capsule green-dim text-center ml-3 ">
                          REG
                        </span>
                      )}
                      {item.regularizationStatus == "reject" && (
                        <span className="capsule alt_capsule green-dim text-center ml-3 ">
                          REJECT
                        </span>
                      )}
                      {/* <div className="text-danger small">
                        Second Half - Unpaid Leave
                      </div> */}
                    </td>
                    <td className="text-left">{item.totalEffectiveTime}</td>
                    <td className="text-left">{item.grossTime}</td>
                    <td className="text-left">{item.log_in_time}</td>
                    <td className="text-left">{item.log_out_time}</td>
                    <td data-th="Order Value" className="text-center">
                      <div>
                        <button
                          type="button"
                          id={`UncontrolledPopover${i}`}
                          className="btn btn-light btn-sm"
                          onClick={() => toggleModelFun(i, item.toggleModel)}
                        >
                          {item?.regularizationStatus == undefined &&
                            item.isWeekOff != "WeekOff" &&
                            !(item.isHoliday.length > 0) && (
                              <i
                                className="fa-lg fa fa-exclamation-circle text-warning"
                                aria-hidden="true"
                              ></i>
                            )}
                          {item?.regularizationStatus == "approved" && (
                            <i
                              className="fa fa-check-circle text-success fa-lg"
                              aria-hidden="true"
                            ></i>
                          )}
                          {item?.regularizationStatus == "pending" && (
                            <i
                              class="fa-lg fa fa-hourglass-half text-warning"
                              aria-hidden="true"
                            ></i>
                          )}
                        </button>
                        {item.toggleModel && (
                          <RegularizeModel
                            i={i}
                            attendaceDetails={item.attendanceDetail}
                            date={item.loginDate}
                            getAtendanceList={getAtendanceList}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <div className="right-aside">
        <p className="mt-4 text-center">
          <small>
            <b>Dec Month</b> <br /> Attendance Summary
          </small>
          <br /> {selectUser?.label}
        </p>
        <div className="stats">
          <div className="stats-big">{attendanceSummery.avgPerDay}</div>
          <div className="stats-small">Avg/Day</div>
        </div>
        <div className="stats">
          <div className="stats-big">{attendanceSummery.totalNetWorkHrs}</div>
          <div className="stats-small">Total Net Work Hours</div>
        </div>
        <div className="stats">
          <div className="stats-big">{attendanceSummery.shortDays}</div>
          <div className="stats-small">Short Days</div>
        </div>
        <div className="stats">
          <div className="stats-big">{attendanceSummery.onTimeArrival}%</div>
          <div className="stats-small">On-time Arrival</div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
