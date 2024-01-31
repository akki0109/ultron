import React, { memo, useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter, Input } from "reactstrap";
import { terminateUser } from "../../../../../../services/admin/terminateUser.service";

const Terminate = (props) => {
  const [error, setError] = useState();
  const { userId } = props;
  const [terminate, setTerminate] = useState({
    userId: "",
    date: "",
    reason: "",
  });

  const submitTerminateData = () => {
    terminate["userId"] = userId;
    terminateUser(terminate).then((result) => {
      if (result?.data?.errors) {
        setError(result?.data?.errors);
      }
      if (result?.status == "200") {
        props.isClose();
        props.userList();
        // props.message((x)=> x + result.message);
      }
    });
  };

  useEffect(() => {
    if (props.isOpen) {
      setError("");
      setTerminate({
        userId: "",
        date: "",
        reason: "",
      });
    }
    if (props.data) {
      setTerminate({
        date: props.data.date,
        reason: props.data.reason,
      });
    }
  }, [props.isOpen, props.data]);

  return (
    <>
      <Modal size="md" isOpen={props.isOpen} toggle={props.isClose}>
        <ModalHeader toggle={props.isClose}>
          {props.data ? "Update Data" : "Exit"}
        </ModalHeader>
        <ModalBody>
          <form>
            <div>
              <div className="form-group">
                <label>
                Last working day <strong className="text-danger">*</strong>
                </label>
                <input
                  className="form-control"
                  value={terminate.date}
                  type="date"
                  onChange={(e) => {
                    setTerminate({ ...terminate, date: e.target.value });
                  }}
                />
                {error?.date && (
                  <b style={{ color: "red", textTransform: "capitalize" }}>
                    {error.date}
                  </b>
                )}
              </div>
              <div className="form-group">
                <label>
                  Reason <strong className="text-danger">*</strong>
                </label>
                <Input
                  type="textarea"
                  className="form-control"
                  value={terminate.reason}
                  onChange={(e) =>
                    setTerminate({ ...terminate, reason: e.target.value })
                  }
                />
                {error?.reason && (
                  <b style={{ color: "red", textTransform: "capitalize" }}>
                    The {error.reason}
                  </b>
                )}
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <div>
            <button className="btn btn-secondary mr-3" onClick={props.isClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={submitTerminateData}>
              {props.data ? "Update" : "Exit"}
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default memo(Terminate);
