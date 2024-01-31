import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalHeader, Button } from "reactstrap";
import { commentSaveRequest, commentUpdateRequest,getAllComments,ticketEditRequest } from "../../../../services/admin/ticket.services";
import dateFormat from "dateformat";
// import Select from "react-select";
// import { statusOptions, priorityOptions } from "../../../../utilities/reportContent";
// import { colourStyles } from "../../../../constants/ColorStyle";
import socketClient from "socket.io-client";
import { APIURL } from "../../../../constants/config";

const Index = ({ isComment, closeComment,ticketId }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [loading, setLoading] = useState(false);
    const [commentDescription, setCommentDescription] = useState("");
    const [error, setError] = useState({});
    const [isEditable, setIsEditable] = useState(false);
    const [commentId, setCommentId] = useState("");
    const [commentList, setCommentList] = useState([]);
    const [ticketInfo, setTicketInfo] = useState([]);
    const [localTicketId, setLocalTicketId] = useState("");
    
    useEffect(() => {
        
        console.log(loading);
        //configureSocket(ticketId);
        console.log("testttt");
    }, []);

    useEffect(() => {

        if(ticketInfo?.assignedTo?.length){
            liveNotification();
        }
    }, [ticketInfo]);


    useEffect(() => {
       if(ticketId!="")
        {
            getComments();
            ticketDetails(ticketId);
            setLocalTicketId(ticketId);
            
        }
    }, [ticketId,isComment]);

    useEffect(() => {
       
        
        if(localTicketId!="")
        {
            configureSocket();
        }
    }, [localTicketId]);

    const liveNotification = () => {
        //for live notification 
        var socket = socketClient(APIURL, { transports: ["websocket"] });
        let assignToNew=[];
        ticketInfo?.assignedTo.map((itm)=>{
            assignToNew.push({_id:itm?.assignTo[0]?._id});
        });
       
        socket.emit("ticket", {assignTo:assignToNew,action:"view"});

    };

    const descriptionHandler = (e) => {
        setError({});
        setCommentDescription(e.target.value);
    };

    const sendCommentRequest = () => {
        setError({});
        let payload = {
            commentDesc: commentDescription,
            userId: user?.data?._id,
            ticketId: ticketId
        };
        setLoading(true);
        commentSaveRequest(payload).then((data) => {
            if (data.status === 200) {
                setCommentDescription("");
                setLoading(false);
                var socket = socketClient(APIURL, { transports: ["websocket"] });

                data.data.ticketAssignee=ticketInfo?.assignedTo;
                socket.emit("ticketComment", data);
                //getComments();

                //commentListFun(ticketId);
            }
            else {
                setError(data.errors);
                setLoading(false);
            }
        }).catch((error) => {
            setError(error);
            setLoading(false);
        });
    };

    /*const deleteCommentRequest = (id) => {
        let payload = { "_id": id };
        setLoading(true);
        commmentDeleteRequest(payload).then((data) => {
            if (data.status === 200) {
                setLoading(false);
                setIsEditable(false);
                setError({});
                setCommentDescription("");
                commentListFun(ticketId);
            }
        }).catch((error) => {
            console.log("erroes", error);
            setError(error);
            setLoading(false);
        });
    };*/

    /*const updateCommentFun = (comment) => {
        console.log("item", comment);
        setIsEditable(true);
        setCommentId(comment?.ticketcomments?._id);
        setCommentDescription(comment?.ticketcomments?.commentDesc);
    };*/

    const updateCommentRequest = () => {
        setError({});
        let payload = {
            _id: commentId,
            commentDesc: commentDescription,
            userId: user?.data?._id,
            ticketId: ticketId
        };

        setLoading(true);
        commentUpdateRequest(payload).then((data) => {
            if (data.status === 200) {
                setIsEditable(false);
                setCommentId("");
                setCommentDescription("");
                setLoading(false);
                getComments();
                //commentListFun(ticketId);
            }
            else {
                setError(data.errors);
                setLoading(false);
            }
        }).catch((error) => {
            setError(error);
            setLoading(false);
        });
    };


    const configureSocket = () => {
        var socket = socketClient(APIURL, { transports: ["websocket"] });
        socket.on("ticketComment", data => {
            if ( localTicketId == data.data.ticketId) {
                setLoading(false);
                getComments();
            }
        });

    };


   
    const getComments = () => {
        
        let payload = {
            ticketId: ticketId,
            userId: user?.data?._id
        };
        setLoading(true);
        getAllComments(payload).then((data) => {
            if (data.status === 200) {
                setCommentList(data?.data);
                setLoading(false);
                setError({});
            }else {
                setError(data.errors);
                setLoading(false);
            }
        }).catch((error) => {
            setError(error);
            setLoading(false);
        });
    };

    const ticketDetails = (id) => {
       
        setLoading(true);
        let request = {
            ticketId: id,
        };
        ticketEditRequest(request).then((data) => {
            if (data.status === 200) {
                setTicketInfo(data?.data[0]);
                setLoading(false);
                setError({});
            }
        }).catch((error) => {
            setError(error);
            setLoading(false);
        });
    };

    const ticketFormate =(tiId)=>{
        tiId = "" + tiId;
        if(tiId.length==1)
        {
           tiId="000"+tiId;
        }
        else if(tiId.length==2)
        {
            tiId="00"+tiId;
        }
        else if(tiId.length==3)
        {
            tiId="0"+tiId;
        }
        
        return "#"+tiId;
    };

    const getUserInitials = (Name) => {
        if (Name !==undefined && Name !==null && Name != "") {
            const initials = Name.charAt(0);
            return initials.toUpperCase();
        }
        else {
            return "";
        }
    };

    return (
        <React.Fragment>
            <Modal size="lg" isOpen={isComment} toggle={() => { closeComment(); setIsEditable(false); setCommentId(""); setCommentDescription(""); }}>
                <div className="modal-content task_ticket">
                    <ModalHeader className="header-less" toggle={() => { closeComment(); setIsEditable(false); setCommentId(""); setCommentDescription(""); }}>
                        <div>Comment Section</div>
                    </ModalHeader>
                    <ModalBody className="modal-body">                        
                        <div className="row">
                            <div className="col-8">
                                <h6>{ticketFormate(ticketInfo?.tickets?.ticket_UID)}</h6>
                                <hr />
                                <p>{ticketInfo?.tickets?.title}</p>
                                <div className="form-group">
                                    <label>Comment<strong className="text-danger">*</strong></label>
                                    <textarea max="250" type="text" rows="5" value={commentDescription} onChange={(e) => descriptionHandler(e)}  className="form-control"></textarea>
                                    {error ? <span className="text-danger"> {error?.commentDesc}</span> : ""}
                                </div>
                                <div className="text-right">
                                 <Button className="btn btn-primary" disabled={commentDescription==""?true:false  } color="primary" onClick={() => isEditable ? updateCommentRequest() : sendCommentRequest()}>{isEditable ? "Update" : "Send"}</Button>
                                </div>
                            </div>
                            <div className="col-4">
                                <h6>Details</h6>
                                <hr />
                                <div className="mb-3">
                                    <span className="small">Priority</span><br />
                                     {ticketInfo?.tickets?.priority === "high" ?
                                        <strong>High</strong> :
                                        ticketInfo?.tickets?.priority === "medium" ?
                                        <strong>Medium</strong> :
                                        <strong>Low</strong>
                                    }
                                    
                                </div>
                                <div className="mb-3">
                                    <span className="small">Status</span><br />
                                    {ticketInfo?.tickets?.status === "close" ?
                                        <strong>Close</strong>
                                        : ticketInfo?.tickets?.status === "open" ?
                                        <strong>Open</strong> :
                                        <strong>{ticketInfo?.tickets?.status}</strong>
                                    }
                                </div>
                                <div className="mb-3">
                                    <span className="small">Assign To</span><br />
                                    <div className="user_assign">
                                        {ticketInfo?.assignedTo?.length ? ticketInfo?.assignedTo.map((profile, index) => (
                                            <div className="user_assign" key={index} >
                                                {
                                                    profile?.assignTo[0]?.profileImage ?
                                                        <span className="a"  href="javascript:;" title={profile?.assignTo[0]?.first_name +" "+ profile?.assignTo[0]?.last_name}>
                                                            <img
                                                                src={APIURL + "/assets/uploads/profileImages/" + profile?.assignTo[0]?.profileImage}
                                                                alt={profile?.assignTo[0]?.first_name}
                                                                style={{ width: "38px", height: "38px", borderRadius: "50%" }}
                                                            />
                                                        </span>
                                                        :
                                                         <span className="a avtar"  href="javascript:;" title={profile?.assignTo[0]?.first_name +" "+ profile?.assignTo[0]?.last_name}>
                                                            {getUserInitials(profile?.assignTo[0]?.first_name) + getUserInitials(profile?.assignTo[0]?.last_name)}
                                                        </span>
                                                }

                                            </div>
                                        )) : null}
                                    </div>
                                   
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="comment-area mt-4">
                                 {commentList.length ? commentList.map((comment, i) => (
                                    <React.Fragment key={i}>
                                        
                                            <div className="d-flex">
                                                <div>
                                                    <span className="avtar">{comment?.userId[0]?.first_name.charAt(0).toUpperCase() + comment?.userId[0]?.last_name.charAt(0).toUpperCase()}</span>
                                                </div>
                                                <div className="w-100">
                                                    <div className="d-flex mb-3">
                                                        <h6 className="mr-3 mb-0">{comment?.userId[0]?.first_name + " " + comment?.userId[0]?.last_name}</h6>
                                                        <div> <span className="small">{dateFormat(comment?.ticketcomments?.updatedAt, "ddd, dd mmm")} , {dateFormat(comment?.ticketcomments?.updatedAt, "hh:MM TT")}</span> </div>
                                                    </div>
                                                    <div className="comment">
                                                        <p>{comment?.ticketcomments?.commentDesc ? comment?.ticketcomments?.commentDesc : null}</p>
                                                    </div>

                                                </div>
                                            </div>
                                        
                                    </React.Fragment>
                                )) : null}
                                </div>
                               
                            </div>
                        </div>

                    </ModalBody>
                </div>
            </Modal>
        </React.Fragment>
    );
};

export default Index;
