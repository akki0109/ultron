import React, { useEffect, useState, useCallback } from "react";
import Footer from "../../../GlobalComponents/Footer";
import Navbar from "../Layout/Navbar";
import EmployeeNavbar from "../../Employee/Layout/Navbar";
import Select from "react-select";
import Pagination from "react-js-pagination";
import dateFormat from "dateformat";
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap";
// import { Link } from "react-router-dom";
import { colourStyles } from "../../../../constants/ColorStyle";
import {
  statusOptions,
  priorityOptions,
  statusFormOptions,
  priorityFilterOptions,
} from "../../../../utilities/reportContent";
import {
  getUserListForReporting,
  ticketDeleteRequest,
  getAllTickets,
  ticketSaveRequest,
  ticketUpdateRequest,
  ticketEditRequest,
  deleteItemPost,
} from "../../../../services/admin/ticket.services";
import Comment from "./Comment";
import { Redirect } from "react-router-dom";
import socketClient from "socket.io-client";
import { APIURL } from "../../../../constants/config";

const Index = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [ticketList, setTicketList] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItemsCount, setTotalItemsCount] = useState(1);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [filterStatus, setFilterStatus] = useState({
    value: "open",
    label: "Open",
  });
  const [filterPriority, setFilterPriority] = useState({
    value: "",
    label: "All Priority",
  });
  const [ticketDescription, setTicketDescription] = useState("");
  const [reportList, setReportList] = useState([]);
  const [selectEmployee, setSelectEmployee] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [priority, setPriority] = useState({ value: "low", label: "Low" });
  const [isEditable, setIsEditable] = useState(false);
  const [status, setStatus] = useState({ value: "pending", label: "Pending" });
  const [isComment, setIsComment] = useState(false);
  const [ticketInfo, setTicketInfo] = useState({});
  const [noRecord, setNoRecord] = useState(false);
  const [closedConfirmation, setCloseConfirmation] = useState({
    toggle: false,
    id: "",
  });
  const [showOptions,setShowOptions]=useState();
  const [ticketAllList, setTicketAllList] = useState([]);

  // const [updateTicket,setUpdateTicket] = useState({});

  useEffect(() => {
    let payload = {
      search: "",
    };

    getUserListForReporting(payload).then((item) => {
      let reportingList = [];
      if (item.data) {
        item?.data?.map((item) => {
          if (user?.data?._id !== item._id) {
            reportingList.push({
              value: item._id,
              label: item?.first_name + " " + item?.last_name,
            });
          }
        });
        setReportList(reportingList);
        // setReportList([{
        //     value: user?.data?._id,
        //     label: user?.data?.first_name + " " + user?.data?.last_name,
        // }, ...reportingList]);
        // setSelectEmployee([{
        //     value: user?.data?._id,
        //     label: user?.data?.first_name + " " + user?.data?.last_name,
        // }]);
      }
    });
    let request = {
      userId: user?.data?._id,
      status: filterStatus?.value ? filterStatus?.value : "",
      priority: filterPriority?.value ? filterPriority?.value : "",
    };

    getTickets(request);

    configureSocket();
  }, []);

  const statusChangeHandle = (e) => {
    setActivePage(1);
    setFilterStatus({ value: e.value, label: e.label });
    let request = {
      userId: user?.data?._id,
      status: e.value ? e.value : "",
      priority: filterPriority?.value ? filterPriority?.value : "",
    };

    getTickets(request);
  };

  const getTickets = (request) => {
    setLoading(true);
    getAllTickets(request)
      .then((data) => {
        if (data.status === 200) {
          setTicketAllList(data?.data);
          //setTicketList(data?.data);
          setActivePage(1);
          setLimit(10);
          setTotalItemsCount(data?.data.length);
          setLoading(false);
          setError({});

          // Calculate the index of the first and last items of the current page
          const indexOfLastItem = activePage * limit;
          const indexOfFirstItem = indexOfLastItem - limit;
          const currentItems = data?.data.slice(
            indexOfFirstItem,
            indexOfLastItem
          );
          setTicketList(currentItems);
          setNoRecord(true);
        } else {
          setError(data.errors);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log("erroes", error);
        setError(error);
        setLoading(false);
      });
  };

  const priorityChangeHandle = (e) => {
    setActivePage(1);
    setFilterPriority({ value: e.value, label: e.label });
    let request = {
      userId: user?.data?._id,
      status: filterStatus.value ? filterStatus.value : "",
      priority: e.value ? e.value : "",
    };
    getTickets(request);
  };

  const priorityAddHandle = (e) => {
    setPriority({ value: e.value, label: e.label });
  };

  const statusAddHandle = (e) => {
    setStatus({ value: e.value, label: e.label });
  };

  const openModel = () => {
    setModal(!modal);
    setIsEditable(false);
    setSelectEmployee([]);
    // setSelectEmployee([{
    //     value: user?.data?._id,
    //     label: user?.data?.first_name + " " + user?.data?.last_name,
    // }]);
    setTicketDescription("");
    setPriority({ value: "low", label: "Low" });
    setError({});
  };

  const descriptionHandler = (e) => {
    setError({});
    setTicketDescription(e.target.value);
  };

  const handleEmploye = (e) => {

    setError({});
    setSelectEmployee(e);
  };

  const deleteTicketRequest = (id) => {
    let payload = { _id: id };
    ticketDeleteRequest(payload)
      .then((data) => {
        if (data.status === 200) {
          setDeleteModal(false);
          setTicketId("");

          setLoading(false);

          //for live notification
          var socket = socketClient(APIURL, { transports: ["websocket"] });
          let assignTo = ticketList.filter((itm) => itm.tickets._id == id);
          let assignToNew = [];
          assignTo[0]?.tickets?.ticketAssignee.map((itm) => {
            assignToNew.push({ _id: itm.assignTo[0]._id });
          });
          socket.emit("ticket", { assignTo: assignToNew, action: "delete" });
        } else {
          setError(data.errors);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log("erroes", error);
        setError(error);
        setLoading(false);
      });
  };

  const sendTicketRequest = () => {
    setError({});
    let assignTo = [];

    selectEmployee.length > 0 &&
      selectEmployee.map((user) => {
        assignTo.push(user?.value);
      });
    assignTo.push(user?.data?._id);
    let payload = {
      title: ticketDescription,
      createdBy: user?.data?._id,
      priority: priority?.value,
      status: "",
      assignTo: assignTo,
    };
    setLoading(true);
    ticketSaveRequest(payload)
      .then((data) => {
        if (data.status === 200) {
          setSelectEmployee([]);

          setPriority({ value: "low", label: "Low" });
          setTicketDescription("");
          setLoading(false);
          setModal(false);
          setIsEditable(false);

          //for live notification
          var socket = socketClient(APIURL, { transports: ["websocket"] });
          let NewassignTo = [];
          assignTo.map((itm) => {
            NewassignTo.push({ _id: itm });
          });
          console.log("ticket", NewassignTo);
          socket.emit("ticket", { assignTo: NewassignTo, action: "add" });
        } else {
          setError(data.errors);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log("erroes", error);
        setError(error);
        setLoading(false);
      });
  };

  const updateTicketFun = (id) => {
    setTicketId(id);
    setLoading(true);
    let request = {
      ticketId: id,
    };
    ticketEditRequest(request)
      .then((data) => {
        if (data.status === 200) {
          let assignTo = [];
          setModal(true);
          setIsEditable(true);
          let item = data?.data[0];
          console.log("ticketEditRequest", item);

          // setUpdateTicket(item);
          item?.assignedTo?.length > 0 &&
            item.assignedTo.map((user) => {
              assignTo.push(user?.assignTo[0]?._id);
            });

          let filteredEmployeeData = reportList.filter((val) =>
            assignTo.includes(val.value)
          );
          setSelectEmployee(filteredEmployeeData);

          if (item?.tickets?.status) {
            setStatus({
              value: item?.tickets?.status,
              label:
                item?.tickets?.status.charAt(0).toUpperCase() +
                item?.tickets?.status.slice(1),
            });
          }
          if (item?.tickets?.priority) {
            setPriority({
              value: item?.tickets?.priority,
              label:
                item?.tickets?.priority.charAt(0).toUpperCase() +
                item?.tickets?.priority.slice(1),
            });
          }

          setTicketDescription(item?.tickets?.title);

          // setTicketList(data?.data);
          setLoading(false);
          setError({});
        } else {
          setError(data.errors);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log("erroes", error);
        setError(error);
        setLoading(false);
      });
  };

  const updateTicketRequest = () => {
    setError({});
    let assignTo = [];

    selectEmployee.length > 0 &&
      selectEmployee.map((user) => {
        assignTo.push(user?.value);
      });
    assignTo.push(user?.data?._id);
    let payload = {
      _id: ticketId,
      title: ticketDescription,
      createdBy: user?.data?._id,
      priority: priority?.value,
      status: status?.value,
      assignTo: assignTo,
    };
    setLoading(true);
    ticketUpdateRequest(payload)
      .then((data) => {
        if (data.status === 200) {
          setSelectEmployee([]);

          setPriority({ value: "low", label: "Low" });
          setTicketDescription("");
          setLoading(false);
          setModal(false);
          setIsEditable(false);

          //for live notification
          var socket = socketClient(APIURL, { transports: ["websocket"] });
          let NewassignTo = [];
          assignTo.map((itm) => {
            NewassignTo.push({ _id: itm });
          });

          let oldAssignTo = ticketList.filter(
            (itm) => itm.tickets._id == ticketId
          );

          oldAssignTo[0]?.tickets?.ticketAssignee.map((itm) => {
            NewassignTo.push({ _id: itm.assignTo[0]._id });
          });

          socket.emit("ticket", { assignTo: NewassignTo, action: "update" });
          //end here
        } else {
          setError(data.errors);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log("erroes", error);
        setError(error);
        setLoading(false);
      });
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    // Calculate the index of the first and last items of the current page
    const indexOfLastItem = pageNumber * limit;
    const indexOfFirstItem = indexOfLastItem - limit;
    const currentItems = ticketAllList.slice(indexOfFirstItem, indexOfLastItem);
    setTicketList(currentItems);
  };

  const openCommentModal = (item, index) => {
    let newTick = [...ticketList];
    newTick[index].tickets.notificationcount = 0;

    setTicketList(newTick);
    setIsComment(!isComment);
    setTicketInfo(item);
    // commentListFun(item?.tickets?._id);
    setTicketId(item?.tickets?._id);
  };

  const closeComment = () => {
    setIsComment(false);
  };

  // const commentListFun = (ticketId) => {
  //     setLoading(true);
  //     console.log(commentList);
  //     let payload = {
  //         ticketId: ticketId,
  //         userId: user?.data?._id
  //     };
  //     getAllComments(payload).then((data) => {
  //         if (data.status === 200) {
  //             setCommentList(data?.data);
  //             setLoading(false);
  //             setError({});
  //         } else {
  //             setError(data.errors);
  //             setLoading(false);
  //         }
  //     }).catch((error) => {
  //         console.log("erroes", error);
  //         setError(error);
  //         setLoading(false);
  //     });
  // };

  const configureSocket = () => {
    var socket = socketClient(APIURL, { transports: ["websocket"] });
    socket.on("ticketComment", (data) => {
      console.log("data.data.ticketAssignee", data.data.ticketAssignee);

      let ticketUser = data.data.ticketAssignee.filter(
        (assign) => assign.assignTo[0]._id == user?.data?._id
      );
      //alert(user?.data?._id +"!="+ data.data.userId +"&&"+ ticketUser.length);
      if (
        ticketInfo?.tickets?._id != data.data.ticketId &&
        user?.data?._id != data.data.userId &&
        ticketUser.length > 0
      ) {
        let request = {
          userId: user?.data?._id,
          status: filterStatus?.value ? filterStatus?.value : "",
          priority: filterPriority?.value ? filterPriority?.value : "",
        };
        getTickets(request);
      }
    });

    socket.on("ticket", (data) => {
      let ticketUser = data?.assignTo.filter(
        (assign) => assign._id == user?.data?._id
      );

      if (ticketUser.length && data.action != "view") {
        let request = {
          userId: user?.data?._id,
          status: filterStatus?.value ? filterStatus?.value : "",
          priority: filterPriority?.value ? filterPriority?.value : "",
        };
        getTickets(request);
      }
    });
  };

  const getUserInitials = (Name) => {
    if (Name !== undefined && Name !== null && Name != "") {
      const initials = Name.charAt(0);
      return initials.toUpperCase();
    } else {
      return "";
    }
  };

  const ticketFormate = (tiId) => {
    tiId = "" + tiId;
    if (tiId.length == 1) {
      tiId = "000" + tiId;
    } else if (tiId.length == 2) {
      tiId = "00" + tiId;
    } else if (tiId.length == 3) {
      tiId = "0" + tiId;
    }

    return "#" + tiId;
  };

  const closedItem = (id) => {
    setCloseConfirmation({ toggle: true, id });
  };

  const closedItemConfirm = () => {
    setLoading(true);
    deleteItemPost({ ticketId: closedConfirmation.id, status: "close" }).then(
      (result) => {
        if (result.status == 200) {
          let request = {
            userId: user?.data?._id,
            status: filterStatus?.value ? filterStatus?.value : "",
            priority: filterPriority?.value ? filterPriority?.value : "",
          };
          setLoading(false);
          getTickets(request);
          setCloseConfirmation((x) => {
            return { ...x, toggle: false };
          });
        } else setLoading(false);
      }
    );
  };

  const handleInputChange = useCallback((typedOption) => {
    if (typedOption.trim().length > 2 ) {
      setShowOptions(true);
    }
    else {
      setShowOptions(false);
    }
  }, []);

  if (!user) {
    return <Redirect to="/" />;
  }
  // if (user.data.user_role !== "Admin") {
  //     return <Redirect to="/" />;
  // }
  return (
    <React.Fragment>
      {user.data.user_role === "Admin" ? (
        <Navbar activePage="dashboard" />
      ) : (
        <EmployeeNavbar activePage="dashboard" />
      )}
      <main className="offset mr-0">
        <div className="container-fluid hard-pad">
          <div className="row align-items-center pt-4 border-mobile">
            <div className="col-lg-4 col-6">
              <h2 className="page-heading">Action Items</h2>
            </div>
            <div className="col-lg-8 text-right">
              <a
                href="javascript:;"
                data-toggle="modal"
                data-target="#applyTicket"
                onClick={() => openModel()}
                className="link"
              >
                Create Action Item
              </a>
            </div>
          </div>
          <div className="row align-items-center pt-4 border-mobile">
            <div className="col-lg-12">
              <ul
                className="submenu menu_width"
                style={{ position: "relative", zIndex: 2 }}
              >
                <li>
                  <Select
                    styles={colourStyles}
                    options={statusOptions}
                    onChange={(e) => statusChangeHandle(e)}
                    value={filterStatus}
                  />
                </li>
                <li>
                  <Select
                    styles={colourStyles}
                    options={priorityFilterOptions}
                    onChange={(e) => priorityChangeHandle(e)}
                    value={filterPriority}
                  />
                </li>
                {/* <li>
                    <input className="date_picker" type="date" />
                </li>
                <li>
                    <input className="date_picker" type="date" />
                </li> */}
              </ul>
            </div>
          </div>

          <div className="pagination_mrg">
            {ticketList &&
              ticketList.map((item, index) => (
                <div className="card my-3" key={index}>
                  <div
                    className={"activ_status " + item?.tickets?.status}
                  ></div>
                  <div className="card-body p-3">
                    <div className="row align-items-center">
                      <div className="col-9">
                        <div className="d-flex align-items-center">
                          <h6 className="m-0 mr-3">
                            <a
                              href="javascript:;"
                              onClick={() => openCommentModal(item, index)}
                            >
                              {ticketFormate(item?.tickets?.ticket_UID)}
                            </a>
                          </h6>

                          <div>
                            {item?.tickets?.notificationcount > 0 && (
                              <span className="badge badge-pill badge-danger mr-3">
                                {item?.tickets?.notificationcount}
                              </span>
                            )}
                          </div>
                          <div className="mr-3">
                            {item?.tickets?.priority === "high" ? (
                              <span className="capsule red-dim mr-2">High</span>
                            ) : item?.tickets?.priority === "medium" ? (
                              <span className="capsule green-dim mr-2">
                                Medium
                              </span>
                            ) : (
                              <span className="capsule Blackberry-dim mr-2">
                                Low
                              </span>
                            )}
                          </div>
                          <div>
                            <div
                              className="user_assign"
                              style={{ marginRight: "-5px" }}
                            >
                              {item?.tickets?.ticketAssignee?.length
                                ? item?.tickets?.ticketAssignee
                                    .filter(
                                      (itm) =>
                                        itm?.assignTo[0]?._id !=
                                        item?.createdBy[0]?._id
                                    )
                                    .map((profile, index) => (
                                      <React.Fragment key={index}>
                                        {profile?.assignTo[0]?.profileImage ? (
                                          <a
                                            href="javascript:;"
                                            title={
                                              profile?.assignTo[0]?.first_name +
                                              " " +
                                              profile?.assignTo[0]?.last_name
                                            }
                                          >
                                            <img
                                              src={
                                                APIURL +
                                                "./assets/uploads/profileImages/" +
                                                profile?.assignTo[0]
                                                  ?.profileImage
                                              }
                                              alt="user name"
                                            />
                                          </a>
                                        ) : (
                                          <a
                                            className="avtar"
                                            title={
                                              profile?.assignTo[0]?.first_name +
                                              " " +
                                              profile?.assignTo[0]?.last_name
                                            }
                                          >
                                            {getUserInitials(
                                              profile?.assignTo[0]?.first_name
                                            ) +
                                              getUserInitials(
                                                profile?.assignTo[0]?.last_name
                                              )}
                                          </a>
                                        )}
                                      </React.Fragment>
                                    ))
                                : null}
                            </div>
                          </div>
                        </div>

                        <p className="mt-1 mb-0">{item?.tickets?.title}</p>
                      </div>
                      <div className="col-1">
                        <div className="divider">&nbsp;</div>
                      </div>
                      <div className="col-2">
                        <div>
                          <div className="row align-items-center justify-content-between">
                            <div className="text-center">
                              <span className="text-muted">
                                {dateFormat(
                                  item?.tickets?.createdAt,
                                  " dd mmm"
                                )}
                              </span>
                            </div>
                            <div>
                              <div className="text-center">
                                <div className="user_assign m-auto">
                                  {item?.createdBy[0]?.profileImage ? (
                                    <a
                                      href="javascript:;"
                                      title={
                                        item?.createdBy[0]?.first_name +
                                        " " +
                                        item?.createdBy[0]?.last_name
                                      }
                                    >
                                      <img
                                        src={
                                          APIURL +
                                          "./assets/uploads/profileImages/" +
                                          item?.createdBy[0]?.profileImage
                                        }
                                        alt="user name"
                                      />
                                    </a>
                                  ) : (
                                    <a
                                      className="avtar"
                                      title={
                                        item?.createdBy[0]?.first_name +
                                        " " +
                                        item?.createdBy[0]?.last_name
                                      }
                                    >
                                      {getUserInitials(
                                        item?.createdBy[0]?.first_name
                                      ) +
                                        getUserInitials(
                                          item?.createdBy[0]?.last_name
                                        )}
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                            {item?.createdBy[0]?._id === user?.data?._id ? (
                              <div className="action-area dropdown">
                                <a
                                  className="dropdown-toggle"
                                  href="#"
                                  id="navbarDropdown"
                                  role="button"
                                  data-toggle="dropdown"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                >
                                  <span className="dots">...</span>
                                </a>
                                <div
                                  className="dropdown-menu"
                                  aria-labelledby="navbarDropdown"
                                >
                                  <a
                                    className="dropdown-item"
                                    href=""
                                    data-toggle="modal"
                                    data-target="#editUser"
                                    onClick={() =>
                                      updateTicketFun(item?.tickets?._id)
                                    }
                                  >
                                    Edit
                                  </a>
                                  <a
                                    className="dropdown-item"
                                    data-toggle="modal"
                                    onClick={() => {
                                      setDeleteModal(true),
                                        setTicketId(item?.tickets?._id);
                                    }}
                                    data-target="#deleteUser"
                                  >
                                    Delete
                                  </a>

                                  {item.tickets.status == "close1" && (
                                    <a
                                      className="dropdown-item"
                                      data-toggle="modal"
                                      onClick={() =>
                                        closedItem(item?.tickets?._id)
                                      }
                                      data-target="#closedUser"
                                    >
                                      Close
                                    </a>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="action-area dropdown"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {noRecord == true && ticketList && ticketList.length == 0 && (
            <div>
              <div className="norecords">RECORD NOT FOUND</div>
            </div>
            )}
          </div>

          {ticketList && ticketList.length > 0 && (
            <Pagination
              className="pagination_mrg"
              activePage={activePage}
              itemsCountPerPage={limit}
              totalItemsCount={totalItemsCount}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
              itemClass="page-item"
              linkClass="page-link"
              innerClass="pagination justify-content-center mt-5"
              activeLinkClass="active"
              nextPageText="Next"
              prevPageText="Previous"
            />
          )}
        </div>
      </main>

      <Modal
        size="xl"
        isOpen={modal}
        toggle={() => {
          setModal(false), setIsEditable(false);
        }}
      >
        <div className="modal-content">
          <ModalHeader
            className="header-less"
            toggle={() => {
              setModal(false), setIsEditable(false);
            }}
          >
            <h5 className="modal-title" id="exampleModalLabel">
              {isEditable ? "Update Action Item" : "Create Action Item"}{" "}
            </h5>
          </ModalHeader>
          <ModalBody className="modal-body">
            <div className="my-2">
              <div className="form-row">
                <div className="col">
                  <div className="form-group">
                    <label>
                      Description<strong className="text-danger">*</strong>
                    </label>
                    <textarea
                      max="250"
                      type="text"
                      value={ticketDescription}
                      rows="5"
                      className="form-control"
                      onChange={(e) => descriptionHandler(e)}
                    />
                    {error ? (
                      <span className="text-danger"> {error?.title}</span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="col">
                  <div className="form-group iconRemove">
                    <label>
                      Assign<strong className="text-danger">*</strong>
                    </label>
                    <Select
                      // styles={colourStyles}
                      isMulti
                      onChange={(e) => handleEmploye(e)}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="Type to search"
                      value={selectEmployee}
                      options={showOptions?reportList:[]}
                      noOptionsMessage={()=>showOptions?"No options" : null}
                      onInputChange = { handleInputChange }
                    />
                    {error ? (
                      <span className="text-danger"> {error.assignTo}</span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="col">
                  <div className="form-group">
                    <label>
                      Priority
                    </label>
                    <Select
                      styles={colourStyles}
                      options={priorityOptions}
                      onChange={(e) => priorityAddHandle(e)}
                      value={priority}
                    />
                    {error ? (
                      <span className="text-danger"> {error.priority}</span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>

              {isEditable ? (
                <div className="form-row">
                  <div className="col">
                    <div className="form-group">
                      <label>
                        Status
                      </label>
                      <Select
                        styles={colourStyles}
                        options={statusFormOptions}
                        onChange={(e) => statusAddHandle(e)}
                        value={status}
                      />
                      {error ? (
                        <span className="text-danger"> {error.status}</span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </ModalBody>
          <ModalFooter className="modal-footer">
            <Button color="secondary" className="mr-3" onClick={() => {setModal(false), setIsEditable(false); }} > Cancel </Button>
            {loading ? (
              <Button color="primary">Loading...</Button>
            ) : (
              <Button
                color="primary"
                onClick={() =>
                  isEditable ? updateTicketRequest() : sendTicketRequest()
                }
              >
                {isEditable ? "Update" : "Submit"}
              </Button>
            )}
          </ModalFooter>
        </div>
      </Modal>

      <Modal
        size="md"
        isOpen={deleteModal}
        toggle={() => setDeleteModal(false)}
      >
        <div className="modal-content">
          <ModalHeader
            className="header-less"
            toggle={() => setDeleteModal(false)}
          >
            <div>Delete Action Item</div>
          </ModalHeader>
          <ModalBody className="border-0 text-left">
            Are you sure want to delete action item ?
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" className="mr-3" onClick={() => setDeleteModal(false)}>
              Cancel
            </Button>
            {loading ? (
              <Button color="primary">Loading... </Button>
            ) : (
              <Button
                color="primary"
                onClick={() => deleteTicketRequest(ticketId)}
              >
                Delete
              </Button>
            )}
          </ModalFooter>
        </div>
      </Modal>
      <Modal
        size="md"
        isOpen={closedConfirmation.toggle}
        toggle={() =>
          setCloseConfirmation((x) => {
            return { ...x, toggle: false };
          })
        }
      >
        <div className="modal-content">
          <ModalHeader
            className="header-less"
            toggle={() =>
              setCloseConfirmation((x) => {
                return { ...x, toggle: false };
              })
            }
          >
            <div>Close Action Item</div>
          </ModalHeader>
          <ModalBody className="border-0 text-left">
            Are you sure want to close action item ?
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" className="mr-3" onClick={() => setCloseConfirmation((x) => {return { ...x, toggle: false }; }) } > Cancel </Button>
            <Button color="primary" onClick={() => closedItemConfirm()}>
              Yes
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {isComment ? (
        <Comment
          isComment={isComment}
          closeComment={closeComment}
          // ticketInfo={ticketInfo}
          ticketId={ticketId}
          // commentListFun={(id) => commentListFun(id)}
        />
      ) : null}

      <Footer />
    </React.Fragment>
  );
};

export default Index;

// <style>
// .user_assign {display: flex; align-items: center;}
// .user_assign a:first-child {margin-left: 0;}
// .user_assign a {display: block; width:; 32px height:; 32px border-radius: 100%; overflow: hidden; text-align: center; position: relative; margin-left:; -10px }
// .user_assign a img {width: 100%; min-height: 100%;
// }
// </style>
