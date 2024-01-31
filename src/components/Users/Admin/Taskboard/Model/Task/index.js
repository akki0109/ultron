import React, { memo, useEffect, useState, useCallback } from "react";
import Multiselect from "multiselect-react-dropdown";
import { priority } from "../../../../../../utilities/reportContent";
import {
  getUserListForReporting,
  saveBoardTask,
} from "../../Services/taskBoard.services";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";
import Select from "react-select";
import DiscriptionEditor from "../DiscriptionEditor/Index";
import socketClient from "socket.io-client";
import { APIURL } from "../../../../../../constants/config";

const Index = (props) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [error, setError] = useState("");
  const [userOption, setUserOption] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [taskOwnerId, setTaskOwnerId] = useState({ value: "", label: "" });
  const [selectEmployee, setSelectEmployee] = useState([]);
  const [task, setTask] = useState({
    taskModuleId: "",
    title: "",
    task_description: "",
    estimatedHours: 0,
    hoursLeft: 0,
    userId: [],
    status: "Backlog",
    projectId: props.ID,
    sprintId: "",
    createdBy: user.data._id,
    priority: "low",
    updatedBy: "",
    taskOwnerId:""
  });
  const getUser = () => {
    getUserListForReporting()
      .then((response) => {
        let option = [];
        if (response?.data) {
          response?.data?.map((item) => {
            option.push({
              value: item._id,
              label: item.first_name + " " + item.last_name,
            });
          });
          setUserOption(option);
        }
      })
      .catch((error) => {
        console.log("error Occure", error);
      });
  };
  useEffect(() => {
    if (props.toggle == true) {
      getUser();
      setError("");
      setLoading(false);
      setTask({
        ...task,
        sprintId: props.selectSprintId,
        taskModuleId: props.taskModuleId,
        updatedBy: user.data._id,
      });
    }
  }, [props.toggle]);

  const handleChange = (name, value) => {
    if (name == "task_description") {
      setTask({ ...task, task_description: value });
    } else {
      setTask({ ...task, [name]: value });
    }
  };

  const Save = () => {
    setLoading(true);
    saveBoardTask(task).then((result) => {
      setLoading(false);
      if (result?.response?.status == 400) {
        const errors = result?.response?.data?.data?.errors;

        setError(errors);
      } else {
        cancelModel();
        sendNotification(task);
        props.getTask();
      }
    });
  };

  const cancelModel = () => {
    setTask({
      ...task,
      priority: "low",
      title: "",
      task_description: "",
      estimatedHours: 0,
      hoursLeft: 0,
      userId: [],
      taskOwnerId:""
    });
    props.setToggle(false);
    setSelectEmployee([]);
    setTaskOwnerId({ value: "", label: "" });
  };

  const handleInputChange = useCallback((typedOption) => {
    if (typedOption.trim().length > 2) {
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  }, []);

  const handleEmploye = (e) => {
    var userId = e.map((itm) => itm.value);
    setTask({ ...task, userId: userId });
    setSelectEmployee(e);
  };

  const sendNotification = (draggedTask) => {
    if (draggedTask.userId.length == 0) {
      draggedTask.userId.push(1);
    }
    if (draggedTask.userId.length) {
      var getAllUsers = removeItemOnce(draggedTask.userId, user.data._id);
      if (getAllUsers.length == 0) {
        getAllUsers.push(1);
      }
      if (getAllUsers.length) {
        var socket = socketClient(APIURL, { transports: ["websocket"] });
        socket.emit("notification_board", {
          userId: getAllUsers,
          updatedBy: user.data._id,
          projectId: draggedTask.projectId,
        });
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

  const handleChangeOwner = (e) => {
    setTaskOwnerId(e);
    setTask({...task,taskOwnerId:e.value});
  };
  return (
    <>
      <Modal isOpen={props.toggle} className="task_details" size="xxl">
        <ModalHeader toggle={cancelModel}>Create task</ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md={8} className="divider">
                <FormGroup>
                  <Label for="Title">Task Name</Label>
                  <Input
                    id="Title"
                    placeholder="Enter Task"
                    onChange={(e) => handleChange("title", e.target.value)}
                  />
                  {error?.title && (
                    <span className="text-danger">{error.title[0]}</span>
                  )}
                </FormGroup>

                {/* <FormGroup> */}
                {/* <Label for="Task-Description">Task Description </Label>
                  <Input
                    type="textarea"
                    rows={5}
                    id="Task-Description"
                    placeholder="Enter Task Description"
                    onChange={(e) =>
                      handleChange("task_description", e.target.value)
                    }
                  />
                  <span className="d-block mt-1 text-danger text-capitalize">
                    {error.task_description ? error.task_description[0] : ""}
                  </span> */}
                <div className="form-group">
                  <Label for="Task-Description">Task Description</Label>

                  <DiscriptionEditor setCommit={setTask} editData={task} />
                </div>
                {/* </FormGroup> */}

                {/* <Row className="my-4">
                  <Col md={8}>
                    <Input id="Title" placeholder="Write an update" />
                  </Col>
                  <Col md={4} className="text-right">
                    <Button className="btn btn-warning btn-block">
                      {" "}
                      Send{" "}
                    </Button>
                  </Col>
                </Row> */}

                {/* <hr />
                <div className="comment_section">
                  <div className="d-flex align-items-top my-3">
                    <div>
                      <span className="usernm">J</span>
                    </div>
                    <div>
                      <div className="small mb-2">
                        <strong className="mr-3">John Doe</strong>
                        <span>5July23-5:30PM</span>
                      </div>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam.
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-top my-3">
                    <div>
                      <span className="usernm">J</span>
                    </div>
                    <div>
                      <div className="small mb-2">
                        <strong className="mr-3">John Doe</strong>
                        <span>5July23-5:30PM</span>
                      </div>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam.
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-top my-3">
                    <div>
                      <span className="usernm">J</span>
                    </div>
                    <div>
                      <div className="small mb-2">
                        <strong className="mr-3">John Doe</strong>
                        <span>5July23-5:30PM</span>
                      </div>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam.
                      </p>
                    </div>
                  </div>
                </div> */}
                {/* comment section */}
              </Col>
              <Col md={4}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="estimatedNumber">Estimated Points</Label>
                      <Input
                        id="estimatedNumber"
                        name="Estimated"
                        // placeholder="Enter a Estimated Hours"
                        type="number"
                        value={task?.estimatedHours}
                        min={0}
                        onChange={(e) =>
                          handleChange("estimatedHours", e.target.value)
                        }
                      />
                    </FormGroup>
                    <span className="d-block mt-1 text-danger text-capitalize">
                      {error.estimatedHours ? error.estimatedHours[0] : ""}
                    </span>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="exampleHourLeft">Time spent</Label>
                      <Input
                        id="exampleHourLeft"
                        name="number"
                        // placeholder="Enter a Hours Left"
                        type="number"
                        value={task?.hoursLeft}
                        min={0}
                        onChange={(e) =>
                          handleChange("hoursLeft", e.target.value)
                        }
                      />
                    </FormGroup>
                    <span className="d-block mt-1 text-danger text-capitalize">
                      {error.hoursLeft ? error.hoursLeft[0] : ""}
                    </span>
                  </Col>
                </Row>

                <FormGroup>
                  <Label for="priority">Priority</Label>
                  <Multiselect
                    id="priority"
                    displayValue="key"
                    options={priority}
                    singleSelect
                    selectedValues={[priority[0]]}
                    onSelect={(item) => {
                      handleChange("priority", item[0].cat);
                    }}
                  />
                </FormGroup>
                <div>
                  <Label>Owner</Label>
                  <FormGroup>
                    <Select
                      onChange={handleChangeOwner}
                      className="basic-multi-select iconRemove"
                      classNamePrefix="select"
                      placeholder="Type to search"
                      value={taskOwnerId}
                      options={showOptions ? userOption : []}
                      noOptionsMessage={() =>
                        showOptions ? "No options" : null
                      }
                      onInputChange={handleInputChange}
                    />
                    <span className="d-block mt-1 text-danger text-capitalize"></span>
                  </FormGroup>
                </div>
                <FormGroup>
                  <Label> Notify to </Label>
                  <Select
                    isMulti
                    onChange={(e) => handleEmploye(e)}
                    className="basic-multi-select iconRemove"
                    classNamePrefix="select"
                    placeholder="Type to search"
                    value={selectEmployee}
                    options={showOptions ? userOption : []}
                    noOptionsMessage={() => (showOptions ? "No options" : null)}
                    onInputChange={handleInputChange}
                  />

                  <span className="d-block mt-1 text-danger text-capitalize">
                    {error.userId ? error.userId[0] : ""}
                  </span>
                </FormGroup>
               
              </Col>
            </Row>

            <span className="d-block mt-1 text-danger text-capitalize">
              {error.common ? error.common[0] : ""}
            </span>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            className="btn btn-default mr-3"
            onClick={() => {
              cancelModel();
            }}
          >
            {" "}
            Cancel{" "}
          </Button>
          <Button color="success" onClick={() => Save()} disabled={isLoading}>
            {" "}
            Save{" "}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default memo(Index);
