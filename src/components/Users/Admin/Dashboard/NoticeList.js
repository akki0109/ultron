import React from "react";
import { APIURL } from "../../../../constants/config";
import dateFormat from "dateformat";
import ThumbUp from "../../../../assets/images/thumb-up.png";
import Pending from "../../../../assets/images/pending.png";
import ThumbUpFill from "../../../../assets/images/thumb-up-fill.png";

const NoticeList = ({
  noticeList,
  getUserInitials,
  userList,
  acknowledgement,
  trashNotice,
  currentUser,
}) => {
  return (
    <div className="noticelist">
      {noticeList.length ? (
        noticeList.length &&
        noticeList.map((item, index) => (
          <div className="noticelist__list" key={"notice" + index}>
            <div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex">
                  <div className="noticelist__img mr-2">
                    {item?.noticeboards?.createdBy?.profileImage ? (
                      <a
                        href="javascript:;"
                        title={
                          item?.noticeboards?.createdBy?.first_name +
                          " " +
                          item?.noticeboards?.createdBy?.last_name
                        }
                      >
                        <img
                          src={
                            APIURL +
                            "assets/uploads/profileImages/" +
                            item?.noticeboards?.createdBy?.profileImage
                          }
                          alt={
                            item?.noticeboards?.createdBy?.first_name +
                            " " +
                            item?.noticeboards?.createdBy?.last_name
                          }
                        />
                      </a>
                    ) : (
                      <a
                        title={
                          item?.noticeboards?.createdBy?.first_name +
                          " " +
                          item?.noticeboards?.createdBy?.last_name
                        }
                      >
                        <span>
                          {getUserInitials(
                            item?.noticeboards?.createdBy?.first_name
                          ) +
                            getUserInitials(
                              item?.noticeboards?.createdBy?.last_name
                            )}
                        </span>
                      </a>
                    )}
                  </div>
                  <div>
                    <h6 className="noticelist__cnt--nm">
                      {item?.noticeboards?.createdBy?.first_name +
                        " " +
                        item?.noticeboards?.createdBy?.last_name}
                    </h6>
                    <span className="small">
                      {dateFormat(
                        item?.noticeboards?.createdAt,
                        "mmmm dS, yyyy, h:MM TT"
                      )}
                    </span>
                    {currentUser.data._id ==
                      item.noticeboards.createdBy._id && (
                      <a href="javascript:;" className="delete_tag theme_red ml-3 small " onClick={() => trashNotice(item.noticeboards._id, index) }> Delete </a>
                    )}
                  </div>
                </div>
                <div>
                  <div className="noticelist__cnt d-flex justify-content-between">
                    <div className="small">
                      <div className="d-flex align-items-center">
                        <div
                          className={
                            item.noticeboards.acknowledments.some((i) => {
                              return i.userId._id == currentUser.data._id;
                            })
                              ? "custome__dd mr-1 acknowledgement active"
                              : "custome__dd mr-1 acknowledgement check"
                          }
                        >
                          <a
                            href="javascript:;"
                            onClick={() => {
                              acknowledgement(item.noticeboards._id, index);
                            }}
                            className="check"
                          >
                           
                            <img
                              src={
                                item.noticeboards.acknowledments.some((i) => {
                                  return i.userId._id == currentUser.data._id;
                                })
                                  ? ThumbUpFill
                                  : ThumbUp
                              }
                              style={{ zIndex: "0" }}
                            />
                          </a>

                          <span className="badge small">
                            {item.noticeboards.total_acknowledments}
                          </span>
                          {item.noticeboards.acknowledments.length > 0 && (
                            <div className="custome__menu">
                                <h6>Acknowledged</h6>
                              <ul>
                                {item.noticeboards.acknowledments?.map(
                                  (item, i) => (
                                    <li key={item?._id + i}>
                                      <span className="a">
                                        {item.userId.first_name +
                                          " " +
                                          item.userId.last_name}
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="custome__dd pending">
                          <strong href="#" className="check">
                            <img src={Pending} style={{ zIndex: "0" }} />
                          </strong>
                          <span className="badge small">
                            {item?.noticeboards?.assignedTo?.length
                              ? item?.noticeboards?.assignedTo?.length +
                                1 -
                                item.noticeboards.total_acknowledments>0?
                                (item?.noticeboards?.assignedTo?.length +
                                1 -
                                item.noticeboards.total_acknowledments):0
                              : userList.length -
                                item.noticeboards.total_acknowledments}
                          </span>

                          {((item.noticeboards.assignedTo.length == 0 &&
                            userList.length -
                              item.noticeboards.acknowledments.length >
                              0) ||
                            (item.noticeboards.assignedTo.length > 0 &&
                              item.noticeboards.assignedTo.length -
                                item.noticeboards.acknowledments.length +
                                1 >
                                0)) && (
                            <div className="custome__menu">
                            <h6>Pending Acknowledgement</h6>
                              <ul data-id={item.noticeboards.assignedTo.length}>
                                {item.noticeboards.assignedTo.length == 0
                                  ? userList.map((i, y) => {
                                      let arr =
                                        item.noticeboards.acknowledments.map(
                                          (j) => j.userId._id
                                        );
                                      if (
                                        arr.filter((j) => j == i.id).length == 0
                                      )
                                        return (
                                          <li key={i?.id + y}>
                                            <span className="a">{i.name}</span>
                                          </li>
                                        );
                                    })
                                  : [
                                      ...item.noticeboards.assignedTo,
                                      item.noticeboards.createdBy,
                                    ]?.map((i) => {
                                      let arr =
                                        item.noticeboards.acknowledments.map(
                                          (j) => j.userId._id
                                        );
                                      if (
                                        arr.filter((k) => k == i._id).length ==
                                        0
                                      )
                                        return (
                                          <li key={i._id}>
                                            <span className="a">
                                              {i.first_name + " " + i.last_name}
                                            </span>
                                          </li>
                                        );
                                    })}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="small ml-5 mt-1">
                {item?.noticeboards?.assignedTo?.length ? (
                  <span>
                    <span>To :</span>
                    {item?.noticeboards?.assignedTo?.length &&
                      item?.noticeboards?.assignedTo.map((assignee, i) => (
                        <span key={"asignee" + index + i}>
                          {item?.noticeboards?.assignedTo?.length - 1 != i
                            ? " " +
                              assignee?.first_name +
                              " " +
                              assignee?.last_name +
                              ",  "
                            : " " +
                              assignee?.first_name +
                              " " +
                              assignee?.last_name}
                        </span>
                      ))}
                  </span>
                ) : null}
              </div>
            </div>

            <div
              className="noticelist__list--desc"
              dangerouslySetInnerHTML={{ __html: item?.noticeboards?.title }}
            ></div>
          </div>
        ))
      ) : (
        <div className="text-center">
          <div className="norecords">RECORD NOT FOUND</div>
        </div>
      )}
      
    </div>
  );
};

export default NoticeList;
