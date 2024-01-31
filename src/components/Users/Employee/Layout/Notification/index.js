import React, { useEffect, useState, useRef } from "react";
import { notificationService } from "../../../../../services/admin/notification.services";
import moment from "moment/moment";
import { APIURL } from "../../../../../constants/config";
import socketClient from "socket.io-client";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const Index = (props) => {
  const [NotificationShow, setNotificationShow] = useState([]);
  const [page, setPage] = useState(1);
  const listInnerRef = useRef(null);
  useEffect(() => {
    configureSocket();
    updateNotification();
  }, []);
  useEffect(() => {
    if(page>0){
      getNotification();
    }
  }, [page]);
  const updateNotification = () => {
    notificationService.updateCountNotification(props.userId).then((result) => {
      if (result.status == 200) props.setNotificationCount();
    });
  };
  const getNotification = () => {
    notificationService.getNotification(props.userId, page).then((result) => {
      if (result.status == 200)
        if (page != 1) setNotificationShow((x) => [...x, ...result.data]);
        else setNotificationShow(result.data);
    });
  };

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        setPage((x) => x + 1);
      }
    }
  };

  const configureSocket = () => {
    var socket = socketClient(APIURL, { transports: ["websocket"] });

    socket.on("notification_board", (data) => {
      if (
        props.toggleNotification == true &&
        data.userId.includes(props.userId) == true
      ) {
        setPage(0);
        updateNotification();
        setTimeout(function(){setPage(1);},200);
      }
    });
  };

  return (
    <>
      {NotificationShow.length > 0 && (
        <div className="list-scroll">
          <h3>Notifications</h3>
          <ul
            className="list-group arrow-top"
            ref={listInnerRef}
            onScroll={() => onScroll()}
          >
            {NotificationShow.map((item) => (
              <li className="list-group-item notification-single-item" key={item.tasknotifications._id} onClick={()=>props.setToggle()}>
                <div className="d-flex align-items-start">
                 <div className="user_assign">
                    <span
                      data-toggle="tooltip"
                      data-placement="top"
                      className="mt-2"
                      title={
                        item.tasknotifications.createdBy?.first_name +
                        " " +
                        item.tasknotifications.createdBy?.last_name
                      }
                    >
                      <div>
                        {item.tasknotifications.createdBy?.profileImage ? (
                          <a href="#" className="avtar">
                           <img
                              src={
                                APIURL + "assets/uploads/profileImages/"+
                                item.tasknotifications.createdBy?.profileImage
                              }
                              alt={
                                item.tasknotifications.createdBy?.first_name +
                                " " +
                                item.tasknotifications.createdBy?.last_name
                              }
                            />
                          </a>
                        ) : (
                          <div className="avtar">
                            {item.tasknotifications.createdBy?.first_name?.slice(
                              0,
                              1
                            ) +
                              item.tasknotifications.createdBy?.last_name.slice(
                                0,
                                1
                              )}
                          </div>
                        )}
                      </div>
                    </span>
                  </div>
                  <Link
                     style={{
                      display: "block",
                      textDecoration: "none", 
                      color: "inherit", 
                    }}
                    to={
                      "/employee/taskboard/" +
                      item?.tasknotifications?.taskId?.projectId?._id
                    }
                  >
                    <div>
                      <p
                        className="mb-0 ml-4 textoverflow-2"
                        dangerouslySetInnerHTML={{
                          __html: item.tasknotifications.text,
                        }}
                      ></p>
                      <p className="noticelist__cnt--nm ml-4 text-lowercase">
                        {moment(item.tasknotifications.createdAt).fromNow()}
                      </p>
                    </div>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Index;
