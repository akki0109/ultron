import React, { useEffect, useState, memo } from "react";
import {
  saveModule,
  updateModule,
  getSingleModuleData,
} from "../../Services/taskBoard.services";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label
} from "reactstrap";

function Module(props) {
  const [modules, setModules] = useState();
  const [error, setError] = useState([]);
  useEffect(() => {
    if (props.modulesToggle == true) {
      setError("");
      if (!props.updateModule) {
        setModules({
          projectId: props.projectId,
          sprintId: props.sprintId,
          title: "",
        });
      } else getMouduleData();
    }
  }, [props.modulesToggle]);

  const saveData = () => {
    saveModule(modules).then((result) => {
      // console.log(3322,result);
      if (result.status == 200) {
        
        props.refresh();
        props.setModulesToggle(false);
      } else setError(result.response.data.data.errors);
    });
  };
  const handleChange = (name, value) => {
    setModules({ ...modules, [name]: value });
  };

  const getMouduleData = () => {
    getSingleModuleData({ taskModuleId: props.taskModuleId }).then((result) => {
      if (result.status == 200) {
        setModules({
          projectId: props.projectId,
          sprintId: props.sprintId,
          title: result.data[0].taskmodules?.title,
        });
      }
    });
  };
  const updateData = () => {
    updateModule({ ...modules, _id: props.taskModuleId }).then((result) => {

      if (result.status == 200) {
        props.refresh();
        props.setModulesToggle(false);
       
      } else setError(result);
    });
  };
  return (
    <div>
      <Modal isOpen={props.modulesToggle} {...props}>
        <ModalHeader toggle={() => props.setModulesToggle(false)}>
          {props.updateModule ? props.updateModule : "Add Module"}
        </ModalHeader>
        <ModalBody>
          <Label>Module Name</Label>
          <Input
            placeholder="Enter Module Name"
            onChange={(e) => handleChange("title", e.target.value)}
            value={modules?.title}
          />
          <span className="d-block mt-1 text-danger">
            {error.title ? error.title[0] + "." : ""}
          </span>
        </ModalBody>
        <ModalFooter>

         
          <Button
            color="secondary"
            className="mr-3"
            onClick={() => {
              props.setModulesToggle(false);
            }}
          >
            Cancel
          </Button>
          <Button
            color="success"
            onClick={props.updateModule ? updateData : saveData}
          >
            Save
          </Button>

        </ModalFooter>
      </Modal>
    </div>
  );
}

export default memo(Module);
