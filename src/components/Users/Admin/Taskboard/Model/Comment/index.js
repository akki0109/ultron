import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  FormGroup,
  Form,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Tooltip } from "react-bootstrap";
import { APIURL } from "../../../../../../constants/config";
import { priority } from "../../../../../../utilities/reportContent";
import {
  postCommit,
  getCommit,
  getBacklogs,
  getTaskData,
  getUserListForReporting,
  updateTask,
  deleteTaskApiCall,
} from "../../Services/taskBoard.services";
import dateFormat from "dateformat";
import React, { useState, memo, useEffect, useMemo, useCallback } from "react";
import Multiselect from "multiselect-react-dropdown";
import Select from "react-select";
import "react-quill/dist/quill.snow.css";
import TextEditor from "../../TextEditor/Index";
import DiscriptionEditor from "../DiscriptionEditor/Index";
import FileUpload from "../FileUpload/Index";
import socketClient from "socket.io-client";

const EditTask = (props) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [commitList, setCommitList] = useState([]);
  const [editData, setEditData] = useState();
  const [userOption, setUserOption] = useState([]);
  const [userListRawData, setuserListRawData] = useState([]);
  const [error, setError] = useState();
  const [nestedModal, setNestedModal] = useState(false);
  const [closeAll, setCloseAll] = useState(false);
  const [commit, setCommit] = useState({
    commentDesc: "",
    userId: user.data._id,
  });
  const toggle = () => props.setShow(!props.show);
  const [showOptions, setShowOptions] = useState(false);
  const [selectEmployee, setSelectEmployee] = useState([]);
  const [commentError, setCommentError] = useState("");
  const [currentPage, setCurrentPage] = useState("detail");
  const [backlogs, setBacklogs] = useState(null);
  const [showbtn, setShowBtn] = useState(false);
  const [owner, setOwner] = useState({ value: "", label: "" });
 // const [singleSelectOwner, setUserSelectToggle] = useState(true);

  useEffect(() => {
    if (props.show) {
      getCommitData();
      TaskData();
      getUser();
    }
  }, [props.show]);

  useEffect(() => {
   
    if (userOption.length && editData?.taskOwnerId ){
   
      defaultOwner();
    }
     
  }, [userOption, editData?.taskOwnerId]);

  const defaultOwner = () => {
    
    let defaultOwner = userOption.find(
      (item) => item.value == editData?.taskOwnerId
    );
    setOwner(defaultOwner);
  };
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
          setuserListRawData(response?.data);
        }
      })
      .catch((error) => {
        console.log("error Occure", error);
      });
  };

  const TaskData = () => {
    getTaskData({ taskId: props.taskID }).then((result) => {
      if (result.status == 200) {
        const {
          title,
          task_description,
          projectId,
          estimatedHours,
          hoursLeft,
          userId,
          status,
          priority,
          sprintId,
          taskOwnerId,
          createdBy,
          _id,
        } = result.data[0].tasks;
        getBacklogs({ taskId: _id }).then((res) => {
          setBacklogs(res.data);
        });

        setSelectEmployee(
          userId?.map((i) => {
            return {
              value: i._id,
              label: i.first_name + " " + i.last_name,
            };
          })
        );

        setEditData({
          updatedBy: user.data._id,
          title,
          task_description,
          userId: userId?.map((i) => {
            return {
              value: i._id,
              label: i.first_name + " " + i.last_name,
            };
          }),
          projectId: projectId._id,
          estimatedHours,
          hoursLeft,
          status,
          priority,
          taskOwnerId,
          sprintId: sprintId._id,
          createdBy: createdBy._id,
          _id,
        });
      } else console.log("error", result);
    });
  };
  const getCommitData = () => {
    getCommit({ taskId: props.taskID }).then((result) => {
      if (result.status == 200) {
        setCommitList(result.data);
      }
    });
  };
  const handleClose = () => {
    //alert(1);
    props.setShow(false);
    setError("");
    setCommit({ ...commit, commentDesc: "" });
    setCommentError("");
    setShowBtn(false);
    //setEditData({ priority: priority[0].cat });
  };
  // const commitData = () => {

  //   postCommit({ ...commit, taskId: props.taskID }).then((result) => {
  //     if (result.status == 200) {
  //       console.log("error ------s", result);
  //       getCommitData();
  //       setCommit({ ...commit, commentDesc: "" });
  //     } else console.log("error ------", result);
  //   });
  // };
  const commitData = () => {
    if (commit.commentDesc != "" && commit.commentDesc != "<p><br></p>") {
      // console.log("after add-------888888",commit.commentDesc);
      postCommit({ ...commit, taskId: props.taskID })
        .then((result) => {
          console.log("error----result", result);
          getCommitData();
          setCommit({ ...commit, commentDesc: "" });
          setCommentError("");
        })
        .catch((error) => {
          console.error("Error:::::::", error);
        });
    } else {
      setCommentError("Please enter your text.");
    }
  };
  // editData&&console.log("====editData===",editData);

  // const handleChange = (name, e) => {
  //   if (name == "priority") setEditData({ ...editData, priority: e[0].cat });
  //   else setEditData({ ...editData, [name]: e.target.value });
  // };
  const handleChange = (name, e) => {
    setShowBtn(true);

    if (name == "priority") {
      setEditData({ ...editData, priority: e[0].cat });
    } else if (name == "task_description") {
      // console.log("77777777777>",e.target.value);
      setEditData({ ...editData, task_description: e.target.value });
    } else setEditData({ ...editData, [name]: e.target.value });
  };

  const showImageData = useMemo(() => {
    const uniqureId = editData?.userId?.map((i) => i.value);

    const ArrOfObj = [];
    userListRawData?.forEach((i) => {
      if (uniqureId?.includes(i._id)) ArrOfObj.push(i);
    });
    return ArrOfObj.reverse();
  }, [editData?.userId, userOption]);

  const saveData = () => {
    updateTask(
      { ...editData, taskOwnerId: owner.value },
      props.taskModuleId
    ).then((result) => {
      if (result.status == 200) {
        handleClose();
        props.getTask();
        sendNotification(editData);
      } else {
        setError(result);
        console.log(9988, result);
      }
    });
  };
  // const deleteTask = () => {
  //   toggleNested();
  // };

  const toggleNested = () => {
    setNestedModal(!nestedModal);
    setCloseAll(false);
  };
  const toggleAll = () => {
    deleteTaskApiCall({ _id: props.taskID }).then((result) => {
      if (result.status == 200) {
        setNestedModal(!nestedModal);
        setCloseAll(true);
        props.getTask();
      }
    });
  };

  const toPascalCase = (str) => {
    if (!str) return "";
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleInputChange = useCallback((typedOption) => {
    if (typedOption.trim().length > 2) {
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  }, []);

  const handleEmploye = (e) => {
    //var userId=e.map((itm)=>itm.value);
    //console.log("userIduserId",userId);
    setEditData({ ...editData, userId: e });
    setSelectEmployee(e);
    setShowBtn(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const sendNotification = (draggedTask) => {
    let newUser = [];
    draggedTask.userId?.map((i) => {
      newUser.push(i.value);
    });

    draggedTask.userId = newUser;

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
    setOwner(e);
    setShowBtn(true);
  };
  return (
    <>
      <Modal isOpen={props.show} className="task_details" size="xxl">
        <ModalHeader toggle={handleClose}>
          {/* <h5 className="modal-title">Edit Task</h5> */}
          <Nav>
            <NavItem className={currentPage === "detail" ? "active" : {}}>
              <NavLink
                href="javascript:;"
                onClick={() => handlePageChange("detail")}
              >
                Details
              </NavLink>
            </NavItem>
            <NavItem className={currentPage === "attachment" ? "active" : {}}>
              <NavLink
                href="javascript:;"
                onClick={() => handlePageChange("attachment")}
              >
                Attachment
              </NavLink>
            </NavItem>
            <NavItem className={currentPage === "comments" ? "active" : {}}>
              <NavLink
                href="javascript:;"
                onClick={() => handlePageChange("comments")}
              >
                Comments
              </NavLink>
            </NavItem>
            <NavItem className={currentPage === "history" ? "active" : {}}>
              <NavLink
                href="javascript:;"
                onClick={() => handlePageChange("history")}
              >
                History
              </NavLink>
            </NavItem>
          </Nav>
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col sm={8} className="divider">
                {currentPage === "detail" && (
                  <FormGroup>
                    <div>
                      <h5>Details</h5>
                      <hr />
                    </div>
                    <div className="form-group">
                      <Label for="Title">Task Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter Task"
                        value={editData?.title}
                        onChange={(e) => handleChange("title", e)}
                      />
                      {error?.title && (
                        <span className="text-danger">{error.title[0]}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <Label for="Task-Description">Task Description</Label>
                      <DiscriptionEditor
                        setCommit={setEditData}
                        editData={editData}
                        setShowBtn={setShowBtn}
                      />
                    </div>
                  </FormGroup>
                )}
                {currentPage === "comments" && (
                  <FormGroup>
                    <div>
                      <h5>Comments</h5>
                      <hr />
                    </div>
                    <Row>
                      <Col md={12}>
                        {/* <Input
                      id="Title"
                      onChange={(e) => {
                        setCommit({ ...commit, commentDesc: e.target.value });
                      }}
                      value={commit?.commentDesc}
                      placeholder="Add comment"
                    ></Input> */}
                        <br />
                        <Label for="Task-Commit">Comment</Label>
                        <TextEditor setCommit={setCommit} commit={commit} />
                        <span className="text-danger">{commentError}</span>
                      </Col>
                      <Col md={12} className="text-right mt-3">
                        <Button
                          color="primary"
                          className="btn btn-primary"
                          onClick={commitData}
                        >
                          Add
                        </Button>
                      </Col>
                    </Row>
                    <hr />
                    <div className="comment_section">
                      {commitList.map((item, index) => (
                        <div
                          className="d-flex align-items-top my-3"
                          key={index}
                        >
                          <div className="user_assign align-items-baseline mr-2">
                            <span className="uernm">
                              {item.taskcomments.userId?.profileImage ? (
                                <OverlayTrigger
                                  placement={"top"}
                                  key={index}
                                  overlay={
                                    <Tooltip id="tooltip-top">
                                      {item.taskcomments.userId?.first_name +
                                        " " +
                                        item.taskcomments.userId?.last_name}
                                    </Tooltip>
                                  }
                                >
                                  <a>
                                    <img
                                      src={
                                        APIURL +
                                        "assets/uploads/profileImages/" +
                                        item.taskcomments.userId?.profileImage
                                      }
                                      alt={
                                        item.taskcomments.userId?.first_name +
                                        " " +
                                        item.taskcomments.userId?.last_name
                                      }
                                      className="mr-2"
                                    />
                                  </a>
                                </OverlayTrigger>
                              ) : (
                                <span className="avtar">
                                  {item.taskcomments.userId.first_name?.slice(
                                    0,
                                    1
                                  ) +
                                    item.taskcomments.userId.last_name?.slice(
                                      0,
                                      1
                                    )}
                                </span>
                              )}
                            </span>
                          </div>
                          {/*logo img icon */}
                          <div>
                            <div className="small mb-2 d-flex mt-1">
                              <h6 className="mr-3 noticelist__cnt--nm">
                                {item.taskcomments.userId.first_name +
                                  " " +
                                  item.taskcomments.userId.last_name}
                              </h6>
                              <span>
                                {dateFormat(item.taskcomments.time, "fullDate")}
                                {", "}
                                {dateFormat(
                                  item.taskcomments.time,
                                  "h:MM:ss TT"
                                )}
                              </span>
                            </div>

                            <div
                              dangerouslySetInnerHTML={{
                                __html: item?.taskcomments.commentDesc,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </FormGroup>
                )}
                {currentPage === "attachment" && (
                  <FormGroup>
                    <div>
                      <h5>Attachment</h5>
                      <hr />
                    </div>
                    <FileUpload taskID={props.taskID} />
                  </FormGroup>
                )}
                {/*  History Section */}

                {currentPage === "history" && (
                  <FormGroup className="task">
                    <Row className="align-items-center mb-3">
                      <Col md={2}>
                        <div className="task--start">
                          <span> New Project Start </span>
                        </div>
                      </Col>
                      <Col md={10}>
                        <div className="task__progress">
                          {backlogs.length > 0 &&
                            backlogs
                              .slice()
                              .reverse()
                              .map((e) => (
                                <div key={1} className="task__progress--step">
                                  <div>
                                    <div className="task__progress--status">
                                      {" "}
                                      Move to{" "}
                                      {e.text.split(" ").slice(-1).join(" ")}
                                    </div>
                                    <div className="task__progress--arrow"></div>
                                    <div className="task__progress--user">
                                      By
                                      <strong>
                                        {" "}
                                        {e.userId &&
                                          e.userId.first_name +
                                            " " +
                                            e.userId.last_name +
                                            " "}
                                      </strong>
                                      <div>
                                        {e.updatedAt &&
                                          dateFormat(e.updatedAt, "dd mmm yy")}
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="task__progress--step--cnt">
                                      <span>
                                        In{" "}
                                        {e.text.split(" ").slice(-1).join(" ")}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                        </div>
                      </Col>
                    </Row>
                    <div>
                      <h5>History</h5>
                      <hr />
                    </div>
                    <div className="history_section">
                      {backlogs &&
                        backlogs.map((item, index) => (
                          <div
                            className="d-flex align-items-top my-3"
                            key={index}
                          >
                            <div className="user_assign align-items-baseline mr-2">
                              <span className="uernm">
                                {item.userId && item.userId.profileImage ? (
                                  <OverlayTrigger
                                    placement={"top"}
                                    key={index}
                                    overlay={
                                      <Tooltip id="tooltip-top">
                                        {item.userId.first_name +
                                          " " +
                                          item.userId.last_name}
                                      </Tooltip>
                                    }
                                  >
                                    <a>
                                      <img
                                        src={
                                          APIURL +
                                          "assets/uploads/profileImages/" +
                                          item.userId.profileImage
                                        }
                                        alt={
                                          item.userId.first_name +
                                          " " +
                                          item.userId.last_name
                                        }
                                        className="mr-2"
                                      />
                                    </a>
                                  </OverlayTrigger>
                                ) : (
                                  <span className="avtar">
                                    {item.userId &&
                                      item.userId.first_name?.slice(0, 1) +
                                        item.userId.last_name?.slice(0, 1)}
                                  </span>
                                )}
                              </span>
                            </div>
                            {/*logo img icon */}
                            <div>
                              <div>
                                <p>
                                  {item.userId &&
                                    item.userId.first_name +
                                      " " +
                                      item.userId.last_name +
                                      " " +
                                      item.text.split(" ").slice(1).join(" ")}
                                </p>
                              </div>

                              <div
                              // dangerouslySetInnerHTML={{
                              //   __html: item?.taskcomments.commentDesc,
                              // }}
                              />
                              {item.updatedAt && (
                                <span className="text-muted small">
                                  {item.updatedAt &&
                                    dateFormat(item.updatedAt, "dd mmm yy")}
                                  ,{dateFormat(item.updatedAt, "h:MM:ss TT")}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </FormGroup>
                )}
              </Col>
              <Col sm={4}>
                <div>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <Label>Estimated Points</Label>
                        <Input
                          type="number"
                          min="0"
                          value={editData?.estimatedHours}
                          onChange={(e) => handleChange("estimatedHours", e)}
                        />
                        <span className="text-danger">{}</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <Label>Time spent</Label>
                        <Input
                          type="number"
                          min="0"
                          value={editData?.hoursLeft}
                          onChange={(e) => handleChange("hoursLeft", e)}
                        />
                        {/* {error?.common && (
                          <span className="text-danger">{error.common[0]}</span>
                        )} */}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <div>
                      <FormGroup>
                        <Multiselect
                          id="priority"
                          displayValue="key"
                          options={priority}
                          singleSelect
                          selectedValues={[
                            {
                              key: toPascalCase(editData?.priority),
                              cat: toPascalCase(editData?.priority),
                            },
                          ]}
                          onSelect={(item) => {
                            handleChange("priority", item);
                          }}
                        />
                      </FormGroup>
                    </div>
                  </div>
                  <div>
                    <Label>Owner</Label>
                    <FormGroup>
                      <Select
                        onChange={handleChangeOwner}
                        className="basic-multi-select iconRemove"
                        classNamePrefix="select"
                        placeholder="Type to search"
                        value={owner}
                        options={showOptions ? userOption : []}
                        noOptionsMessage={() =>
                          showOptions ? "No options" : null
                        }
                        onInputChange={handleInputChange}
                      />
                      <span className="d-block mt-1 text-danger text-capitalize"></span>
                    </FormGroup>
                  </div>
                  <div>
                    <Label>Notify to </Label>
                    <FormGroup>
                      <Select
                        isMulti
                        onChange={(e) => handleEmploye(e)}
                        className="basic-multi-select iconRemove"
                        classNamePrefix="select"
                        placeholder="Type to search"
                        value={selectEmployee}
                        options={showOptions ? userOption : []}
                        noOptionsMessage={() =>
                          showOptions ? "No options" : null
                        }
                        onInputChange={handleInputChange}
                      />
                      <span className="d-block mt-1 text-danger text-capitalize"></span>
                    </FormGroup>
                    <div className="user_assign">
                      {showImageData.length
                        ? showImageData?.map((profile, index) => (
                            <OverlayTrigger
                              placement={"top"}
                              key={index}
                              overlay={
                                <Tooltip id="tooltip-top">
                                  {profile?.first_name +
                                    " " +
                                    profile?.last_name}
                                </Tooltip>
                              }
                            >
                              <div key={index}>
                                {profile?.profileImage ? (
                                  <a href="#">
                                    <img
                                      src={
                                        APIURL +
                                        "assets/uploads/profileImages/" +
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
                                  <div className="avtar ">
                                    {profile?.first_name?.slice(0, 1) +
                                      profile?.last_name?.slice(0, 1)}
                                  </div>
                                )}
                              </div>
                            </OverlayTrigger>
                          ))
                        : null}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* <div>
              <div>
                <h6>Comment</h6>
                <textarea
                  className="form-control"
                  onChange={(e) => {
                    setCommit({ ...commit, commentDesc: e.target.value });
                  }}
                  value={commit?.commentDesc}
                  placeholder="Comment"
                  rows={3}
                ></textarea>
              </div>
              <div className="d-flex justify-content-end">
                <Button color="primary mt-2" onClick={commitData}>
                  Send
                </Button>
              </div>
            </div> */}
          </Form>
          {/* <div className="pb-1 pt-1 commitHeading mt-3">
            <h5>Comments</h5>
          </div> */}
          {/* <div className="row CommitListData">
            {commitList.map((item, index) => (
              <div key={index} className="col-12 commitDataList">
                <div className="d-flex align-items-top my-3">
                  <div>
                    <span className="usernm">
                      {item.taskcomments.userId?.profileImage ? (
                        <OverlayTrigger
                          placement={"top"}
                          key={index}
                          overlay={
                            <Tooltip id="tooltip-top">
                              {item.taskcomments.userId?.first_name +
                                " " +
                                item.taskcomments.userId?.last_name}
                            </Tooltip>
                          }
                        >
                          <img
                            src={
                              APIURL +
                              "./assets/profileImages/" +
                              item.taskcomments.userId?.profileImage
                            }
                            alt={
                              item.taskcomments.userId?.first_name +
                              " " +
                              item.taskcomments.userId?.last_name
                            }
                            className="mr-2"
                          />
                        </OverlayTrigger>
                      ) : (
                        <span className="avtar">
                          {item.taskcomments.userId.first_name?.slice(0, 1) +
                            item.taskcomments.userId.last_name?.slice(0, 1)}
                        </span>
                      )}
                    </span>
                  </div>
                  <div>
                    <div className="small mb-2">
                      <strong className="mr-3">
                        {item.taskcomments.userId.first_name +
                          " " +
                          item.taskcomments.userId.last_name}
                      </strong>
                      <span>
                        {dateFormat(item.taskcomments.time, "fullDate")}
                        {", "}
                        {dateFormat(item.taskcomments.time, "h:MM:ss TT")}
                      </span>
                    </div>
                    <p>{item.taskcomments.commentDesc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div> */}

          {/* Confirmation Model on Delete Task */}
          <Modal
            isOpen={nestedModal}
            toggle={toggleNested}
            onClosed={closeAll ? toggle : undefined}
          >
            <ModalHeader>Confirmation</ModalHeader>
            <ModalBody>
              <h5>Are you sure you want to delete this Task ?</h5>
            </ModalBody>
            <ModalFooter>
              <Button onClick={toggleNested} className="mr-3">
                Cancel
              </Button>
              <Button color="danger" onClick={toggleAll}>
                Yes
              </Button>
            </ModalFooter>
          </Modal>
        </ModalBody>
        <ModalFooter>
          <div className="d-flex">
            {/* <Button color="danger mr-2" onClick={deleteTask}> Delete </Button> */}
          </div>
          <Button className="btn btn-default mr-3" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="success"
            onClick={saveData}
            disabled={showbtn === false}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default memo(EditTask);
