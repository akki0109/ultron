import React,{memo} from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { terminateForever } from "../../../../../services/admin/terminateUser.service";

const ConfirmTerminate = (props) => {

    const confirmedTerminate = () => {
        props.isClose();
        terminateForever(props.id).then((result) => {
          if (result?.data?.errors) {
            props.setError(result?.data?.errors);
          }
          if (result?.status == "200") {
            console.log(222,result.message);
            props.userList();
          }
        });
      };

  return (
    <div>
      <Modal show={props.show} onHide={props.isClose}>
        <Modal.Header>
          <Modal.Title>Terminate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Do You Want to Delete Forever</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.isClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              confirmedTerminate();
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default memo(ConfirmTerminate);
