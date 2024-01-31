import React, { useEffect, useState,memo } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
  getEmployeTimeTabel,
  updateEmployeTimeTabel,
} from "../../../../../services/regularization.services";
import TimePicker from "react-time-picker";
import dateFormat from "dateformat";
import moment from "moment";

const Index = (props) => {
  const [data, setData] = useState([]);
  
  const [error, setError] = useState();
  useEffect(() => {
    getData();
  }, [props.isOpen]);

  const getData = () => {
    getEmployeTimeTabel(props.approveInstance).then((Result) => {
      const newArray = Result.data.map((item) => {
        return {
          log_in_time: moment(item.log_in_time!="Invalid date"?item.log_in_time:"11:00:00 am", "hh:mm:ss a").format(
            "hh:mm:ss A"
          ),
          log_out_time: moment(item.log_out_time!="Invalid date"?item.log_out_time:"11:00:00 am", "hh:mm:ss a").format(
            "hh:mm:ss A"
          ),
        };
      }); // use for format 00:00:00 AM.
      setData(newArray);
    });
  };
  console.log("Data",data);

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
    const updatedData = { ...props.approveInstance, attendaceDetails: data };
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
    console.log("array", arr);

    function arraySortedOrNot(arr, n) {
      if (n == 1 || n == 0) return 1;
      if (arr[n - 1] < arr[n - 2]) return 0;
      return arraySortedOrNot(arr, n - 1);
    }
    let n = arr.length;
    if (arraySortedOrNot(arr, n) != 0) {
      setError("");
      updateEmployeTimeTabel(updatedData).then((Result) => {
        console.log(999, Result);
        props.pageRefresh();
        props.closeModal();
      });
      console.log("Yes");
    } else {
      setError("Please enter the correct time...");
      console.log("No");
    }
  };

  const regularizeClose = () => {
    props.closeModal();
    setError("");
  };

  return (
    <div>
      <Modal show={props.isOpen} onHide={"true"} size="lg">
        <Modal.Header>
          <Modal.Title>Regularization Request: {dateFormat(props.approveDate,"fullDate")}</Modal.Title>
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
            
               {data && data?.map((item, index) => (
                <div className="row" key={index}>
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
          <Button variant="secondary"onClick={() => {regularizeClose(); }} className="mr-3"> {" "} Close{" "} </Button>
          <Button variant="primary" onClick={data?.length >=1?saveChanges:""}> Save Changes </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default memo(Index);
