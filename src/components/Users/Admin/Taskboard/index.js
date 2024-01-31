import React, { useEffect, useMemo, useState } from "react";
import "./assets/css/style.css";
import Navbar from "../Layout/Navbar";
import EmployeeNavbar from "../../Employee/Layout/Navbar";
import Footer from "../../../GlobalComponents/Footer";
import { Redirect, useParams } from "react-router-dom";
import Back from "../../../../assets/images/back-arrow.png";
import ModelTask from "./Model/Task";
import ModelSprint from "./Model/Sprint";
import {
  sprintBoardTask,
  getTaskApiCall,
  getModuleList,
  getProjectName,
} from "./Services/taskBoard.services";
import Multiselect from "multiselect-react-dropdown";
import ModulModule from "../../Admin/Taskboard/Model/Modules";
import BoardList from "./BoardList";
import dateFormat from "dateformat";

const Index = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [toggleTask, setToggleTask] = useState(false);
  const [toggleSprint, setToggleSprint] = useState(false);
  const [sprintOption, setSprintOption] = useState([]);
  const [selectSprintId, setSelectSprintId] = useState("");
  const [modulesToggle, setModulesToggle] = useState(false);
  const [selectModule, setSelectModule] = useState("");
  const [collapse, setCollapsed] = useState(true);
  const [projectName, setProjectName] = useState();
  const [task, setTask] = useState([]);
  const [totalHour, setTotalHours] = useState({
    todoTotalHours: 0,
    progressTotalHours: 0,
    testTotalHours: 0,
    bugTotalHours: 0,
    completedTotalHours: 0,
  });
  const [uniqueModule, setUniqueModule] = useState([]);
  const [uniqueName, setUniqueModuleName] = useState([]);
  const [updateSprint, setUpdateSprint] = useState(true);
  const [moduleUniqueId, setModuleUniqueId] = useState("");
  useEffect(() => {
    getProjectName({ id }).then((result) => {
      if (result.status == 200) {
        const { name, start_date, end_date } = result.data;
        setProjectName({ name, start_date, end_date });
      }
    });
    sprintTask();
  }, [id]);

  const sprintTask = () => {
    sprintBoardTask({ projectId: id }).then((result) => {
      const sprintArr = [];
      if (result?.status == 200) {
        result?.data?.data?.forEach((item) => {
          sprintArr.push({
            cat: item.projectsprints._id,
            start_date: item.projectsprints.startDate,
            end_date: item.projectsprints.endDate,
            key:
              // item.projectsprints.title
              item.projectsprints.title.length <= 15
                ? item.projectsprints.title
                : item.projectsprints.title.slice(0, 15) + "...",
          });
        });

        sprintArr[0]?.cat && setSelectSprintId(sprintArr[0]?.cat);

        if (sprintArr?.length != 0 && updateSprint) {
          setSelectSprintId(sprintArr[0].cat);
          setUpdateSprint(false);
        }
        setSprintOption(sprintArr);
      }

      if (result?.response?.status == 400) {
        console.log("Error", result);
      }
    });
  };

  useEffect(() => {
    if (selectSprintId) getModule();
  }, [selectSprintId]);

  const getModule = () => {
    getModuleList({
      sprintId: selectSprintId,
      projectId: id,
    }).then((result) => {
      if (result.status == 200) {
        const ModuleIdList = result.data.map((i) => i.taskmodules._id);
        const uniqueName = result.data.map((i) => i.taskmodules.title);
        const moduleUniqueId = result.data.map((i) => i.taskmodules.module_UID);
        setUniqueModule(ModuleIdList);
        setUniqueModuleName(uniqueName);
        setModuleUniqueId(moduleUniqueId);
      }
    });
  };
  useEffect(() => {
    if (selectSprintId && id) getTask();
  }, [uniqueModule, uniqueName]);
  const getTask = () => {
    getTaskApiCall({
      sprintId: selectSprintId,
      projectId: id,
    }).then((result) => {
      if (result.status == 200) {
        let taskWithModule = [];
        let todoTotalHours = 0;
        let progressTotalHours = 0;
        let testTotalHours = 0;
        let bugTotalHours = 0;
        let completedTotalHours = 0;
        uniqueModule.forEach((moduleId, i) => {
          let todo = [];
          let progress = [];
          let test = [];
          let completed = [];
          let bug = [];
          let totalModuleHours = 0;
          result.data.data?.forEach((item) => {
            if (item.tasks.taskModuleId._id == moduleId) {
              let obj = {
                taskID: item.tasks._id,
                task: item.tasks.task_description,
                estimatedHours: item.tasks.estimatedHours,
                hoursLeft: item.tasks.hoursLeft,
                userId: item.tasks.userId.map((i) => i._id),
                sprintId: item.tasks.sprintId,
                createdBy: item.tasks.createdBy,
                title: item.tasks.title,
                priority: item.tasks.priority,
                userName: item.tasks.userId,
                taskCount: item.tasks.task_UID,
              };

              if (item.tasks.status == "backlog") {
                todo.push(obj);
                todoTotalHours += item.tasks.estimatedHours;
              }
              if (item.tasks.status == "in progress") {
                progress.push(obj);
                progressTotalHours += item.tasks.estimatedHours;
              }
              if (item.tasks.status == "select for development") {
                test.push(obj);
                testTotalHours += item.tasks.estimatedHours;
              }
              if (item.tasks.status == "done") {
                completed.push(obj);
                completedTotalHours += item.tasks.estimatedHours;
              }
              if (item.tasks.status == "bug") {
                bug.push(obj);
                bugTotalHours += item.tasks.estimatedHours;
              }
              totalModuleHours += item.tasks.estimatedHours;
            }
          });
          taskWithModule.push({
            totalModuleHours,
            moduleId,
            moduleName: uniqueName[i],
            moduleUniqueId: moduleUniqueId[i],
            todo,
            progress,
            test,
            completed,
            bug,
          });
        });
        setTask(taskWithModule);
        setTotalHours({
          todoTotalHours,
          progressTotalHours,
          testTotalHours,
          bugTotalHours,
          completedTotalHours,
        });
      }
    });
  };
  const addSprint = () => {
    setToggleSprint(true);
  };

  const todoTimeFormat = useMemo(() => {
    let hour = totalHour.todoTotalHours.toFixed(2);
    let hourSplit = hour.split(".");
    let mint = ((hourSplit[1] * 60) / 100).toFixed(0);

    hour =
      (hourSplit[0] < 10 ? "0" + hourSplit[0] : hourSplit[0]) +
      ":" +
      (mint < 10 ? "0" + mint : mint);
    return hour;
  }, [totalHour.todoTotalHours]);

  const progressTimeFormat = useMemo(() => {
    let hour = totalHour.progressTotalHours.toFixed(2);
    let hourSplit = hour.split(".");
    let mint = ((hourSplit[1] * 60) / 100).toFixed(0);

    hour =
      (hourSplit[0] < 10 ? "0" + hourSplit[0] : hourSplit[0]) +
      ":" +
      (mint < 10 ? "0" + mint : mint);
    return hour;
  }, [totalHour.progressTotalHours]);

  const testTimeFormat = useMemo(() => {
    let hour = totalHour.testTotalHours.toFixed(2);
    let hourSplit = hour.split(".");
    let mint = ((hourSplit[1] * 60) / 100).toFixed(0);

    hour =
      (hourSplit[0] < 10 ? "0" + hourSplit[0] : hourSplit[0]) +
      ":" +
      (mint < 10 ? "0" + mint : mint);
    return hour;
  }, [totalHour.testTotalHours]);

  const bugTimeFormat = useMemo(() => {
    let hour = totalHour.bugTotalHours.toFixed(2);
    let hourSplit = hour.split(".");
    let mint = ((hourSplit[1] * 60) / 100).toFixed(0);

    hour =
      (hourSplit[0] < 10 ? "0" + hourSplit[0] : hourSplit[0]) +
      ":" +
      (mint < 10 ? "0" + mint : mint);
    return hour;
  }, [totalHour.bugTotalHours]);

  const completedTimeFormat = useMemo(() => {
    let hour = totalHour.completedTotalHours.toFixed(2);
    let hourSplit = hour.split(".");
    let mint = ((hourSplit[1] * 60) / 100).toFixed(0);

    hour =
      (hourSplit[0] < 10 ? "0" + hourSplit[0] : hourSplit[0]) +
      ":" +
      (mint < 10 ? "0" + mint : mint);
    return hour;
  }, [totalHour.completedTotalHours]);

  const TotalTime = useMemo(
    (
      times = [
        todoTimeFormat,
        progressTimeFormat,
        testTimeFormat,
        bugTimeFormat,
        completedTimeFormat,
      ]
    ) => {
      const z = (n) => (n < 10 ? "0" : "") + n;

      let hour = 0;
      let minute = 0;
      for (const time of times) {
        const splited = time.split(":");
        hour += parseInt(splited[0]);
        minute += parseInt(splited[1]);
      }
      const minutes = parseInt(minute % 60);
      const hours = hour + parseInt(minute / 60);

      return z(hours) + ":" + z(minutes);
    },
    [
      todoTimeFormat,
      progressTimeFormat,
      testTimeFormat,
      bugTimeFormat,
      completedTimeFormat,
    ]
  );

  if (!user) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      {user.data.user_role === "Admin" ? (
        <Navbar activePage="dashboard" />
      ) : (
        <EmployeeNavbar activePage="dashboard" />
      )}
      <main className="offset fullscreen no-scroll">
        <div className="container-fluid hard-pad">
          <div className="row align-items-center pt-2 border-mobile">
            <div className="col-sm-4 col-6">
              <h6 className="ProjectName mb-0">
                {user.data.user_role === "Admin" ? (
                  <a href="/admin/projects" className="backlink">
                    <img src={Back} />
                  </a>
                ) : (
                  <a href="/employee/projects" className="backlink">
                    <img src={Back} />
                  </a>
                )}
                <span className="mr-3">{projectName?.name}</span>
              </h6>
            </div>
            <div
              className="col-sm-8 text-right"
              style={{ position: "relative", zIndex: 2 }}
            >
              <div className="justify-content-end align-items-center d-flex">
                {sprintOption.length > 0 &&
                  sprintOption
                    ?.filter((spt) => selectSprintId == spt.cat)
                    .map((itm, ind) => (
                      <React.Fragment key={ind}>
                        <span className="mr-1 small">
                          {dateFormat(itm.start_date, "mediumDate")}
                        </span>{" "}
                        -
                        <span className="ml-1 small">
                          {dateFormat(itm.end_date, "mediumDate")}
                        </span>
                      </React.Fragment>
                    ))}
                <div className="d-flex align-items-center ml-3">
                  <div>
                    <Multiselect
                      style={{ inputField: { border: "2px soli red" } }}
                      className="multiselect-box"
                      displayValue="key"
                      onSelect={(e) => setSelectSprintId(e[0]?.cat)}
                      options={sprintOption}
                      singleSelect
                      selectedValues={
                        sprintOption.length != 0
                          ? sprintOption?.filter(
                              (_, i) => selectSprintId == sprintOption[i].cat
                            )
                          : []
                      }
                    />
                  </div>
                  <div>
                    <a
                      href="#"
                      className="btn btn-square btn-dark ml-2"
                      onClick={addSprint}
                    >
                      +
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-2">
          <div className="work_progress_bar">
            <table className="table table-bordered dragAndDropBottomMargin table_scroll">
              <thead>
                <tr
                  className={
                    collapse ? "header_row collapsed_row" : "header_row"
                  }
                >
                  <td colSpan="2" className="first_col border-right-0">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <a
                          href="#"
                          className="anchor_collaps_all"
                          onClick={() => setCollapsed(!collapse)}
                        >
                          {/*<span className="mr-0 indicator">➠ </span>*/}
                          <span>MILESTONES</span>
                        </a>
                      </div>
                      <div>
                        <strong className="pl-1">{TotalTime} &nbsp; Points</strong>
                      </div>
                      {sprintOption.length != 0 && (
                        <div>
                          <a
                            href="#"
                            className="btn btn-default btn-circle btn-sm"
                            onClick={() => setModulesToggle(true)}
                          >
                            +
                          </a>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="process_heading">
                      <div className="d-flex align-items-center justify-content-between">
                        <span>To Do</span>
                        <strong>{todoTimeFormat} Points</strong>
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <div className="process_heading">
                      <div className="d-flex align-items-center justify-content-between">
                        <span>In Progress</span>
                        <strong className="pl-1">
                          {progressTimeFormat} Points
                        </strong>
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <div className="process_heading">
                      <div className="d-flex align-items-center justify-content-between">
                        <span>Ready to Test</span>
                        <strong className="pl-1">{testTimeFormat} Points</strong>
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <div className="process_heading">
                      <div className="d-flex align-items-center justify-content-between">
                        <span>Bug</span>
                        <strong>{bugTimeFormat} Points</strong>
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <div className="process_heading">
                      <div className="d-flex align-items-center justify-content-between">
                        <span>Done</span>
                        <strong>{completedTimeFormat} Points</strong>
                      </div>
                    </div>
                  </td>
                </tr>
              </thead>
              {/* {collapse ? ( */}
              <tbody>
                {task?.map((modules) => {
                  return (
                    <BoardList
                      key={modules.moduleId}
                      setToggleTask={setToggleTask}
                      setSelectModule={setSelectModule}
                      module={modules}
                      id={id}
                      getTask={getTask}
                      refresh={getModule}
                      sprintId={selectSprintId}
                      sprintOption={sprintOption}
                      collapse={collapse}
                      projectName={projectName}
                    />
                  );
                })}
              </tbody>
              {/* ) : ( */}
              {/* "" */}
              {/* )} */}
            </table>
          </div>
        </div>
      </main>
      <ModelTask
        toggle={toggleTask}
        setToggle={setToggleTask}
        ID={id}
        selectSprintId={selectSprintId}
        taskModuleId={selectModule}
        getTask={getTask}
      />
      <ModulModule
        modulesToggle={modulesToggle}
        setModulesToggle={setModulesToggle}
        sprintId={selectSprintId}
        projectId={id}
        size="lg"
        refresh={getModule}
      />
      <ModelSprint
        toggle={toggleSprint}
        setToggle={setToggleSprint}
        ID={id}
        updateSprintTask={sprintTask}
      />
      <Footer />
    </div>
  );
};

export default Index;
