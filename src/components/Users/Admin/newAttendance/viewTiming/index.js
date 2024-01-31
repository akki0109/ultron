import React, { memo, useState } from "react";
import dateFormat from "dateformat";
import {
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
  Button,
} from "reactstrap";
import Request from "../ApplyRegularize";

const Regularize = ({ i, attendaceDetails, date, getAtendanceList }) => {
  const [toggle, setToggle] = useState(false);
  const openModel = () => {
    setToggle(true);
  };

  return (
    <UncontrolledPopover placement="bottom" target={`UncontrolledPopover${i}`}>
      <PopoverHeader>
        {dateFormat(date, "ddd, dd mmmm  yyyy")}
        <Button
          className="ic-edit icon icon-sm text-link mr-8 regularize_btn mt-3"
          onClick={openModel}
        >
          Regularize
        </Button>
      </PopoverHeader>
      <PopoverBody>
        <div class="row m-0">
          <div class="col-12 p-0">
            <p class="mb-3">
              <strong>Web Clock In</strong>
            </p>
            {attendaceDetails?.map((item) => (
              <div class="log_stats">
                <div class="row m-0">
                  <div class="col-6 p-0">
                    <span>
                      <i class="fa fa-long-arrow-left mr-1 rotate_arrow green_text"></i>
                      {item.log_in_time}
                    </span>
                  </div>
                  <div class="col-6 p-0 ">
                    <span class="text-uppercase">
                      {item.log_out_time ? (
                        <>
                          <i class="fa fa-long-arrow-right mr-1 rotate_arrow red_text"></i>{" "}
                          {item.log_out_time}
                        </>
                      ) : (
                        <>
                          <i class="fa fa-long-arrow-right mr-1 rotate_arrow red_text"></i>
                          Missing
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Request isOpen={toggle} setToggle={setToggle} />
        <Request
          isOpen={toggle}
          setToggle={setToggle}
          attendanceList={attendaceDetails}
          pageRefresh={getAtendanceList}
          attendanceListDate={date}
        />
      </PopoverBody>
    </UncontrolledPopover>
  );
};

export default memo(Regularize);
