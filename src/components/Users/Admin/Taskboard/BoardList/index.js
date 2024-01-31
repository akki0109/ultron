import React, { useState, useEffect, memo, useMemo } from "react";
// import ToDoList from "../../../../../assets/images/to-do-list.png";
import EditImage from "../../../../../assets/images/threeDotHorizontal.png";
// import User3 from "../../../../../assets/images/joe.jpg";
import { APIURL } from "../../../../../constants/config";
import {
  saveBoardTaskDrag,
  changeTaskSprint,
} from "../Services/taskBoard.services";
import Comment from "../Model/Comment";
import Confimation from "../Model/Confirmation";
import Modules from "../Model/Modules";
import socketClient from "socket.io-client";

const index = (props) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [progressTasks, setProgressTasks] = useState([]);
  const [testingTasks, setTestingTask] = useState([]);
  const [completedTasks, setCompletedTask] = useState([]);
  const [todos, setTodos] = useState([]);
  const [bugTasks, setBugTasks] = useState([]);
  const [draggedTask, setDraggedTask] = useState({});
  const [from, setForm] = useState("");
  const [show, setShow] = useState(false);
  const [commentData, setCommentData] = useState();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [modulesToggle, setModulesToggle] = useState(false);
  const [isCollapse, setCollapse] = useState(true);
  const [taskId, setTaskId] = useState("");

  const moduledeletebutton = useMemo(() => {
    const { todo, progress, test, completed, bug } = props.module;
    if (
      todo.length > 0 ||
      progress.length > 0 ||
      test.length > 0 ||
      completed.length > 0 ||
      bug.length > 0
    ) {
      return false;
    } else {
      return true;
    }
  }, [props.module.todo,props.module.progress,props.module.test,props.module.completed,props.module.bug]);
  useEffect(() => {
    setTodos(props.module.todo);
    setProgressTasks(props.module.progress);
    setTestingTask(props.module.test);
    setCompletedTask(props.module.completed);
    setBugTasks(props.module.bug);
  }, [props.module]);
  useEffect(() => {
    if (props.collapse == false) {
      setCollapse(false);
    } else {
      setCollapse(true);
    }
  }, [props.collapse]);

  useEffect(() => {
    configureSocket(); 
  },[]);

  const onDrag = (...args) => {
    const [event, todo, from, userId, sprintId, createdBy, moduleId, priority] =
      args;
    event.preventDefault();
    setDraggedTask({
      ...todo,
      from,
      projectId: props.id,
      userId,
      sprintId,
      createdBy,
      moduleId,
      priority,
    });
    setForm(from);
  };
  const onDragOver = (event) => {
    event.preventDefault();
  };

  const onDropTodo = () => {
    if (
      draggedTask.from != "todo" &&
      draggedTask.moduleId == props.module.moduleId
    ) {
      setTodos([...todos, draggedTask]);
      saveTask("backlog");
      sliceData();
    }
  };

  const onDropProgresh = () => {
    if (
      draggedTask.from != "progress" &&
      draggedTask.moduleId == props.module.moduleId
    ) {
      setProgressTasks([...progressTasks, draggedTask]);
      saveTask("in progress");
      sliceData();
    }
  };

  const onDropTesting = () => {
    if (
      draggedTask.from != "testing" &&
      draggedTask.moduleId == props.module.moduleId
    ) {
      setTestingTask([...testingTasks, draggedTask]);
      saveTask("select for development");
      sliceData();
    }
  };

  const onDropComplete = () => {
    if (
      draggedTask.from != "completed" &&
      draggedTask.moduleId == props.module.moduleId
    ) {
      setCompletedTask([...completedTasks, draggedTask]);
      saveTask("done");
      sliceData();
    }
  };

  const onDropBug = () => {
    if (
      draggedTask.from != "bug" &&
      draggedTask.moduleId == props.module.moduleId
    ) {
      setBugTasks([...bugTasks, draggedTask]);
      saveTask("bug");
      sliceData();
    }
  };
  const saveTask = (status) => {
    console.log("draggedTask",draggedTask);
    saveBoardTaskDrag(draggedTask, props.id, status,user.data._id).then((result) => {
      if (result.status == 200) {
        sendNotification(draggedTask);
        props.getTask();
      } else console.log("error", result);
    });
  };

  const sendNotification = (draggedTask) => {
    if(draggedTask.userId.length==0)
    {
      draggedTask.userId.push(1);
    }
    if(draggedTask.userId.length){
      var getAllUsers=removeItemOnce(draggedTask.userId, user.data._id);
      if(getAllUsers.length==0)
      {
        getAllUsers.push(1);
      }
      if(getAllUsers.length){
        var socket = socketClient(APIURL, { transports: ["websocket"] });
        socket.emit("notification_board", { userId: getAllUsers,updatedBy: user.data._id,projectId:draggedTask.projectId });
      }
    }

  };

  const removeItemOnce = (arr, value) => {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  };

  const openTaskModel = (moduleId) => {
    props.setToggleTask(true);
    props.setSelectModule(moduleId);
  };
  const sliceData = () => {
    if (from == "todo") {
      setTodos((todos) =>
        todos.filter((task) => task.taskID != draggedTask?.taskID)
      );
    } else if (from == "progress") {
      setProgressTasks((progressTasks) =>
        progressTasks?.filter((task) => task.taskID != draggedTask?.taskID)
      );
    } else if (from == "testing") {
      setTestingTask((testingTasks) =>
        testingTasks?.filter((task) => task.taskID != draggedTask?.taskID)
      );
    }
    if (from == "completed") {
      setCompletedTask((completedTasks) =>
        completedTasks?.filter((task) => task.taskID != draggedTask?.taskID)
      );
    }
    if (from == "bug") {
      setBugTasks((BugTasks) =>
        BugTasks?.filter((task) => task.taskID != draggedTask?.taskID)
      );
    }
    setDraggedTask({ ...draggedTask, moduleId: "" });
  };
  const showCommentbox = (task) => {
    setShow(true);
    setCommentData(task);
  };
  const deleteConfirmationModule = () => {
    setDeleteConfirm(true);
    setTaskId({ _id: "", delete: "Module" });
  };

  const editModel = () => {
    setModulesToggle(true);
  };

  const selectSprint = (taskId, sprintId) => {
    changeTaskSprint({
      taskId,
      taskModuleId: props.module.moduleId,
      sprintId,
      projectId: props.id,
    }).then((result) => {
      if (result.status == 200) props.getTask();
      else console.log("error", result);
    });
  };

  const deleteTask = (_id) => {
    console.log("delete click karne par ", show);
    setTaskId({ _id, delete: "Task" });
    setDeleteConfirm(true);
  };
  const getFirstLetters = (str) => {
    const words = str.split(" ").filter(Boolean); // Filter out empty words

    if (words.length === 0) {
      return ""; // Handle empty input
    } else if (words.length === 1) {
      return words[0].slice(0, 2);
    } else if (words.length >= 2) {
      return words[0][0] + words[1][0];
    } else {
      return "";
    }
  };

  function convertTimeFormat(decimalHours) {
    if (isNaN(decimalHours)) {
      throw new Error("Invalid input format");
    }
  
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
  
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
  
    return `${formattedHours}:${formattedMinutes}`;
  }

  const configureSocket = () => {
    var socket = socketClient(APIURL, { transports: ["websocket"] });

    socket.on("notification_board", (data) => {
      if (data.projectId==props.id && data.updatedBy!=user.data._id == true) {
        props.getTask();
      }
     
    });
  };
  

  return (
    <>
      {isCollapse ? (
        <tr className={isCollapse ? "inline_table" : ""}>
          <td className="bg-white first_col" colSpan="2">
            <div className="d-flex">
              <div>
                <a
                  href="#"
                  className="anchor_collaps mr-3"
                  onClick={() => setCollapse((x) => !x)}
                ></a>
              </div>
              <div className="w-100">
                <div className="d-flex justify-content-between">
                  <div>
                    <div className="cnt" id="card1">
                      {/* {console.log("props=============>>>>>>>", props)} */}

                      {/* <strong>
                        {props.module.moduleUniqueId < 10
                          ? "M00" + props.module.moduleUniqueId
                          : "0" + props.module.moduleUniqueId}
                      </strong> */}
                      {/* {""} */}
                      {/* module id */}
                      <strong>{props.module.moduleName}</strong>
                    </div>
                    <div className="hour mt-2">
                      <strong>{convertTimeFormat(props.module.totalModuleHours)} Points</strong>
                    </div>
                  </div>
                  <strong>
                    <div className="d-inline taskPointer">
                      <div className="dropdown sub-dropdown-menu">
                        <img
                          src={EditImage}
                          alt="Menu"
                          title="Menu"
                          width={"16"}
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        />
                        <ul
                          className="dropdown-menu dropdown-menu-right"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <li className="dropdown-submenu">
                            <a className="dropdown-item" onClick={editModel}>
                              Edit
                            </a>
                          </li>
                          {moduledeletebutton && (
                            <li className="dropdown-submenu">
                              <a
                                className="dropdown-item"
                                onClick={deleteConfirmationModule}
                              >
                                Delete
                              </a>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </strong>
                </div>
              </div>
            </div>
          </td>
          <td
            className="todo"
            onDrop={(event) => onDropTodo(event)}
            onDragOver={(event) => onDragOver(event)}
          >
            {todos?.map((task) => (
              <div
                key={task.taskID}
                className={task.priority}
                style={{ position: "relative" }}
              >
                <div
                  className="card cursor_pointer"
                  draggable
                  onDrag={(event) =>
                    onDrag(
                      event,
                      task,
                      "todo",
                      task.userId,
                      task.sprintId,
                      task.createdBy,
                      props.module.moduleId,
                      task.priority
                    )
                  }
                  onClick={(event) => {
                    const isDropdownMenuClick =
                      event.target.id === "dropdownMenuButton" ||
                      event.target.closest(".dropdown-submenu");
                    if (!isDropdownMenuClick) {
                      showCommentbox(task);
                    }
                  }}
                >
                  <div className="d-flex">
                    <div className="cnt" id="text1">
                      <div>
                        <strong>
                          {/* {console.log("---->",props.projectName.name.toUpperCase())} */}
                          {getFirstLetters(
                            props.projectName.name.toUpperCase()
                          )}
                          {task.taskCount < 10
                            ? "00" + task.taskCount
                            : "0" + task.taskCount}
                        </strong>
                        
                        <span className="word-brick1 text_3line">{task.title}</span>
                      </div>
                    </div>
                  </div>
                  {/* <OverlayTrigger
                    placement={"top"}
                    overlay={
                      <Tooltip id="tooltip-top">{task.priority}</Tooltip>
                    }
                  >
                    <div
                      className={"prority " + task.priority}
                      id="priority4"
                    ></div>
                  </OverlayTrigger> */}
                  {task.userName.length != 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="user_assign">
                        {task.userName.length
                          ? task.userName.map((profile, index) => (
                              <span
                                data-toggle="tooltip"
                                data-placement="top"
                                title={
                                  profile?.first_name + " " + profile?.last_name
                                }
                                key={index}
                              >
                                <div key={index}>
                                  {profile?.profileImage ? (
                                    <a href="#" className="avtar">
                                      <img
                                        src={
                                          APIURL +"assets/uploads/profileImages/"+
                                          profile?.profileImage
                                        }
                                        alt={
                                          profile?.first_name +
                                          " " +
                                          profile.last_name
                                        }
                                      />
                                    </a>
                                  ) : (
                                    <div className="avtar">
                                      {profile?.first_name?.slice(0, 1) +
                                        profile?.last_name.slice(0, 1)}
                                    </div>
                                  )}
                                </div>
                              </span>
                            ))
                          : null}
                      </div>
                    </div>
                  )}
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="hour">
                      <strong>{task.estimatedHours} Points</strong>
                    </div>
                    <div>
                      <div className="dropdown sub-dropdown-menu">
                        <img
                          src={EditImage}
                          alt="Menu"
                          title="Menu"
                          width={"16"}
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        />
                        <ul
                          className="dropdown-menu dropdown-menu-right"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <li className="dropdown-submenu">
                            <a
                              className="dropdown-item"
                              onClick={() => deleteTask(task.taskID)}
                            >
                              Delete
                            </a>
                          </li>
                          {props.sprintOption?.length >= 2 &&
                          <li className="dropdown-submenu dropright">
                            <a className="dropdown-item dropdown-toggle" >
                              Move to iteration
                            </a>
                            <ul className="dropdown-menu dropDownBox dropdown-menu-right" >
                              {
                                props.sprintOption?.map((item) => {
                                  if (item.cat != props.sprintId)
                                    return (
                                      <li
                                        key={item.cat}
                                        onClick={() =>
                                          selectSprint(task.taskID, item.cat)
                                        }
                                      >
                                        <a className="dropdown-item">
                                          {item.key}
                                        </a>
                                      </li>
                                    );
                                })}
                            </ul>
                          </li>}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div
              className="addmore btn btn-default btn-circle btn-sm"
              onClick={() => {
                openTaskModel(props.module.moduleId);
              }}
            >
              +
            </div>
          </td>
          <td
            className="inprogress"
            onDrop={(event) => onDropProgresh(event)}
            onDragOver={(event) => onDragOver(event)}
          >
            {progressTasks.map((task) => (
              <div
                key={task.taskID}
                className={task.priority}
                style={{ position: "relative" }}
              >
                <div
                  className="card cursor_pointer"
                  onClick={(event) => {
                    const isDropdownMenuClick =
                      event.target.id === "dropdownMenuButton" ||
                      event.target.closest(".dropdown-submenu");
                    if (!isDropdownMenuClick) {
                      showCommentbox(task);
                    }
                  }}
                  draggable
                  onDrag={(event) =>
                    onDrag(
                      event,
                      task,
                      "progress",
                      task.userId,
                      task.sprintId,
                      task.createdBy,
                      props.module.moduleId,
                      task.priority
                    )
                  }
                >
                  <div>
                    {/*  <div className="user_assign mr-3">
                    //   <div style={{ marginRight: "-5px" }}>
                    //     <a href="#">
                    //     </a>
                    //   </div>
                    //   <div style={{ marginRight: "-5px" }}>
                    //     <div className="avtar">TN</div>
                    //   </div>
                    //   <div style={{ marginRight: "-5px" }}>
                    //     <div className="avtar">RT</div>
                    //   </div>
                     </div>
                     */}
                    <strong>
                      {getFirstLetters(props.projectName.name.toUpperCase())}

                      {task.taskCount < 10
                        ? "00" + task.taskCount
                        : "0" + task.taskCount}
                    </strong>
                    <span className="word-brick1 text_3line">{task.title}</span>
                  </div>
                  {/* <OverlayTrigger
                    placement={"top"}
                    overlay={
                      <Tooltip id="tooltip-top">{task.priority}</Tooltip>
                    }
                  >
                    <div
                      className={"prority " + task.priority}
                      id="priority4"
                    ></div>
                  </OverlayTrigger> */}
                  {task.userName.length != 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="user_assign">
                        {task.userName.length
                          ? task.userName.map((profile, index) => (
                              <span
                                data-toggle="tooltip"
                                data-placement="top"
                                title={
                                  profile?.first_name + " " + profile?.last_name
                                }
                                key={index}
                              >
                                <div key={index}>
                                  {profile?.profileImage ? (
                                    <a href="#" className="avtar">
                                      <img
                                        src={
                                          APIURL +"assets/uploads/profileImages/"+
                                          profile?.profileImage
                                        }
                                        alt={
                                          profile?.first_name +
                                          " " +
                                          profile.last_name
                                        }
                                      />
                                    </a>
                                  ) : (
                                    <div className="avtar">
                                      {profile?.first_name?.slice(0, 1) +
                                        profile?.last_name.slice(0, 1)}
                                    </div>
                                  )}
                                </div>
                              </span>
                            ))
                          : null}
                      </div>
                    </div>
                  )}
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="hour">
                      <strong>{task.estimatedHours} Points</strong>
                    </div>
                    <div>
                      <div
                        className="dropdown sub-dropdown-menu"
                        // style={{ zIndex: "9999" }}
                      >
                        <img
                          src={EditImage}
                          alt="Menu"
                          title="Menu"
                          width={"16"}
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        />
                        <ul
                          className="dropdown-menu dropdown-menu-right"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <li
                            className="dropdown-submenu"
                            onClick={() => deleteTask(task.taskID)}
                          >
                            <a className="dropdown-item">Delete</a>
                          </li>
                          <li className="dropdown-submenu dropright">
                            <a className="dropdown-item dropdown-toggle">
                              Move to iteration
                            </a>
                            <ul className="dropdown-menu dropDownBox dropdown-menu-right">
                              {props.sprintOption?.length >= 2 &&
                                props.sprintOption?.map((item) => {
                                  if (item.cat != props.sprintId)
                                    return (
                                      <li
                                        key={item.cat}
                                        onClick={() =>
                                          selectSprint(task.taskID, item.cat)
                                        }
                                      >
                                        <a className="dropdown-item">
                                          {item.key}
                                        </a>
                                      </li>
                                    );
                                })}
                            </ul>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </td>
          <td
            className="ready2release"
            onDrop={(event) => onDropTesting(event)}
            onDragOver={(event) => onDragOver(event)}
          >
            {testingTasks.map((task) => (
              <div
                key={task.taskID}
                className={task.priority}
                style={{ position: "relative" }}
              >
                <div
                  className="card cursor_pointer"
                  // onClick={() => showCommentbox(task)}
                  onClick={(event) => {
                    const isDropdownMenuClick =
                      event.target.id === "dropdownMenuButton" ||
                      event.target.closest(".dropdown-submenu");
                    if (!isDropdownMenuClick) {
                      showCommentbox(task);
                    }
                  }}
                  draggable
                  onDrag={(event) =>
                    onDrag(
                      event,
                      task,
                      "testing",
                      task.userId,
                      task.sprintId,
                      task.createdBy,
                      props.module.moduleId,
                      task.priority
                    )
                  }
                >
                  <div>
                    <strong>
                      {getFirstLetters(props.projectName.name.toUpperCase())}

                      {task.taskCount < 10
                        ? "00" + task.taskCount
                        : "0" + task.taskCount}
                    </strong>
                    <span className="word-brick1 text_3line">{task.title}</span>
                  </div>
                  {/* <OverlayTrigger
                    placement={"top"}
                    overlay={
                      <Tooltip id="tooltip-top">{task.priority}</Tooltip>
                    }
                  >
                    <div
                      className={"prority " + task.priority}
                      id="priority4"
                    ></div>
                  </OverlayTrigger> */}
                  {task.userName.length != 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="user_assign">
                        {task.userName.length
                          ? task.userName.map((profile, index) => (
                              <span
                                data-toggle="tooltip"
                                data-placement="top"
                                title={
                                  profile?.first_name + " " + profile?.last_name
                                }
                                key={index}
                              >
                                <div key={index}>
                                  {profile?.profileImage ? (
                                    <a href="#" className="avtar">
                                      <img
                                        src={
                                          APIURL +"assets/uploads/profileImages/"+
                                          profile?.profileImage
                                        }
                                        alt={
                                          profile?.first_name +
                                          " " +
                                          profile.last_name
                                        }
                                      />
                                    </a>
                                  ) : (
                                    <div className="avtar">
                                      {profile?.first_name?.slice(0, 1) +
                                        profile?.last_name.slice(0, 1)}
                                    </div>
                                  )}
                                </div>
                              </span>
                            ))
                          : null}
                      </div>
                    </div>
                  )}
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="hour">
                      <strong>{task.estimatedHours} Points</strong>
                    </div>
                    <div>
                      <div
                        className="dropdown sub-dropdown-menu"
                        // style={{ zIndex: "9999" }}
                      >
                        <img
                          src={EditImage}
                          alt="Menu"
                          title="Menu"
                          width={"16"}
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        />
                        <ul
                          className="dropdown-menu dropdown-menu-right"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <li
                            className="dropdown-submenu"
                            onClick={() => deleteTask(task.taskID)}
                          >
                            <a className="dropdown-item">Delete</a>
                          </li>
                          <li className="dropdown-submenu dropright">
                            <a className="dropdown-item dropdown-toggle">
                              Move to iteration
                            </a>
                            <ul className="dropdown-menu dropDownBox dropdown-menu-right">
                              {props.sprintOption?.length >= 2 &&
                                props.sprintOption?.map((item) => {
                                  if (item.cat != props.sprintId)
                                    return (
                                      <li
                                        key={item.cat}
                                        onClick={() =>
                                          selectSprint(task.taskID, item.cat)
                                        }
                                      >
                                        <a className="dropdown-item">
                                          {item.key}
                                        </a>
                                      </li>
                                    );
                                })}
                            </ul>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </td>
          <td
            className="ready2test"
            onDrop={(event) => onDropBug(event)}
            onDragOver={(event) => onDragOver(event)}
          >
            {bugTasks.map((task) => (
              <div
                key={task.taskID}
                className={task.priority}
                style={{ position: "relative" }}
              >
                <div
                  className="card cursor_pointer"
                  // onClick={() => showCommentbox(task)}
                  onClick={(event) => {
                    const isDropdownMenuClick =
                      event.target.id === "dropdownMenuButton" ||
                      event.target.closest(".dropdown-submenu");
                    if (!isDropdownMenuClick) {
                      showCommentbox(task);
                    }
                  }}
                  draggable
                  onDrag={(event) =>
                    onDrag(
                      event,
                      task,
                      "bug",
                      task.userId,
                      task.sprintId,
                      task.createdBy,
                      props.module.moduleId,
                      task.priority
                    )
                  }
                >
                  <div>
                    <strong>
                      {getFirstLetters(props.projectName.name.toUpperCase())}

                      {task.taskCount < 10
                        ? "00" + task.taskCount
                        : "0" + task.taskCount}
                    </strong>
                    <span className="word-brick1 text_3line">{task.title}</span>
                  </div>

                  {task.userName.length != 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <div className="user_assign">
                        {task.userName.length
                          ? task.userName.map((profile, index) => (
                              <span
                                data-toggle="tooltip"
                                data-placement="top"
                                title={
                                  profile?.first_name + " " + profile?.last_name
                                }
                                key={index}
                              >
                                <div key={index}>
                                  {profile?.profileImage ? (
                                    <a href="#" className="avtar">
                                      <img
                                        src={
                                          APIURL +"assets/uploads/profileImages/"+
                                          profile?.profileImage
                                        }
                                        alt={
                                          profile?.first_name +
                                          " " +
                                          profile.last_name
                                        }
                                      />
                                    </a>
                                  ) : (
                                    <div className="avtar">
                                      {profile?.first_name?.slice(0, 1) +
                                        profile?.last_name.slice(0, 1)}
                                    </div>
                                  )}
                                </div>
                              </span>
                            ))
                          : null}
                      </div>
                    </div>
                  )}
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="hour">
                      <strong>{task.estimatedHours} Points</strong>
                    </div>
                    <div>
                      <div
                        className="dropdown sub-dropdown-menu"
                        // style={{ zIndex: "9999" }}
                      >
                        <img
                          src={EditImage}
                          alt="Menu"
                          title="Menu"
                          width={"16"}
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        />
                        <ul
                          className="dropdown-menu dropdown-menu-right"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <li
                            className="dropdown-submenu"
                            onClick={() => deleteTask(task.taskID)}
                          >
                            <a className="dropdown-item">Delete</a>
                          </li>
                          <li className="dropdown-submenu dropright">
                            <a className="dropdown-item dropdown-toggle">
                              Move to iteration
                            </a>
                            <ul className="dropdown-menu dropDownBox dropdown-menu-right">
                              {props.sprintOption?.length >= 2 &&
                                props.sprintOption?.map((item) => {
                                  if (item.cat != props.sprintId)
                                    return (
                                      <li
                                        key={item.cat}
                                        onClick={() =>
                                          selectSprint(task.taskID, item.cat)
                                        }
                                      >
                                        <a className="dropdown-item">
                                          {item.key}
                                        </a>
                                      </li>
                                    );
                                })}
                            </ul>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </td>
          <td
            className="process_done"
            onDrop={(event) => onDropComplete(event)}
            onDragOver={(event) => onDragOver(event)}
          >
            {completedTasks.map((task) => (
              <div key={task.taskID} style={{ position: "relative" }}>
                <div
                  className="card cursor_pointer"
                  draggable
                  onDrag={(event) =>
                    onDrag(
                      event,
                      task,
                      "completed",
                      task.userId,
                      task.sprintId,
                      task.createdBy,
                      props.module.moduleId,
                      task.priority
                    )
                  }
                  // onClick={() => showCommentbox(task)}
                  onClick={(event) => {
                    const isDropdownMenuClick =
                      event.target.id === "dropdownMenuButton" ||
                      event.target.closest(".dropdown-submenu");
                    if (!isDropdownMenuClick) {
                      showCommentbox(task);
                    }
                  }}
                >
                  <div>
                    <strong>
                      {getFirstLetters(props.projectName.name.toUpperCase())}

                      {task.taskCount < 10
                        ? "00" + task.taskCount
                        : "0" + task.taskCount}
                    </strong>
                    <span className="word-brick1 text_3line">{task.title}</span>
                  </div>
                  {task.userName.length != 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="user_assign">
                        {task.userName.length
                          ? task.userName.map((profile, index) => (
                              <span
                                data-toggle="tooltip"
                                data-placement="top"
                                title={
                                  profile?.first_name + " " + profile?.last_name
                                }
                                key={index}
                              >
                                <div key={index}>
                                  {profile?.profileImage ? (
                                    <a href="#" className="avtar">
                                      <img
                                        src={
                                          APIURL +"assets/uploads/profileImages/"+
                                          profile?.profileImage
                                        }
                                        alt={
                                          profile?.first_name +
                                          " " +
                                          profile.last_name
                                        }
                                      />
                                    </a>
                                  ) : (
                                    <div className="avtar">
                                      {profile?.first_name?.slice(0, 1) +
                                        profile?.last_name.slice(0, 1)}
                                    </div>
                                  )}
                                </div>
                              </span>
                            ))
                          : null}
                      </div>
                    </div>
                  )}
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="hour">
                      <strong>{task.estimatedHours} Points</strong>
                    </div>
                    <div>
                      <div className="dropdown sub-dropdown-menu">
                        <img
                          src={EditImage}
                          alt="Menu"
                          title="Menu"
                          width={"16"}
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        />
                        <ul
                          className="dropdown-menu dropdown-menu-right"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <li className="dropdown-submenu">
                            <a
                              className="dropdown-item"
                              onClick={() => deleteTask(task.taskID)}
                            >
                              Delete
                            </a>
                          </li>
                          <li className="dropdown-submenu dropleft">
                            <a className="dropdown-item dropdown-toggle">
                              Move to iteration
                            </a>
                            <ul className="dropdown-menu dropDownBox dropdown-menu-right">
                              {props.sprintOption?.length >= 2 &&
                                props.sprintOption?.map((item) => {
                                  if (item.cat != props.sprintId)
                                    return (
                                      <li
                                        key={item.cat}
                                        onClick={() =>
                                          selectSprint(task.taskID, item.cat)
                                        }
                                      >
                                        <a className="dropdown-item">
                                          {item.key}
                                        </a>
                                      </li>
                                    );
                                })}
                            </ul>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </td>
          <Confimation
            deleteConfirm={deleteConfirm}
            setDeleteConfirm={setDeleteConfirm}
            moduleId={props.module.moduleId}
            refresh={() => props.refresh()}
            taskId={taskId}
            getTask={() => props.getTask()}
            projectId={props.id}
          />
          <Comment
            show={show}
            setShow={setShow}
            taskID={commentData?.taskID}
            taskModuleId={props.module.moduleId}
            getTask={() => props.getTask()}
          />
          <Modules
            modulesToggle={modulesToggle}
            setModulesToggle={setModulesToggle}
            updateModule={"Update Module"}
            refresh={() => props.refresh()}
            taskModuleId={props.module.moduleId}
            projectId={props.id}
            sprintId={props.sprintId}
          />
        </tr>
      ) : (
        <>
          <tr
            className={"collapsed_row first_col"}
            onClick={() => setCollapse(true)}
          >
            <td colSpan="7">
              <div className="d-flex">
                <div className="d-flex align-items-center">
                  <a href="#" className="anchor_collaps mr-3"></a>
                  {/* <img src={ToDoList} width="16" className="mr-2" /> */}
                </div>
                <div
                  className="cnt w-100 d-flex justify-content-between"
                  id="text1"
                >
                  <p className="d-block mb-0">
                    <strong>{props.module.moduleName}</strong>
                  </p>
                  <strong className="d-block">
                    Module Hour's {props.module.totalModuleHours} Points
                  </strong>
                </div>
              </div>
            </td>
          </tr>
        </>
      )}
    </>
  );
};

export default memo(index);
