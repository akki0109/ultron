import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import TimePicker from "react-time-picker";
import moment from "moment";
import { adminAttendanceService } from "../../../../../services/admin/attendance.services";
import dateFormat from "dateformat";
const Request = (props) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState([]);
  const [error, setError] = useState();
  useEffect(() => {
    if (props.isOpen) getData();
  }, [props.isOpen]);
  const getData = () => {
    const newArray = props.attendanceList?.map((item) => {
      return {
        log_in_time: moment(
          item.log_in_time != "Invalid date" ? item.log_in_time : "11:00:00 am",
          "hh:mm:ss a"
        ).format("hh:mm:ss A"),
        log_out_time: moment(
          item.log_out_time != "Invalid date"
            ? item.log_out_time
            : "11:00:00 am",
          "hh:mm:ss a"
        ).format("hh:mm:ss A"),
      };
    });

    if (newArray == undefined)
      setData([
        {
          log_in_time: "11:00:00 AM",
          log_out_time: "11:00:00 AM",
        },
      ]);
    else setData(newArray);
  };

  const removeTime = (id) => {
    const filterData = data?.filter((item, index) => {
      if (index != id) return item;
    });
    setData(filterData);
  };
  const handleChange = (value, index, name) => {
    let valueFormat = moment(value, "HH:mm").format("hh:mm:ss A");
    let updatedData = data;
    if (name == "log_in_time") updatedData[index].log_in_time = valueFormat;
    else updatedData[index].log_out_time = valueFormat;
    setData(updatedData);
  };

  const addObject = () => {
    setData((x) => [
      ...x,
      {
        log_in_time: "11:00:00 AM",
        log_out_time: "11:00:00 AM",
      },
    ]);
  };

  const saveChanges = () => {
    const updatedData = {
      userId: user.data._id,
      request_date: props.attendanceListDate,
      attendaceDetails: data,
    };
    let arr = [];
    data.map((item) => {
      arr.push(
        moment
          .duration(moment(item.log_in_time, "hh:mm:ss A").format("HH:mm"))
          .asMinutes()
      );
      arr.push(
        moment
          .duration(moment(item.log_out_time, "hh:mm:ss A").format("HH:mm"))
          .asMinutes()
      );
    });
    function arraySortedOrNot(arr, n) {
      if (n == 1 || n == 0) return 1;
      if (arr[n - 1] < arr[n - 2]) return 0;
      return arraySortedOrNot(arr, n - 1);
    }
    let n = arr.length;
    if (arraySortedOrNot(arr, n) != 0) {
      setError("");
      adminAttendanceService.updateEmployeTimeTabel(updatedData).then(() => {
        props.pageRefresh();
        props.setToggle(false);
      });
    } else {
      setError("Please enter the correct time...");
    }
  };

  const regularizeClose = () => {
    props.setToggle(false);
    setError("");
  };
  console.log("Data", data);
  return (
    <div>
      <Modal show={props.isOpen} onHide={"true"} className="small_modal">
        <Modal.Header>
          <Modal.Title>
            <h5>
              Regularization Request: {" "}
              <span className="small text-muted"> {dateFormat(props.attendanceListDate, "fullDate")} </span>
            </h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {data.length>0&&data?(<div className="row ">
              <div className="col-4">
                <label>From</label>
              </div>
              <div className="col-4">
                <label>To</label>
              </div>
            </div>):""}
            {data &&
              data?.map((item, index) => (
                <div className="row " key={index}>
                  <div className="col-4">
                    <div className="mb-3">
                      <TimePicker
                        value={
                          item?.log_in_time != "Invalid date"
                            ? moment(item?.log_in_time, "hh:mm:ss A").format(
                                "HH:mm:ss"
                              )
                            : "11:00"
                        }
                        name="log_in_time"
                        onChange={(e) => handleChange(e, index, "log_in_time")}
                        format="hh:mm a"
                        className="w-100 form-control"
                        clearIcon
                        disableClock
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-3">
                      <TimePicker
                        value={
                          item?.log_out_time != "Invalid date"
                            ? moment(item?.log_out_time, "hh:mm:ss A").format(
                                "HH:mm:ss"
                              )
                            : "11:00"
                        }
                        onChange={(e) => handleChange(e, index, "log_out_time")}
                        format="hh:mm a"
                        className="w-100 form-control"
                        clearIcon
                        disableClock
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div>
                      <div>
                        <Button
                          variant="btn btn-secondary"
                          className=" btn-block"
                          onClick={() => removeTime(index)}
                        >
                          Remove Time
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {data.length == 0 && (
              <div className="row ">
                <div className="col-12" align="center">
                  <div className="alert alert-danger text-center">
                    {" "}
                    Please Enter At Least One Record{" "}
                  </div>
                </div>
              </div>
            )}
            <div className="row">
              <div className="col-4  offset-8">
                {error && <h6 className="text-danger">{error}</h6>}
              </div>

              <div className="col-4  offset-8" align="right">
                <div>
                  <Button
                    variant="success"
                    className="btn-block btn-success"
                    onClick={addObject}
                  >
                    Add Time
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              regularizeClose();
            }}
            className="mr-3"
          >
            {" "}
            Close{" "}
          </Button>
          <Button
            variant="primary"
            onClick={data?.length >= 1 ? saveChanges : ""}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Request;
