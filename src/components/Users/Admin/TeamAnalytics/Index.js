import React, { useEffect, useState, useMemo } from "react";
import { Redirect } from "react-router-dom";
import Footer from "../../../GlobalComponents/Footer";
import Navbar from "../Layout/Navbar";
import Select from "react-select";
import {
  getUserListForReporting,
  graphDataApiCall,
} from "../../../../services/admin/report.services";
import { Pie, Bar } from "react-chartjs-2";
import dateFormat from "dateformat";
import DetailSheet from "./DetailSheet/Index";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import {
  allMonth,
  monthNames,
  optionsTeamAnalytics,
  ChartColor,
  TeamAnalyticsPieChart,
} from "../../../../utilities/reportContent";
import { Button } from "reactstrap";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Index = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [year, setYear] = useState({ value: currentYear, label: currentYear });
  const [reportList, setReportList] = useState();
  const [selectEmployee, setSelectEmployee] = useState();
  const [Month, setMonth] = useState(currentMonth);
  const [project, setProject] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [toggle, setToggle] = useState();
  const [stackLabel, setStackLabel] = useState([]);
  const [stackDate, setStackDate] = useState([]);
  const [pieProject, setPieProject] = useState([]);
  const [monthlyTotalHour, setMonthlyTotalHour] = useState(0);
  useEffect(() => {
    getUserListForReporting().then((item) => {
      let reportingList = [];
      if (item.data) {
        item?.data?.map((item) => {
          reportingList.push({
            value: item._id,
            label: item?.first_name + " " + item?.last_name,
          });
        });
        setReportList(reportingList);
        setSelectEmployee({
          value: user?.data?._id,
          label: user?.data?.first_name + " " + user?.data?.last_name,
        });
        getGraphData();
      }
    });
  }, []);
  useEffect(() => {
    getGraphData();
  }, [year, Month, selectEmployee]);

  const getGraphData = () => {
    graphDataApiCall({
      userId: selectEmployee?.value,
      from_date: `${year?.value}-${Month + 1}-01`,
      to_date: dateFormat(LastDayOfMonth(year?.value, Month + 1), "yyyy-mm-dd"),
    }).then((response) => {
      if (response?.data) {
        setGraphData(response?.data);
        const projects = [];
        const date = [];
        const pieProjectLabel = [];
        response.data?.map((item) => {
          if (date.includes(item.projecttasks.date) != true)
            date.push(item.projecttasks.date);
          if (pieProjectLabel.includes(item.projectData[0].name) != true)
            pieProjectLabel.push(item.projectData[0].name);
          if (
            projects.filter(
              (itemProject) => itemProject.id == item?.projectData[0]?._id
            ).length == 0
          ) {
            projects.push({
              name: item?.projectData[0]?.name,
              id: item?.projectData[0]?._id,
            });
          }
        });
        setPieProject(pieProjectLabel);
        setStackDate(date);

        const properDateFormat = date.map((item) => {
          const date = new Date(item);
          const month = monthNames[date.getMonth()];
          const day = date.getDate();
          return day + " " + month;
        });

        setStackLabel(properDateFormat);
        setProject(projects);
      }
    });
  };

  const LastDayOfMonth = (Year, Month) => {
    return new Date(new Date(Year, Month, 1) - 1);
  };

  const handleYear = (e) => {
    setYear(e);
  };

  const handleEmploye = (e) => {
    setSelectEmployee(e);
  };

  const handleMonth = (idx) => {
    setMonth(idx);
  };
  const stackDataArragement = useMemo(() => {
    let filterData = [];
    let time = 0;
    const multiDimentionalArray = Array(project.length)
      ?.fill("")
      ?.map(() => []);
    stackDate.map((itemDate) => {
      project.map((itemProject, index) => {
        time = 0;
        filterData = graphData.filter(
          (iteamGraph) =>
            iteamGraph.projecttasks.date == itemDate &&
            iteamGraph.projecttasks.projectId == itemProject.id
        );
        if (filterData.length) {
          filterData.map((itemFilter) => {
            time += parseFloat(itemFilter.projecttasks.time);
          });
        }
        multiDimentionalArray[index].push(time);
      });
    });
    return multiDimentionalArray;
  }, [graphData]);

  const totalHour = useMemo(() => {
    let totalHourPerProject = [];
    let count = 0;
    let hour = 0;
    let mint =0;
    for (const arr of stackDataArragement) {
      arr.map((item) => {
        count += parseFloat(item);
        hour += item;
      });

      //for time calculate
      /*count=count.toFixed(2);
      subSplitHours=count.split(".");
      count=subSplitHours[0]+"."+(subSplitHours[1]*60/100).toFixed(0);*/

      totalHourPerProject.push(count);
      count = 0;
    }
    //for time calculate
    hour = hour.toFixed(2);
    let hourSplit = hour.split(".");
    mint = ((hourSplit[1] * 60) / 100).toFixed(0);

    hour =
      (hourSplit[0] < 10 ? "0" + hourSplit[0] : hourSplit[0]) +
      ":" +
      (mint < 10 ? "0" + mint : mint);
    setMonthlyTotalHour(hour);
    return totalHourPerProject;
  }, [stackDataArragement]);

  const datasets = useMemo(() => {
    const sets = stackDataArragement?.map((item, i) => {
      return {
        label: project[i].name,
        data: item,
        backgroundColor: ChartColor.backgroundColor[i],
      };
    });
    return sets;
  }, [stackDataArragement]);

  const pieData = {
    labels: pieProject,
    datasets: [
      {
        label: "Total Hour",
        data: totalHour,
        ...ChartColor,
      },
    ],
  };

  const stackedData = {
    labels: [...stackLabel],
    datasets,
  };

  if (!user) {
    return <Redirect to="/" />;
  }
  if (user.data.user_role !== "Admin") {
    return <Redirect to="/" />;
  }
  return (
    <div>
      <Navbar activePage="dashboard" />
      <main className="offset">
        <div className="container-fluid hard-pad">
          <div className="row align-items-center pt-4 border-mobile">
            <div className="col-md-4 col-6">
              <h2 className="page-heading"> Report </h2>
            </div>
            <div
              className="col-md-3 offset-md-5 col-6"
              style={{ position: "relative", zIndex: 2 }}
            >
              <Select
                onChange={(e) => handleYear(e)}
                value={year}
                options={Array(3)
                  .fill("")
                  .map((_, index) => {
                    return {
                      value: new Date().getFullYear() - 2 + index,
                      label: new Date().getFullYear() - 2 + index,
                    };
                  })}
              />
            </div>
          </div>

          <div className="row align-items-center pt-4 border-mobile">
            <div className="col-lg-4">
              <div
                className="d-flex"
                style={{ position: "relative", zIndex: 2 }}
              >
                <Select
                  onChange={(e) => {
                    handleEmploye(e);
                  }}
                  value={selectEmployee}
                  options={reportList}
                  className="inline-block"
                />
                <Button onClick={() => setToggle(true)} className="ml-2">
                  View Details
                </Button>
              </div>
            </div>
            <div className="col-lg-8">
              <nav aria-label="Page navigation">
                <ul className="pagination my-0">
                  {allMonth.map((month, idx) => (
                    <li
                      key={idx}
                      className={"page-item " + (Month == idx ? "active" : "")}
                    >
                      <a
                        onClick={() => {
                          handleMonth(idx);
                        }}
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
          <div className="mt-5">
            <DetailSheet
              graphData={graphData}
              toggle={toggle}
              setToggle={setToggle}
              month={Month}
              Employee={selectEmployee?.label}
            />
            <Bar
              options={optionsTeamAnalytics}
              data={stackedData}
              redraw={true}
            />
          </div>
        </div>
      </main>
      <div className="right-aside">
        <p className="mt-5 text-center">
          <small>
            <h5>
              <b> Monthly Total Hour's</b>
              <h4 className="mt-2">{monthlyTotalHour}</h4>
            </h5>
            <h6>Time Sheet Summary</h6>
          </small>
        </p>
        <div className="mt-4">
          <Pie options={TeamAnalyticsPieChart} data={pieData} redraw={true} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
