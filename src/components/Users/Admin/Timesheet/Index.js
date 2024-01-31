import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import Footer from "../../../GlobalComponents/Footer";
import Navbar from "../Layout/Navbar";
import DatePicker from "react-datepicker";
import { Button, Table, Input } from "reactstrap";
import Select from "react-select";
import axios from "axios";
import { APIURL } from "../../../../constants/config";
import dateFormat from "dateformat";

const Index = () => {
  const localUser = JSON.parse(localStorage.getItem("user"));
  const [date, setDate] = useState(new Date());
  const [user, setUsers] = useState(localUser);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [task, setTask] = useState([
    {
      projectId: { value: "", label: "Select Project" },
      task_description: "",
      date: "",
      time: 0,
      des_valid: true,
      project_valid: true,
    },
  ]);

  const getProject = () => {
    console.log("sdsdd", user);

    let header = {
      "Content-Type": "application/json",
      Authorization: "",
    };

    axios
      .post(
        APIURL + "projects/getProjectListForDropDown",
        { search: "", assigned_to: user.data._id },
        { headers: header }
      )
      .then((response) => {
        let projst = [];
        projst.push({ value: "", label: "Select Project" });
        response.data.data.length &&
          response.data.data.map((item) => {
            projst.push({
              value: item.projects._id,
              label: item.projects.name,
            });
          });
        setProjects(projst);
      })
      .catch((error) => console.log(error));
  };

  const projectHandler = (index, e) => {
    const newTask = [...task];
    newTask[index].projectId = e;
    setTask(newTask);
  };

  const descriptionHandler = (index, e) => {
    const newTask = [...task];
    newTask[index].task_description = e;
    setTask(newTask);
  };

  const timeHandler = (index, e) => {
    if (e >= 0) {
      const newTask = [...task];
      newTask[index].time = e;
      setTask(newTask);
    }
  };

  const addNewTask = () => {
    const newTask = [...task];
    newTask.push({
      projectId: { value: "", label: "Select Project" },
      task_description: "",
      date: "",
      time: 0,
    });
    setTask(newTask);
  };

  const deleteItem = (index) => {
    const newTask = [...task];
    newTask.splice(index, 1);
    setTask(newTask);
  };

  const dateHandler = () => {
    let header = {
      "Content-Type": "application/json",
      Authorization: "",
    };
    let newDate = dateFormat(new Date(date), "yyyy-mm-dd");

    axios
      .post(
        APIURL + "tasks/getTaskListDateWise",
        { date: newDate, userId: user.data._id },
        { headers: header }
      )
      .then((response) => {
        setTaskResponse(response);
      })
      .catch((error) => console.log(error));
  };

  const setTaskResponse = (response) => {
    let newData = [];
    let newDate = dateFormat(new Date(date), "yyyy-mm-dd");

    response.data.data.map((item) => {
      newData.push({
        projectId: {
          value: item.projecttasks.projectId,
          label: item.projectData[0].name,
        },
        task_description: item.projecttasks.task_description,
        date: newDate,
        time: item.projecttasks.time,
        des_valid: true,
        project_valid: true,
      });
    });

    if (newData.length == 0) {
      newData.push({
        projectId: { value: "", label: "Select Project" },
        task_description: "",
        date: "",
        time: 0,
        des_valid: true,
        project_valid: true,
      });
    }
    setTask(newData);
  };

  const saveTimesheet = () => {
    setLoading(true);

    const newTask = [...task];
    let newDate = dateFormat(new Date(date), "yyyy-mm-dd");
    let flag = 0;
    const inst = [];
    let count = 0;
    let splitC = "";

    newTask.map((item) => {
      count = 0;

      if (item.task_description != "") {
        splitC = item.task_description.split(" ");
        for (var i = 0; i < splitC.length; i++) {
          if (splitC[i] != "") {
            count += 1;
          }
        }

        if (count < 5) {
          flag = 1;
          item.des_valid = false;
        } else {
          item.des_valid = true;
        }
      } else if (item.task_description == "" && item.projectId.value != "") {
        flag = 1;
        item.des_valid = false;
      } else {
        item.des_valid = true;
      }

      if (item.projectId != "" && item.task_description != "") {
        inst.push({
          projectId: item.projectId.value,
          task_description: item.task_description,
          time: item.time,
          date: newDate,
        });
      }

      if (item.task_description != "" && item.projectId.value == "") {
        flag = 1;
        item.project_valid = false;
      } else {
        item.project_valid = true;
      }
    });

    if (flag == 1) {
      setTask(newTask);
      setLoading(false);
      return false;
    }

    let header = {
      "Content-Type": "application/json",
      Authorization: "",
    };

    axios
      .post(
        APIURL + "tasks/saveProjectTask",
        { taskData: inst, date: newDate, userId: user.data._id },
        { headers: header }
      )
      .then((response) => {
        console.log(response);
        setLoading(false);
        setSuccess(true);
        setTimeout(function () {
          setSuccess(false);
        }, 5000);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    dateHandler();
  }, [date]);

  useEffect(() => {
    console.log(projects);
    console.log(setUsers);
    getProject();
  }, []);

  if (!user) {
    return <Redirect to="/" />;
  }
  if (user.data.user_role !== "Admin") {
    return <Redirect to="/" />;
  }
  console.log(777, date);
  return (
    <div>
      <Navbar activePage="dashboard" />
      <main className="offset mr-0">
        <div className="container-fluid hard-pad">
          <div className="row pt-4">
            <div className="col-3">
              <DatePicker
                placeholderText="Task Date"
                selected={date}
                onChange={(date) => setDate(date)}
                name="taskDate"
                dateFormat="dd-MM-yyyy"
                autoComplete="off"
                className="form-control"
                maxDate={new Date()}
              />
            </div>

            {success == true && (
              <div
                className="col-4 ml-auto"
                style={{ justifyContent: "end", display: "flex" }}
              >
                <span className="text-success mb-0 alert alert-success">
                  Timesheet Updated Successfully
                </span>
              </div>
            )}
          </div>
          <div className="mt-5 timesheet">
            <Table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Project</th>
                  <th style={{ width: "500px" }}>Task</th>
                  <th style={{ width: "90px" }}>Time</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {task.length &&
                  task.map((item, index) => (
                    <tr key={index}>
                      <th scope="row" className="vertical-align-middle">{index + 1}.</th>
                      <td className="vertical-align-middle">
                        <Select
                          // menuPortalTarget={document.body} 
                          // menuPosition={"fixed"}
                          className="basic-single w-100"
                          classNamePrefix="select"
                          name="color"
                          options={projects}
                          value={item.projectId}
                          onChange={(e) => projectHandler(index, e)}
                        />
                        {item.project_valid == false && (
                          <span className="text-danger">
                            Please select project{" "}
                          </span>
                        )}
                      </td>
                      <td className="vertical-align-middle">
                        <textarea
                          max="250"
                          type="text"
                          value={item.task_description}
                          rows="2"
                          className="form-control"
                          onChange={(e) =>
                            descriptionHandler(index, e.target.value)
                          }
                        />
                        {item.des_valid == false && (
                          <span className="text-danger">
                            Must be minimum 5 word{" "}
                          </span>
                        )}
                      </td>
                      <td className="vertical-align-middle">
                        <Input
                          type="number"
                          min="0"
                          className="w-100"
                          value={item.time}
                          onChange={(e) => timeHandler(index, e.target.value)}
                        />
                      </td>
                      <td className="text-center vertical-align-middle">
                        {index > 0 && (
                          <i
                            className="fa fa-trash"
                            style={{ fontSize: "25px" }}
                            onClick={() => deleteItem(index)}
                          ></i>
                        )}
                      </td>
                    </tr>
                  ))}
                <tr>
                  <td colSpan={5}>
                    <Button
                      className="pull-right ml-1"
                      color="success"
                      onClick={() => addNewTask()}
                    >
                      Add More
                    </Button>
                    <Button
                      className="pull-right"
                      disabled={loading == true ? true : false}
                      color="success"
                      onClick={() => saveTimesheet()}
                    >
                      Save
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
