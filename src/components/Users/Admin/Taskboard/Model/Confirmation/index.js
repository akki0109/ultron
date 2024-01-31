import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
  deleteModule,
  deleteTaskApiCall,
} from "../../Services/taskBoard.services";
import React, { memo, useState } from "react";
import { APIURL } from "../../../../../../constants/config";
import socketClient from "socket.io-client";

function ConfimationModel(props) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isLoading, setLoading] = useState(false);

  const deleteModuleBox = () => {

    setLoading(true);
    deleteModule(props.moduleId).then((result) => {
      if (result.status == 200) {
        handleClose();
        props.refresh();
      } else console.log("error", result);
      setLoading(false);
    });
  };

  const handleClose = () => {
    props.setDeleteConfirm(false);
  };

  const deleteTask = () => {
      setLoading(true);
      deleteTaskApiCall({ _id: props.taskId._id }).then((result) => {
        if (result.status == 200) {
          handleClose();
          props.getTask();
          sendNotification({userId:[],projectId:props.projectId});
        }
        setLoading(false);
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

  return (
    <>
      <Modal show={props.deleteConfirm} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Delete {props.taskId?.delete} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this {props.taskId?.delete} ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="mr-3" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={
              props.taskId?.delete == "Task" ? deleteTask : deleteModuleBox
            }
            disabled={isLoading}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default memo(ConfimationModel);
