import React, { useMemo, memo } from "react";
import { monthNames } from "../../../../../utilities/reportContent";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";
import moment from "moment";
import { CSVLink } from "react-csv";

const Index = (props) => {
  const month = monthNames[props.month];
  const projectName = props.project;

  const csvData = useMemo(() => {
    return props.graphData?.map((item, index) => {
      return {
        DATE:
          index > 0 &&
          props.graphData[index - 1].projecttasks.date !=
            item?.projecttasks.date
            ? moment(item?.projecttasks.date)?.format("DD/MM/YYYY")
            : index == 0
            ? moment(item?.projecttasks.date)?.format("DD/MM/YYYY")
            : "",
        USER:
          item?.userData[0]?.first_name + " " + item?.userData[0]?.last_name,
        TASK: item?.projecttasks?.task_description,
        TIME: item?.projecttasks?.time,
      };
    });
  }, [props.graphData]);

  const headers = useMemo(() => {
    return [
      { label: "DATE", key: "DATE" },
      { label: "USER", key: "USER" },
      { label: "TASK", key: "TASK" },
      { label: "TIME", key: "TIME" },
    ];
  }, []);
  return (
    <>
      <Modal isOpen={props.toggle} size="xxl" className="timesheetmodal">
        <ModalHeader toggle={() => props.setToggle(false)} className="w-100">
          <div className="d-flex justify-content-between w-100">
            <div>
              {projectName}&nbsp;"{month}" Details
            </div>
            <Button>
              <CSVLink
                data={csvData}
                filename={`${projectName} "${month}" Details`}
                headers={headers}
              >
                Download
              </CSVLink>
            </Button>
          </div>
        </ModalHeader>
        <ModalBody className="timesheetmodal__list">
          <Table>
            <thead className="thead-fix">
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Task</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {props.graphData?.map((item, index) => (
                <tr key={item.projecttasks._id}>
                  <th scope="row" className="text-nowrap">
                    {index == 0 &&
                      moment(item?.projecttasks.date)?.format("LL")}
                    {index > 0 &&
                      props.graphData[index - 1].projecttasks.date !=
                        item?.projecttasks.date &&
                      moment(item?.projecttasks.date)?.format("LL")}
                  </th>
                  <td className="text-capitalize text-nowrap">
                    {item?.userData[0]?.first_name}{" "}
                    {item?.userData[0]?.last_name}
                  </td>
                  <td>
                    <div className="text-capitalize">
                      <a>{item?.projecttasks?.task_description}</a>
                    </div>
                  </td>
                  <td>{item?.projecttasks?.time}</td>
                </tr>
              ))}
              {props.graphData.length == 0 && (
                <tr>
                  {" "}
                  <td colSpan={4} align="center">
                    <div className="norecords">No Record Found</div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={() => props.setToggle(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default memo(Index);