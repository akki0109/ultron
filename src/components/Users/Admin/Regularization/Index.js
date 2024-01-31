import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Footer from "../../../GlobalComponents/Footer";
import Navbar from "../Layout/Navbar";
import { regularizationActions } from "../../../../actions";
import dateFormat from "dateformat";
import socketClient from "socket.io-client";
import { APIURL } from "../../../../constants/config";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";
import Pagination from "react-js-pagination";
import RegularizationRequest from "./Request/Index";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem("user")),
      allMonth: [
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
      ],
      search: "",
      Modal: false,
      status: "",
      attendanceDetail: "",
      UpdateScsMsg: "",
      rejectModal: false,
      activePage: 1,
      limit: 10,
      totalItemsCount: 1,
      actionUserId: 0,
      Requestdate: "",
      first_name: "",
      last_name: "",
      toggle: false,
      approveInstance: "",
    };
  }

  getAttendanceDetail(userId, request_date) {
    this.props.dispatch(
      regularizationActions.getAttendanceDetail({
        userId: userId,
        attendanceDate: dateFormat(request_date, "yyyy-mm-dd"),
      })
    );
  }

  rejectedModal(id, status) {
    this.props.dispatch(
      regularizationActions.updateRequestStatus({ id: id, status: status })
    );

    this.setState(
      {
        rejectModal: false,
        Modal: false,
        UpdateScsMsg: "",
      },
      () => {
        this.addReulrizeToSocket();
      }
    );
  }

  getPendingRequests() {
    this.props.dispatch(
      regularizationActions.getPendingRequests({
        page: this.state.activePage,
        search: this.state.search,
        reportTo: this.state.user.data._id,
      })
    );
  }

  configureSocket = () => {
    var socket = socketClient(APIURL, { transports: ["websocket"] });
    socket.on("attendance", (data) => {
      if (this.state.filterUser == data.userId) {
        this.getAttendanceList();
      }
    });
    socket.on("regularization", (data) => {
      console.log(data);
      this.getPendingRequests();
    });
  };

  openModel(data) {
    // console.log("suyyyyas", data.regularizationRequestBy[0].last_name);

    this.setState({
      Modal: !this.state.Modal,
      notes: data.requestRegularizes.note,
      Requestdate: data.requestRegularizes.request_date,
      status: data.requestRegularizes.status,
      id: data.requestRegularizes._id,
      actionUserId: data.requestRegularizes.userId,
      first_name: data.regularizationRequestBy[0].first_name,
      last_name: data.regularizationRequestBy[0].last_name,
      approveInstance: {
        regularizeId: data.requestRegularizes._id,
        userId: data.requestRegularizes.userId,
        attendanceDate: data.requestRegularizes.request_date.slice(0, 10),
      },
    });
  }
  RejectModel(data) {
    this.setState({
      rejectModal: !this.state.rejectModal,
      notes: data.requestRegularizes.note,
      Requestdate: data.requestRegularizes.request_date,
      status: data.requestRegularizes.status,
      id: data.requestRegularizes._id,
      actionUserId: data.requestRegularizes.userId,
      first_name: data.regularizationRequestBy[0].first_name,
      last_name: data.regularizationRequestBy[0].last_name,
    });
  }

  closeModal = () => {
    this.setState(
      {
        rejectModal: false,
        Modal: false,
        UpdateScsMsg: "",
      },
      () => {
        this.addReulrizeToSocket();
      }
    );
  };

  closeRegularizeModal = () => {
    this.setState(
      {
        rejectModal: false,
        Modal: false,
        UpdateScsMsg: "",
      });
  };

  closeRejectModal = () => {
    this.setState({
      rejectModal: false,
    });
  };
  handlePageChange(pageNumber) {
    this.setState(
      {
        activePage: pageNumber,
      },
      () => {
        this.getPendingRequests();
      }
    );
  } 

  addReulrizeToSocket() {
    var socket = socketClient(APIURL, { transports: ["websocket"] });
    socket.emit("regularization", { userId: this.state.actionUserId });
    socket.emit("attendance", { userId: this.state.actionUserId, name: "" });
  }

  componentDidMount() {
    if (this.state.user) {
      this.configureSocket();
      this.getPendingRequests();
    }
  }

  render() {
    const { pendingList, totalItemsCount } = this.props;
    const { getAllAttendanceDetail, loading } = this.props;
    const { UpdateScsMsg } = this.state;

    // console.log("totalItemsCount", totalItemsCount);

    if (!this.state.user) {
      return <Redirect to="/" />;
    }

    if (this.state.user.data.user_role !== "Admin") {
      return <Redirect to="/" />;
    }

    return (
      <div>
        <Navbar activePage="dashboard" />
        <main className="offset">
          <div className="container-fluid hard-pad">
            <div className="row align-items-center pt-4 border-mobile">
              <div className="col-lg-6 col-6">
                <h2 className="page-heading"> Regularization Requests </h2>
              </div>
            </div>

            <div id="table-scroll" className="table-scroll mt-4 pagination_mrg page_plus">
              <table id="main-table"className="main-table full-first-td">
                <thead>
                  <tr>
                    <th scope="col" className=""> Employee Name </th> 
                    <th scope="col" className="text-left"> Request Date </th> 
                    <th scope="col" className="text-left"> Note </th> 
                    <th scope="col" className="text-center"> Status </th> 
                    <th scope="col" className="text-center"> Action </th>
                  </tr>
                </thead>
                <tbody>
                  {pendingList &&
                    pendingList.map((item, index) => (
                      <tr key={index}>
                        <td className="text-capitalize text-nowrap">
                          <a>
                            <strong>
                              {item.regularizationRequestBy[0].first_name +
                                " " +
                                item.regularizationRequestBy[0].last_name}
                            </strong>
                          </a>
                        </td>
                        {item.requestRegularizes.request_date ? (
                          <td className="text-left text-nowrap">
                            <a>
                              {dateFormat(
                                item.requestRegularizes.request_date,
                                "ddd, dd mmm"
                              )}
                            </a>
                          </td>
                        ) : (
                          ""
                        )}
                        <td>
                            <OverlayTrigger
                              placement={"top"}
                              delay={{ hide: 450, show: 300 }}
                              overlay={
                                <Popover id={"popover-positioned-top"}>
                                  <Popover.Header as="h3" className="text-capitalize">{item.regularizationRequestBy[0].first_name + " " + item.regularizationRequestBy[0].last_name}</Popover.Header>
                                  <Popover.Body>
                                  Hi, We Got A Request For Regularization.
                                  </Popover.Body>
                                </Popover>
                              }
                            >
                              <div className="text_eclip text-capitalize" style={{maxWidth:"300px"}}>
                                <a>Hi, We Got A Request For Regularization.</a>
                              </div>
                            </OverlayTrigger>
                          
                        </td>
                        {item.requestRegularizes.status == "pending" ? (
                          <td data-th="" className="text-center">
                            <a title="Pending">
                              <span className="capsule red-dim">Pending</span>
                            </a>
                          </td>
                        ) : (
                          <td data-th="" className="text-left">
                            <a>
                              <span className="capsule red-dim"></span>
                            </a>
                          </td>
                        )}

                        {getAllAttendanceDetail ? (
                          <td data-th="Order Value" className="text-left">
                            <React.Fragment>
                              <div className="d-flex align-items-center justify-content-between">
                                <Button
                                  id={`btn-${index}`}
                                  // id={parseInt(index)}
                                  type="button"
                                  color="light"
                                  size="sm"
                                >
                                  <i
                                    className="fa fa-check-circle text-warning fa-lg"
                                    aria-hidden="true"
                                    onClick={this.getAttendanceDetail.bind(
                                      this,
                                      item.requestRegularizes.userId,
                                      item.requestRegularizes.request_date
                                    )}
                                  ></i>
                                </Button>

                                <a
                                  onClick={this.openModel.bind(this, item)}
                                  className="btn btn-success btn-small mx-1"
                                >
                                  Approve
                                </a>
                                {/* <a
                                  onClick={this.RejectModel.bind(
                                    this,
                                    item,
                                    "rejected"
                                  )}
                                  className="btn btn-danger btn-small"
                                >
                                  Reject
                                </a> */}

                                <UncontrolledPopover
                                  placement="top"
                                  target={`btn-${index}`}
                                  // target={parseInt(index)}
                                  trigger="legacy"
                                >
                                  <PopoverHeader>
                                    {dateFormat(
                                      getAllAttendanceDetail[0].loginDate,
                                      "ddd, dd mmm"
                                    )}
                                  </PopoverHeader>
                                  <PopoverBody>
                                    <div className="row m-0">
                                      <div className="col-12 p-0">
                                        <p className="mb-3">
                                          <strong>Web Clock In</strong>
                                        </p>
                                        {getAllAttendanceDetail[0].attendanceDetail.map(
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
                              </div>
                            </React.Fragment>
                          </td>
                        ) : (
                          <td
                            data-th="Order Value"
                            className="text-left rmv_tbl_padding"
                          >
                            <React.Fragment>
                              <div className="d-flex align-items-center justify-content-center">
                                <Button
                                  id={`btn-${index}`}
                                  // id={parseInt(index)}
                                  type="button"
                                  color="light"
                                  size="sm"
                                >
                                  <i
                                    className="fa fa-check-circle text-warning fa-lg"
                                    aria-hidden="true"
                                    onClick={this.getAttendanceDetail.bind(
                                      this,
                                      item.requestRegularizes.userId,
                                      item.requestRegularizes.request_date
                                    )}
                                  ></i>
                                </Button>

                                <a
                                  onClick={this.openModel.bind(this, item)}
                                  className="btn btn-success btn-small mx-1"
                                >
                                  Approve
                                </a>
                                {/* <a
                                  onClick={this.RejectModel.bind(
                                    this,
                                    item,
                                    "rejected"
                                  )}
                                  className="btn btn-danger btn-small"
                                >
                                  Reject
                                </a> */}
                                {/* <UncontrolledPopover
                                  placement="top"
                                  target={`btn-${index}`}
                                  // target={parseInt(index)}
                                  trigger="legacy"
                                >
                                  <PopoverHeader></PopoverHeader>
                                  <PopoverBody></PopoverBody>
                                </UncontrolledPopover> */}
                              </div>
                            </React.Fragment>
                          </td>
                        )}
                      </tr>
                    ))}
                  {pendingList && pendingList.length < 1 && (
                   <tr className="nobg-hover">
                      <td colSpan="5" className="text-center">
                        <div className="norecords">RECORD NOT FOUND</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {pendingList &&
            pendingList.length > 0 &&
            totalItemsCount != undefined && (
              <Pagination
                activePage={this.state.activePage}
                itemsCountPerPage={this.state.limit}
                totalItemsCount={totalItemsCount}
                pageRangeDisplayed={5}
                onChange={this.handlePageChange.bind(this)}
                itemClass="page-item"
                linkClass="page-link"
                innerClass="pagination justify-content-center"
                activeLinkClass="active"
                nextPageText="Next"
                prevPageText="Previous"
              />
            )}
        </main>
        <div className="right-aside">
          <p className="mt-5 text-center">Regularization Summary</p>

          <div className="stats mt-3">
            {pendingList &&
            pendingList.length > 0 &&
            totalItemsCount != undefined ? (
              <div className="stats-big">{totalItemsCount}</div>
            ) : (
              <div className="stats-big">0</div>
            )}
            <div className="stats-small">Pending Requests</div>
          </div>
        </div>

        <Modal
          size="ml"
          isOpen={this.state.rejectModal}
          toggle={() => this.closeRejectModal()}
        >
          <div className="modal-content">
            <ModalHeader
              className="header-less ml-2"
              toggle={() => this.closeRejectModal()}
            >
              Regularization request
            </ModalHeader>
            <ModalBody className="border-0 text-center">
              <div
                id="table-scroll"
                className="table-scroll h-auto popup_table my-3"
              >
                <table id="main-table" className="main-table full-first-td">
                  <thead>
                    <tr>
                      <th scope="col" className="text-left"> Regularization Date </th> 
                      <th scope="col" className="text-right"> Type/Reason
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-left">
                        <strong>
                          {dateFormat(this.state.Requestdate, "ddd, dd mmm")}
                        </strong>
                        <div>
                          <small>
                            <span>
                              {this.state.first_name}
                              {this.state.last_name}
                            </span>
                          </small>
                        </div>
                      </td>
                      <td data-th="" className="text-right">
                        {this.state.leave_type}
                        <div>
                          <small>{this.state.notes}</small>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-12">
                {UpdateScsMsg && (
                  <span className="text-success fs-5">{UpdateScsMsg}</span>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-secondary mr-3" onClick={() => this.closeRejectModal()} > {" "} Cancel </button>
              {loading ? (
                <Button color="danger"> Loading... </Button>
              ) : (
                <Button
                  color="danger"
                  onClick={this.rejectedModal.bind(
                    this,
                    this.state.id,
                    "rejected"
                  )}
                >
                  {" "}
                  Reject{" "}
                </Button>
              )}
            </ModalFooter>
          </div>
        </Modal>
        <Footer />
        {/*Regularization Request */}
        <RegularizationRequest
          isOpen={this.state.Modal}
          closeModal={()=>{this.setState({Modal: false});this.addReulrizeToSocket();}}
          approveInstance={this.state.approveInstance}
          approveDate={this.state.Requestdate}
          pageRefresh={() => {
            this.getPendingRequests();
          }}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    pendingList,
    updateList,
    getAllAttendanceDetail,
    UpdateScsMsg,
    loading,
    activePage,
    totalItemsCount,
    limit,
    error,
  } = state.rootReducer.regularization;
  return {
    error,
    updateList,
    pendingList,
    UpdateScsMsg,
    getAllAttendanceDetail,
    loading,
    activePage,
    totalItemsCount,
    limit,
  };
}

export default connect(mapStateToProps)(Index);
