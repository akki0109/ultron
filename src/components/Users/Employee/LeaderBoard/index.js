import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../Layout/Navbar";
import Select from "react-select";
import { UserLeaderBoardService } from "../../../../services/leaderboard.services";
import Table from "react-bootstrap/Table";
import dateFormat from "dateformat";
import firstLeader from "../../../../assets/images/first-leader.png";
import secondLeader from "../../../../assets/images/second-leader.png";
import thirdLeader from "../../../../assets/images/third-leader.png";
import empPicture from "../../../../assets/images/emp_img1.jpg";
import { APIURL } from "../../../../constants/config";
import { allMonth } from "../../../../utilities/reportContent";

const LeaderBoard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentWeek = getISOWeek(new Date());
  const [leaderList, setLeaderList] = useState([]);
  const [topCaption, setTopCaption] = useState([]);
  const [startYear, setStartYear] = useState(2022);
  const [noRecord, setNoRecord] = useState(false);
  const [noRecordCaption, setNoRecordCaption] = useState(false);

  const getMonthName = (monthNumber) => {
    return allMonth[monthNumber - 1];
  };

  const [selectedYear, setSelectedYear] = useState({
    value: currentYear,
    label: currentYear.toString(),
  });
  const [selectedMonth, setSelectedMonth] = useState({
    value: currentMonth,
    label: getMonthName(currentMonth),
  });
  const [selectedWeek, setSelectedWeek] = useState({
    value: currentWeek,
    label: `Week ${currentWeek}`,
  });
  const [fromDate, setFromDate] = useState(
    new Date(currentYear, currentMonth - 1, 1)
  );
  const [toDate, setToDate] = useState(new Date());

  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => {
      const yearValue = startYear + index;
      return {
        value: yearValue,
        label: yearValue.toString(),
      };
    }
  );

  const months = selectedYear
    ? Array.from({ length: 12 }, (_, index) => {
        const monthValue = index + 1;
        return {
          value: monthValue,
          label: getMonthName(monthValue),
        };
      })
    : [];
  months.unshift({ value: "", label: "All Month" });

  useEffect(() => {
    if (fromDate && toDate) {
      getBoardList();
      getCaptionList();
    }
  }, [fromDate, toDate]);

  const getCaptionList = () => {
    UserLeaderBoardService.getTopCaption({
      fromDate: dateFormat(fromDate, "isoDate"),
      toDate: dateFormat(toDate, "isoDate"),
    })
      .then((result) => {
        setNoRecordCaption(true);
        setTopCaption(result.data);
      })
      .catch(() => {
        setNoRecordCaption(true);
      });
  };
  const getBoardList = () => {
    UserLeaderBoardService.getLeaderBoardList({
      fromDate: dateFormat(fromDate, "isoDate"),
      toDate: dateFormat(toDate, "isoDate"),
    })
      .then((result) => {
        setNoRecord(true);
        console.log("result", result);
        setLeaderList(result.data);
      })
      .catch((error) => {
        setNoRecord(true);
        console.log("error", error);
      });
  };

  function getWeeksInMonth(year, month) {
    const weeks = [],
      firstDate = new Date(year, month - 1, 1),
      lastDate = new Date(year, month, 0),
      numDays = lastDate.getDate();
    let currentWeek = [];

    for (let date = 1; date <= numDays; date++) {
      const currentDate = new Date(year, month - 1, date);
      const dayOfWeek = currentDate.getDay();

      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentWeek.push({
        date,
        dayOfWeek,
      });
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks.map((week, index) => {
      const startDate = week[0].date;
      const endDate = week[week.length - 1].date;

      return {
        value: index + 1,
        label: `Week ${index + 1}: ${startDate} to ${endDate}`,
        days: week,
      };
    });
  }

  const weeks =
    selectedYear && selectedMonth
      ? getWeeksInMonth(selectedYear.value, selectedMonth.value)
      : [];

  const updateDates = () => {
    const flag = 0;
    if (selectedYear && selectedMonth && selectedWeek && flag == 1) {
      const week = weeks.find((week) => week.value === selectedWeek.value);

      if (week && week.days && week.days.length > 0) {
        const startDate = new Date(
          selectedYear.value,
          selectedMonth.value - 1,
          week.days[0].date
        );
        let endDate;

        if (week.days.length < 7) {
          endDate = new Date(
            selectedYear.value,
            selectedMonth.value - 1,
            week.days[week.days.length - 1].date
          );
        } else {
          endDate = new Date(
            selectedYear.value,
            selectedMonth.value - 1,
            week.days[6].date
          );
        }
        setFromDate(startDate);
        setToDate(endDate);
      }
    } else if (selectedYear && selectedMonth && selectedMonth.value != "") {
      const startDate = new Date(
        selectedYear.value,
        selectedMonth.value - 1,
        1
      );
      const endDate = new Date(selectedYear.value, selectedMonth.value, 0);
      setFromDate(startDate);
      setToDate(endDate);
      console.log("hiii");
    } else if (selectedYear) {
      const startDate = new Date(selectedYear.value, 0, 1);
      const endDate = new Date(selectedYear.value, 11, 31);
      setFromDate(startDate);
      setToDate(endDate);
    }
  };

  useEffect(() => {
    updateDates();
  }, [selectedYear, selectedMonth, selectedWeek]);

  useEffect(() => {
    if (!selectedYear || !selectedMonth) {
      setSelectedWeek(null);
    }
  }, [selectedYear, selectedMonth]);

  if (!user) {
    return <Redirect to="/" />;
  }
  if (user.data.user_role !== "Employee") {
    return <Redirect to="/" />;
  }
  return (
    <div>
      <Navbar />
      <main className="offset gradiant-bgColor" style={{ marginRight: "0px" }}>
        <div className="container-fluid hard-pad">
          <div className="row pt-4 border-mobile">
            <div className="col d-flex justify-content-center">
              <h1 className="text-white heading-font">
                Top Scorer of the Month
              </h1>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-6 offset-1">
              <h2 className="heading-font text-white">Top Performer</h2>
              <div
                className="mt-3 leaderboard-topDeveloper"
                style={{ zIndex: 0 }}
              >
                {noRecord == true &&
                  leaderList?.length > 0 &&
                  leaderList?.map((item, index) => (
                    <div key={index} className="leader-ranking">
                      <div>
                        {item.users.profileImage != undefined &&
                        item.users.profileImage != "" ? (
                          <div>
                            <img
                              width="100px"
                              src={APIURL + "/" + item.users.profileImagePath}
                              alt="Employee image"
                            />
                          </div>
                        ) : (
                          <div>
                            <img
                              width="100px"
                              src={empPicture}
                              alt="Employee image"
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <p>
                          <b className="text-white naming-font">
                            {item.users["first_name"] +
                              " " +
                              item.users["last_name"]}
                          </b>
                        </p>
                        <h1 className="text-white number-font">
                          {item.tasks[0]?.totalTaskPoint.toFixed()}
                        </h1>
                      </div>

                      {index == 0 && (
                        <div>
                          <img src={firstLeader} alt="Image" />
                        </div>
                      )}
                      {index == 1 && (
                        <div>
                          <img
                            src={secondLeader}
                            alt="Image"
                            style={{ marginLeft: "12px" }}
                          />
                        </div>
                      )}
                      {index == 2 && (
                        <div>
                          <img src={thirdLeader} alt="Image" />
                        </div>
                      )}
                      {index > 2 && (
                        <div>
                          <h1
                            className="circular-pts circular-points mt-3"
                            style={{ marginLeft: "12px" }}
                          >
                            {index + 1}
                          </h1>
                        </div>
                      )}
                    </div>
                  ))}
                {noRecord == true && leaderList?.length == 0 && (
                  <div className="leader-ranking">
                    <div className="text-white h5 w-100 text-center">
                      No winners yet!
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-4">
              <h2 className="heading-font text-white">Top Captain</h2>
              <div className="top-caption mt-3">
                <div>
                  {noRecordCaption &&
                    topCaption.map((item, index) => (
                      <>
                        <div className="topCaption-leader">
                          <div>
                            <div>
                              {item.users.profileImage != undefined &&
                              item.users.profileImage != "" ? (
                                <img
                                  src={
                                    APIURL + "/" + item.users.profileImagePath
                                  }
                                  alt="Employee image"
                                />
                              ) : (
                                <img src={empPicture} alt="Employee image" />
                              )}
                            </div>
                          </div>
                          <div>
                            <p>
                              <b className="text-white naming-font">
                                {item.users.first_name +
                                  " " +
                                  item.users.last_name}
                              </b>
                            </p>
                            <h1 className="text-white number-font">
                              {item.users.totalProjectPoint.toFixed()}
                            </h1>
                          </div>
                          <div>
                            {index == 0 && (
                              <img src={firstLeader} alt="Image" />
                            )}
                            {index == 1 && (
                              <img
                                src={secondLeader}
                                width="100%"
                                height="100%"
                                style={{ marginLeft: "37px" }}
                              />
                            )}
                            {index == 2 && (
                              <img src={thirdLeader} alt="Image" />
                            )}
                            {index > 2 && (
                              <h1
                                className="circular-points pb-0 mb-0 mt-3"
                                style={{ marginLeft: "35px" }}
                              >
                                {index + 1}
                              </h1>
                            )}
                          </div>
                        </div>
                        {topCaption?.length != index + 1 && (
                          <div>
                            <hr width="50%" />
                          </div>
                        )}
                      </>
                    ))}
                  {noRecordCaption == true && topCaption?.length == 0 && (
                    <div className="text-white h5 No-winners-box text-center">
                      No winners yet!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
function getISOWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}
export default LeaderBoard;
