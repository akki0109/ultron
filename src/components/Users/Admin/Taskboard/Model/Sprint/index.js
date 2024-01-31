import axios from "axios";
import React, { memo, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import dateFormat from "dateformat";
import { APIURL } from "../../../../../../constants/config";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Row,
  FormGroup,
  Label,
  Input,
  Col,
} from "reactstrap";

const Index = (props) => {
  const [Sprint, setSprint] = useState({
    title: "",
    startDate: "",
    endDate: "",
    projectId: props.ID,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    setSprint({
      ...Sprint,
      title: "",
      startDate: "",
      endDate: "",
    });
  }, [props.toggle]);

  const handleChange = (name, value) => {
    setSprint({ ...Sprint, [name]: value });
  };

  const Save = () => {
    const body = {
      ...Sprint,
      startDate: Sprint.startDate
        ? dateFormat(Sprint.startDate, "isoDate")
        : "",
      endDate: Sprint.endDate ? dateFormat(Sprint.endDate, "isoDate") : "",
    };
    axios
      .post(APIURL + "sprint/saveSprint", body)
      .then(() => {
        props.setToggle(false);
        props.updateSprintTask();
      })
      .catch((error) => {
        const errors = error?.response?.data?.data?.errors;
        if (errors) {
          setError(errors);
        }
      });
  };

  return (
    <>
      <Modal isOpen={props.toggle} size="md">
        <ModalHeader
          toggle={() => {
            props.setToggle(false);
          }}
        >
          Add Sprint
        </ModalHeader>
        <ModalBody className="overflow-visible">
          <Form>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="Text"> Sprint Name </Label>
                  <Input
                    id="Text"
                    name=""
                    placeholder="Sprint Name"
                    onChange={(e) => handleChange("title", e.target.value)}
                  />

                  <span className="text-danger">
                    {error.title ? error.title[0] : ""}
                  </span>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="example">Start Date</Label>
                  <DatePicker
                    placeholderText="DD-MM-YYYY"
                    selected={Sprint.startDate}
                    onChange={(date) => handleChange("startDate", date)}
                    name="taskDate"
                    dateFormat="dd-MM-yyyy"
                    autoComplete="off"
                    className="form-control"
                  />

                  <span className="text-danger">
                    {error.startDate ? error.startDate[0] : ""}
                  </span>
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="exampleAddress">End Date</Label>
              <DatePicker
                placeholderText="DD-MM-YYYY"
                selected={Sprint.endDate}
                onChange={(date) => handleChange("endDate", date)}
                name="taskDate"
                dateFormat="dd-MM-yyyy"
                autoComplete="off"
                className="form-control"
              />

              <span className="text-danger">
                {error.endDate ? error.endDate[0] : ""}
              </span>
            </FormGroup>
          </Form>
          <span className="text-danger">
            {error.common ? error.common[0] : ""}
          </span>
        </ModalBody>
        <ModalFooter>

          
          <Button
            color="btn btn-default mr-3"
            onClick={() => {
              props.setToggle(false);
            }}
          >
            Cancel
          </Button>
          <Button color="success"  onClick={() => Save()}>
            Save
          </Button>

        </ModalFooter>
      </Modal>
    </>
  );
};

export default memo(Index);
